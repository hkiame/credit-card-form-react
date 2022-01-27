import {useEffect, useState} from "react";
import Image from "./Image";
import {CgAsterisk} from "react-icons/cg";
import {BsFillCreditCard2FrontFill} from "react-icons/bs";
import {VscQuestion} from "react-icons/vsc";


const handleSubmit = e => {
    e.preventDefault();
};

const CreditCardForm = ({setNotification}) => {
    const initCards =[{
        id: 0,
        name: '',
        url: '',
        prefix: ''
    }];

    let year = (new Date()).getFullYear();

    let [cards, setCards] = useState(initCards);
    let [cardOrg, setCardOrg] = useState("");

    useEffect(() => {
        fetch("./data.json")
            .then(res => res.json())
            .then(cards => setCards(cards));
    }, [cards]);

    const monthsOptions = () => {
        const options = [];
    
        for(let i = 1; i <= 12; ++i){
            options.push(<option key={i} value={i}>{i}</option>)
        }
    
        return options;
    };
    
    const yearOptions = (year) => {
        const options = [];
    
        for(let i = 0; i <= 5; ++i){
            let yearValue = year + i;
            options.push(<option key={i} value={yearValue}>{yearValue}</option>);
        }
    
        return options;
    
    };

    return (
        <div className="mt-2">
            <div id="form-wrapper" className="">
                <h2 className="text-center my-3 fs-1">Add Credit Card Details</h2>
                <div className="w-75 mx-auto my-3 d-flex justify-content-end">
                    {cards.map(card => {
                        return (
                            <Image card={card} key={card.id} orgName={cardOrg} />
                        );
                    })}
                </div>
                <form action="" className="w-75 mx-auto" onSubmit={handleSubmit}>
                    <div class="mb-3 input-group-lg">
                        <label htmlFor="card-name" className="form-label">
                            Name on Card <CgAsterisk className="text-danger mb-2" />
                        </label>
                        <div className="has-validation">
                            <input id="card-name" type="text" className="form-control" name="name" value="" />
                            <div className="invalid-feedback"></div>
                        </div>
                    </div>
                    <div className="position-relative mb-3 input-group-lg">
                        <label htmlFor="card-number" className="form-label">
                            Card Number <CgAsterisk className="text-danger mb-2"/>
                        </label>
                        <div className="has-validation">
                            <input id="card-number" type="tel" className="form-control" />
                            <BsFillCreditCard2FrontFill className="position-absolute fs-2 card-input-icon" />
                            <div className="invalid-feedback"></div>
                        </div>
                    </div>
                    <div className="row mb-3 justify-content-between">
                        <div id="expiry-date" className="col-12 col-sm-6 d-flex flex-sm-row">
                            <div className="me-1">
                                <label htmlFor="" className="form-label">
                                    Expiration Date <CgAsterisk className="text-danger mb-2" />
                                </label>
                                <select name="expiry-month" id="expire-month" className="form-select form-select-lg mb-3">
                                    {monthsOptions()}
                                </select>
                                <div className="invalid-feedback"></div>
                            </div>
                            <div className="">
                                <label htmlFor="" className="form-label invisible">
                                    Expiration Date <CgAsterisk className="text-danger mb-2" />
                                </label>
                                <select id="expiry-year" name="expiry-year" className="form-select form-select-lg mb-3">
                                    {yearOptions(year)}
                                </select>
                                <div className="invalid-feedback"></div>
                            </div>
                        </div>
                        <div className="col-10 col-sm-4 input-group-lg">
                            <label htmlFor="cvv" className="form-label">
                                Security Code <CgAsterisk className="text-danger mb-2"/>
                            </label>
                            <div className="d-flex has-validation">
                                <input type="tel" name="cvv" id="cvv" placeholder="cvv" value="" className="form-control form-control-lg"/>
                                <span className="cvvtooltip mx-1 align-self-center" data-cvv-tooltip="cvv is a three to four digit number on the back of your card">
                                    <VscQuestion className="fs-4" id="cvvtooltip-icon"/>
                                </span>
                            </div>
                            <div className="w-100 mt-1 mb-3 text-danger"></div>
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