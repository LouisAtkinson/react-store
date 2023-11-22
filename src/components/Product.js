import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

export default function Product(props) {
  const params = useParams();
  const location = useLocation();
  const [product, setProduct] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);

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

  const filters = location.state?.filters;

  function filtersToQueryString(filters) {
    if (!filters) return '';
    const queryString = Object.entries(filters)
      .filter(([key, value]) => value !== null && value !== '' && value !== false)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    return queryString ? `?${queryString}` : '';
  };

  const queryString = filtersToQueryString(filters);

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
                <button className='quantity-btn' onClick={downQuantity}>-</button>
                {quantity}
                <button className='quantity-btn' onClick={upQuantity}>+</button>
                {quantity > 1 ? `Total price: £${product.price * quantity}` : ''}
              </div>
              <button
                onClick={() => {
                  props.addToCart({...product, quantity: quantity}, quantity, true);
                }}
                className='add-to-cart-button'
              >
                Add to Cart
              </button>
            </div>
          ) : (
            <p className='out-of-stock-text'>OUT OF STOCK</p>
          )}
        </div>
      ) : <h2>Loading...</h2>}
    </div>
  );
}
