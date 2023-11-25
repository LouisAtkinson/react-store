import React from 'react';
import { Link } from 'react-router-dom';

export default function Card(props) {
  const [quantity, setQuantity] = React.useState(1);
  const [isPulsing, setIsPulsing] = React.useState(false);

  function downQuantity() {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1)
    }
  }

  function upQuantity() {
    setQuantity(prevQuantity => prevQuantity + 1)
  }

  function handleAddToCartClick() {
    if (isPulsing) {
      setIsPulsing(false);
      setTimeout(() => {
        setIsPulsing(true);
      }, 0);
    } else {
      setIsPulsing(true);
    }
    props.addToCart({ ...props, quantity: quantity }, quantity);
  }

  function handleAnimationEnd() {
    setIsPulsing(false);
  }

  return (
    <div className='product-card'>
      <Link
        to={props.id}
        state={{
          filters: props.filters,
        }}
      >
        <div className='product-image'>
          <img src={require(`../../public/images/${props.url}`)} alt={props.title} />
        </div>
        <h3 className='product-title'>{props.title}</h3>
      </Link>
      <p className='product-description'>{props.description}</p>
      <div className='product-details'>
        <h4 className='product-price'>£{props.price.toFixed(2)}</h4>
        {props.inStock ? (
          <div className='quantity-controls'>
            <button 
              className={`quantity-btn ${quantity === 1 ? 'disabled' : ''}`} 
              onClick={downQuantity}>
              -
            </button>
            <p className='quantity'>{quantity}</p>
            <button className='quantity-btn' onClick={upQuantity}>+</button>
          </div>
        ) : (
          <p className='out-of-stock-text'>OUT OF STOCK</p>
        )}
      </div>
      {quantity > 1 && (
        <p className='total-price'>Total price: £{(props.price * quantity).toFixed(2)}</p>
      )}
      {props.inStock ? (
        <div className='add-to-cart-container'>
          <button
            className={`add-to-cart-btn ${isPulsing ? 'pulse' : ''}`}
            onClick={handleAddToCartClick}
            onAnimationEnd={handleAnimationEnd}
          >
            Add to cart
          </button>
          {props.addedToCart && (
            <div className='added-to-cart-message-container'>
              <p className='added-to-cart-message'>Added to cart</p>
              <button
                className='remove-button'
                onClick={() => props.removeFromCart(props.id, quantity)}
              >
                Undo
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
