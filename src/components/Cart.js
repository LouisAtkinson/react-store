import React from "react";
import CartCard from './CartCard';

export default function Cart(props) {
    const [showPopup, setShowPopup] = React.useState(false);

    const items = props.cartContents.map(item => (
        <CartCard
        key = {item.id}
        id = {item.id}
        quantity = {item.quantity}
        title = {item.title}
        url = {item.url}
        description = {item.description}
        price = {item.price}
        addToCart = {props.addToCart}
        removeFromCart = {props.removeFromCart}
        />
    ))

    function totalPrice() {
        let price = 0;
        let items = props.cartContents;
        for (let i = 0; i < items.length; i++) {
            price += (items[i].price * items[i].quantity)
        }
        return price.toFixed(2);
    }

    function togglePopup() {
        setShowPopup((prevShowPopup) => !prevShowPopup);
    }

    const popupContent = (
        <div>
            <div className="popup-overlay" onClick={togglePopup}/>
            <div className={`centered-popup ${showPopup ? "visible" : ""}`}>
                <button className="close-button" onClick={togglePopup}>
                    X
                </button>
                <div className="popup-content">
                    <h4>Important Notice</h4>
                    <p>Products cannot be bought from this store.</p>
                </div>
            </div>
        </div>
    );
  
    return (
        <div className='cart-container'>
            <h2>Cart</h2>
            {(props.cartContents.length > 0) ? items : <p>Cart is empty</p>}
            {(props.cartContents.length > 0 && <h3>Total price: £{totalPrice()}</h3>)}
            {(props.cartContents.length > 0 &&
                <button className="checkout-button" onClick={togglePopup}>
                    Checkout
                </button>
            )}
            {(showPopup && popupContent)}
        </div>
    )
}