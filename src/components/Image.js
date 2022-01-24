const Image = ({card, orgName}) => {
    const imgCss = ['img-thumbnail', 'card-img'];
    if(orgName === card.name){
        imgCss.push('order-first', 'mx-auto', 'border-1', 'border-bottom', 'border-secondary', 'animate__animated', 'animate__tada');  
    }else{
        imgCss.push('order-second', 'me-1');
    }

    return (
        <img src={card.url} className={imgCss.join(' ')} alt={card.name} />
    );
};

export default Image;