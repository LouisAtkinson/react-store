import React from 'react';

export default function CartCard(props) {
    return (
        <div className='cart-card'>
            <img className='cart-image' src={require(`../../public/images/${props.url}`)}/>
            <div className='cart-card-info'>
                <div className='cart-card--top'>
                    <h3>{props.title}</h3>
                    <h4>£{props.price}</h4>
                </div>
                <p>{props.description}</p>
                <div className='cart-quantity'>
                    <button className='quantity-btn' onClick={() => {
                        if (props.quantity > 1) {
                            props.removeFromCart(props.id, 1)
                        }
                    }}>-</button>
                    <p>{props.quantity}</p>
                    <button className='quantity-btn' onClick={() => {
                        props.addToCart(props, 1)
                    }}>+</button>
                    <p>Total price: £{props.quantity * props.price}</p>
                </div>
                <button 
                    onClick={() => props.removeFromCart(props.id)}
                    className='remove-button'
                >Remove</button>
            </div>
        </div>
    )
}