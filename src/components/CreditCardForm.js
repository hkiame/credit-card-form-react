import {useEffect, useState} from "react";
import Image from "./Image";

const CreditCardForm = ({setNotification}) => {
    const initCards =[{
        id: 0,
        name: '',
        url: '',
        prefix: ''
    }];

    let [cards, setCards] = useState(initCards);
    let [cardOrg, setCardOrg] = useState("");

    useEffect(() => {
        fetch("./data.json")
            .then(res => res.json())
            .then(cards => setCards(cards));
    }, [cards]);

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
            </div>
        </div>
    );
};

export default CreditCardForm;