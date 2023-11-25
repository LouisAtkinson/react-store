import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

export default function Product(props) {
  const params = useParams();
  const location = useLocation();
  const [product, setProduct] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [addedToCart, setAddedToCart] = React.useState(false);
  const [isPulsing, setIsPulsing] = React.useState(false);

  function downQuantity() {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  }

  function upQuantity() {
    setQuantity(prevQuantity => prevQuantity + 1);
  }

  React.useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => setProduct(data.products))
  }, [params.id]);

  React.useEffect(() => {
    setAddedToCart(props.addedToCartMap[params.id] || false);
  }, [params.id, props.addedToCartMap]);

  React.useEffect(() => {
    props.resetAddedToCartMap();
  }, []) 

  const filters = location.state?.filters;

  function filtersToQueryString(filters) {
    if (!filters) return '';
  
    const nonDefaultFilters = Object.entries(filters)
      .filter(([key, value]) => {
        return (
          (key !== 'itemsPerPage' || value !== 10) &&
          (key !== 'page' || value !== 1) &&
          (key !== 'hideOutOfStock' || value !== false) &&
          value !== null &&
          value !== ''
        );
      })
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  
    return nonDefaultFilters ? `?${nonDefaultFilters}` : '';
  }

  const queryString = filtersToQueryString(filters);

  function handleAddToCartClick() {
    if (isPulsing) {
      setIsPulsing(false);
      setTimeout(() => {
        setIsPulsing(true);
      }, 0);
    } else {
      setIsPulsing(true);
    }
    props.addToCart({...product, quantity: quantity}, quantity);
  }

  function handleAnimationEnd() {
    setIsPulsing(false);
  }

  return (
    <div className='product-detail-container'>
      <Link
        to={`..${queryString}`}
        relative='path'
        className='back-button'
      >
        &larr; <span>Back</span>
      </Link>

      {product ? (
        <div className='product-card'>
          <img className='product-image' src={require(`../../public/images/${product.url}`)} alt={product.title} />
          <h3 className='product-title'>{product.title}</h3>
          <p className='product-description'>{product.description}</p>
          <h4 className='product-price'>£{product.price}</h4>
          {product.inStock ? (
            <div className='product-card-bottom'>
              <div className='quantity'>
                <button 
                  className={`quantity-btn ${props.quantity === 1 ? 'disabled' : ''}`}
                  onClick={downQuantity}>
                  -
                </button>
                {quantity}
                <button className='quantity-btn' onClick={upQuantity}>+</button>
                {quantity > 1 ? `Total price: £${(product.price * quantity).toFixed(2)}` : ''}
              </div>
              <button
                className={`add-to-cart-btn ${isPulsing ? 'pulse' : ''}`}
                onClick={handleAddToCartClick}
                onAnimationEnd={handleAnimationEnd}
              >
                Add to cart
              </button>
            </div>
          ) : (
            <p className='out-of-stock-text'>OUT OF STOCK</p>
          )}
          
          {addedToCart && (
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
      ) : <h2>Loading...</h2>}
    </div>
  );
}
