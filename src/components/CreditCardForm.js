import {useRef, useEffect, useState} from "react";
import Image from "./Image";
import {CgAsterisk} from "react-icons/cg";
import {BsFillCreditCard2FrontFill} from "react-icons/bs";
import {VscQuestion} from "react-icons/vsc";
import useFetch from "./useFetch";

const CreditCardForm = ({setNotification}) => {
    const [cardOrg, setCardOrg] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiryMonth, setCardExpiryMonth] = useState("");
    const [cardExpiryYear, setCardExpiryYear] = useState("");
    const [cardCVV, setCardCVV] = useState("");
    const [formErrors, setFormErrors] = useState({
        name: '',
        number: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '' 
    });
    const [submit, setSubmit] = useState(false);
    const {data:cards, isLoading, error:fetchCardsError} = useFetch("http://localhost:4000/cards"); 
    const count = useRef(0);


    useEffect(() => {
        if(fetchCardsError != null){
            setNotification({
                display: true,
                success: false,
                msg: fetchCardsError
            });
        }else{
            setNotification({
                display: false,
                success: true,
                msg: ''
            });
        }
    }, [fetchCardsError]);

    useEffect(() => {

        if(!submit){
            return;
        }
        count.current += 1;
        setSubmit(false);

        for(let prop in formErrors){
            if(formErrors[prop] !== ''){
                return;
            }
        }

        setFormErrors({
            name: '',
            number: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '' 
        });

        setNotification({
            display: true,
            success: true,
            msg: "Credit Card was successfully added."
        });

        count.current = 0;

        setCardName('');
        setCardNumber('');
        setCardExpiryMonth('');
        setCardExpiryYear('');
        setCardCVV('');

    }, [submit]);

    useEffect(() => {
        if(count.current){
            validateCardName(cardName);
        }
        
    }, [cardName]);

    useEffect(() => {
        if(count.current){
            validateCardNumber(cardNumber);
        }
        
    }, [cardNumber]);

    useEffect(() => {
        if(count.current){
            validateCardExpiryMonth(cardExpiryMonth);
        }
    }, [cardExpiryMonth]);

    useEffect(() => {
        if(count.current){
            validateCardExpiryYear(cardExpiryYear);
        }
    }, [cardExpiryYear]);

    useEffect(() => {
        if(count.current){
            validateCardCVV(cardCVV);
        }
    }, [cardCVV]);

    
    let year = (new Date()).getFullYear();

    const monthsOptions = () => {
        const options = [<option key="0" value="month">Month</option>];
    
        for(let i = 1; i <= 12; ++i){
            options.push(<option key={i} value={i}>{i}</option>)
        }
    
        return options;
    };
    
    const yearOptions = (year) => {
        const options = [<option key="0" value="year">Year</option>];
    
        for(let i = 1; i <= 5; ++i){
            let yearValue = year + i;
            options.push(<option key={i} value={yearValue}>{yearValue}</option>);
        }
    
        return options;
    
    };

    const creditCardNumFormat = (num) => {
        let clean = num.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = clean.match(/\d{4,16}/g);
        const match = (matches && matches[0]) ?? '';
        const parts = [];
        let len = match.length;
        if(clean && (clean.length >= 1)){ 
            for(let card of cards){
                if(card.prefix.includes(Number(clean.substring(0, 1)))){
                    setCardOrg(card.name);
                    break;
                }else if(card.prefix.includes(Number(clean.substring(0, 2)))){
                    setCardOrg(card.name);
                    break;
                }else{
                    setCardOrg("");
                }
            }
        }else if(clean.length === 0){
            setCardOrg("");
        }
    
        for (let i = 0; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
    
        if (parts.length) {
            return parts.join(' ');
        } 

        return clean;

    };

    const setFormCardName = ({target}) => {
        setCardName(target.value);
    };

    const setFormCardNumber = ({target}) => {
        setCardNumber(creditCardNumFormat(target.value));
    };

    const setFormCardExpiryMonth = ({target}) => {
        setCardExpiryMonth(target.value);
    };

    const setFormCardExpiryYear = ({target}) => {
        setCardExpiryYear(target.value);
    };

    const setFormCardCVV = ({target}) => {
        setCardCVV(target.value);
    };

    const hansLuhnAlgo = val => {
        val = val.replace(/\s+/g, '');
        if (!/^[0-9]{13,19}$/.test(val)){
            return false;
        }
        let checksum = 0; 
        let j = 1; 

        for(let i = val.length - 1; i >= 0; i--){
          let calc = 0;
          calc = Number(val.charAt(i)) * j;

          if(calc > 9){
            checksum = checksum + 1;
            calc = calc - 10;
          }

          checksum = checksum + calc;

          if(j === 1) {
              j = 2;
          }else{
            j = 1;
          }
        }
        return (checksum % 10) === 0;
    }

    const validateCardName = name =>{
        const cardNameRegEx = new RegExp(/^([A-Za-z.\-']+)\s([A-Za-z.\-']+)$/, 'g');
        let msg = "";
        if(!cardNameRegEx.test(name)){
            msg = "Please check the name on the card.";
        }

        setFormErrors(prevValues => ({...prevValues, name: msg}));
    
    };

    const validateCardNumber = number => {
        let msg = "";

        if(number.trim() === ""){
            setCardOrg("");
            msg = "Please provide your credit card number.";
        }

        if(msg === "" && !hansLuhnAlgo(number) && number.trim() !== ""){
            setCardOrg("");
            msg = "Invalid credit card number";
        }
        
        if(msg === "" && cardOrg === "" && number.trim() !== ""){
            let cardNames = "";
            for(let [i, card] of Object.entries(cards)){
                if((cards.length - 1) === Number(i)){
                    cardNames += "and "
                }
                cardNames += card.name;
                if((cards.length - 1) !== Number(i)){
                    cardNames += ", ";
                }else{
                    cardNames += ".";
                }
            }
            msg = `Unknown card type, we only support ${cardNames}`;
        }

        setFormErrors(prevValues => ( {...prevValues, number: msg} ));
    };

    const validateCardExpiryMonth = expiryMonth => {
        let msg = "";
        
        if(expiryMonth === "" || isNaN(Number(expiryMonth))){
            msg = "Month of expiry required.";
        }

        if((expiryMonth !== "" ) && ((Number(expiryMonth) < 1) || (Number(expiryMonth) > 12))){
            msg = "Month is out of range.";
        }

        setFormErrors(prevValues => ( {...prevValues, expiryMonth: msg} ));
    };

    const validateCardExpiryYear = expiryYear => {
        let msg = "";
        let thisYear = new Date().getFullYear();
        if(expiryYear === "" || isNaN(Number(expiryYear))){
            msg = "Year of expiry required";
        }
        
        if((expiryYear !== "" ) && ((Number(expiryYear) < thisYear) || (Number(expiryYear) > (thisYear + 5)))){
            msg = "Year is out of range.";
        }

        setFormErrors(prevValues => ( {...prevValues, expiryYear: msg} ));
    };

    const validateCardCVV = (cvv) => {
        let msg = "";
        if(isNaN(Number(cvv)) || cvv.length < 3 || cvv.length > 4){
            msg = "Check your cvv number";
        }
        
        setFormErrors(prevValues => ( {...prevValues, cvv: msg} ));
    };

    const handleSubmit = e => {
        e.preventDefault();
        validateCardName(cardName);
        validateCardNumber(cardNumber);
        validateCardExpiryMonth(cardExpiryMonth);
        validateCardExpiryYear(cardExpiryYear);
        validateCardCVV(cardCVV); 
        setSubmit(true);
        setNotification({
            display: false,
            success: true,
            msg: ''
        });
       
        
    };

    return (
        <div className="mt-2">
            <div id="form-wrapper" className="animate__animated animate__zoomIn">
                <h2 className="text-center my-3 fs-1">Add Credit Card Details</h2>
                <div className="w-75 mx-auto my-3 d-flex justify-content-end">
                    {isLoading && <div>Loading images...</div>}
                    {cards.map(card => {
                        return (
                            <Image card={card} key={card.id} orgName={cardOrg} />
                        );
                    })}
                </div>
                <form action="" className="w-75 mx-auto" onSubmit={handleSubmit}>
                    <div className="mb-3 input-group-lg">
                        <label htmlFor="card-name" className="form-label">
                            Name on Card <CgAsterisk className="text-danger mb-2" />
                        </label>
                        <div className="has-validation">
                            <input id="card-name" type="text" 
                            className={`form-control ${(formErrors.name !== '') ? "is-invalid" : ""}`} 
                            name="name" value={cardName} onChange={setFormCardName}/>
                            <div className="invalid-feedback">{formErrors.name}</div>
                        </div>
                    </div>
                    <div className="position-relative mb-3 input-group-lg">
                        <label htmlFor="card-number" className="form-label">
                            Card Number <CgAsterisk className="text-danger mb-2"/>
                        </label>
                        <div className="has-validation">
                            <input id="card-number" type="tel" 
                            className={`form-control ${(formErrors.number !== '') ? "is-invalid" : ''}`} 
                            value={cardNumber} onChange={setFormCardNumber}/>
                            <BsFillCreditCard2FrontFill 
                            className={`position-absolute fs-2 ${(formErrors.number !== '') ? "card-input-icon-err": "card-input-icon"}`} />
                            <div className="invalid-feedback">{formErrors.number}</div>
                        </div>
                    </div>
                    <div className="row mb-3 justify-content-between">
                        <div id="expiry-date" className="col-12 col-sm-6 d-flex flex-sm-row">
                            <div className="me-1">
                                <label htmlFor="" className="form-label">
                                    Expiration Date <CgAsterisk className="text-danger mb-2" />
                                </label>
                                <select name="expiry-month" id="expire-month" 
                                className={`form-select form-select-lg mb-3 ${(formErrors.expiryMonth !== '') ? "is-invalid": ''}`}
                                value={cardExpiryMonth} 
                                onChange={setFormCardExpiryMonth}>
                                    {monthsOptions()}
                                </select>
                                <div className="invalid-feedback">{formErrors.expiryMonth}</div>
                            </div>
                            <div className="">
                                <label htmlFor="" className="form-label invisible">
                                    Expiration Date <CgAsterisk className="text-danger mb-2" />
                                </label>
                                <select id="expiry-year" name="expiry-year" 
                                className={`form-select form-select-lg mb-3 ${(formErrors.expiryYear !== '') ? "is-invalid": ''}`} 
                                value={cardExpiryYear} 
                                onChange={setFormCardExpiryYear}>
                                    {yearOptions(year)}
                                </select>
                                <div className="invalid-feedback">{formErrors.expiryYear}</div>
                            </div>
                        </div>
                        <div className="col-10 col-sm-4 input-group-lg">
                            <label htmlFor="cvv" className="form-label">
                                Security Code <CgAsterisk className="text-danger mb-2"/>
                            </label>
                            <div className="d-flex has-validation">
                                <input type="tel" name="cvv" id="cvv" placeholder="cvv" 
                                className={`form-control form-control-lg ${(formErrors.cvv !== '') ? "is-invalid": ''}`}
                                value={cardCVV} onChange={setFormCardCVV}/>
                                <span className="cvvtooltip mx-1 align-self-center" data-cvv-tooltip="cvv is a three to four digit number on the back of your card">
                                    <VscQuestion className="fs-4" id="cvvtooltip-icon"/>
                                </span>
                            </div>
                            <div className="w-100 mt-1 mb-3 text-danger">{formErrors.cvv}</div>
                        </div>
                    </div>
                    <div className="d-grid gap-2 my-2">
                        <button type="submit" className="btn btn-warning btn-lg rounded-pill p-2">Add Card</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreditCardForm;