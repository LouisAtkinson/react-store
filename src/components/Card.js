import React from 'react';
import { Link } from 'react-router-dom';

export default function Card(props) {
  const [quantity, setQuantity] = React.useState(1);

  function downQuantity() {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1)
    }
  }

  function upQuantity() {
    setQuantity(prevQuantity => prevQuantity + 1)
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
        <h4 className='product-price'>£{props.price}</h4>
        {props.inStock ? (
          <div className='quantity-controls'>
            <button className='quantity-btn' onClick={downQuantity}>-</button>
            <p className='quantity'>{quantity}</p>
            <button className='quantity-btn' onClick={upQuantity}>+</button>
          </div>
        ) : (
          <p className='out-of-stock-text'>OUT OF STOCK</p>
        )}
      </div>
      {quantity > 1 && (
        <p className='total-price'>Total price: £{props.price * quantity}</p>
      )}
      {props.inStock ? (
        <button
          className='add-to-cart-btn'
          onClick={() => {
            props.addToCart(props, quantity, true);
          }}
        >
          Add to cart
        </button>
      ) : null}
    </div>
  )
}
