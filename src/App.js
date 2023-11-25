import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import Home from './components/Home.js';
import Store from './components/Store.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

function App() {
  const [originalProducts, setOriginalProducts] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [quantity, setQuantity] = React.useState(1);
  const [currentProduct, setCurrentProduct] = React.useState(null);
  const [addedToCartMap, setAddedToCartMap] = React.useState({});

  React.useEffect(() => {
    fetch("/api/products")
        .then(res => res.json())
        .then(data => {
          setProducts(data.products);
          setOriginalProducts(data.products);
          const initialAddedToCartMap = data.products.reduce(
            (map, product) => ({ ...map, [product.id]: false }),
            {}
          );
          setAddedToCartMap(initialAddedToCartMap);
        })
  }, []);

  function downQuantity() {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  }

  function upQuantity() {
    setQuantity(prevQuantity => prevQuantity + 1);
  }

  const [cartContents, setCartContents] = React.useState(() => {
    const storedCartContents = JSON.parse(localStorage.getItem('cartContents'));
    return storedCartContents || [];
  });  
  const [cartItemCount, setCartItemCount] = React.useState(0);

  React.useEffect(() => {
    const totalCount = cartContents.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(totalCount);
    localStorage.setItem('cartContents', JSON.stringify(cartContents));
  }, [cartContents]);

  function addToCart(props, quantity) {
    setCurrentProduct(props);

    setCartContents(prevCartContents => {
      for (let i = 0; i < prevCartContents.length; i++) {
        if (prevCartContents[i].id === props.id) {
          return prevCartContents.map(item => {
            if (item.id === props.id) {
              return { ...item, quantity: item.quantity + quantity };
            }
            return item;
          });
        }
      }
  
      const newProduct = {
        key: props.id,
        id: props.id,
        quantity: quantity,
        title: props.title,
        url: props.url,
        description: props.description,
        price: props.price,
        addToCart: props.addToCart
      };

      return [...prevCartContents, newProduct];
    });

    setAddedToCartMap((prevMap) => {
      const updatedMap = { ...prevMap };

      updatedMap[props.id] = true;

      Object.keys(updatedMap).forEach((productId) => {
        if (productId !== props.id) {
          updatedMap[productId] = false;
        }
      });

      return updatedMap;
    });  
  }

  function removeFromCart(id, quantity) {
    if (quantity) {
      setCartContents((prevCartContents) => {
        const updatedCartContents = prevCartContents.map((item) => {
          if (item.id === id) {
            const newQuantity = quantity ? item.quantity - quantity : 0;
            if (newQuantity === 0) {
              return null;
            } else {
              return { ...item, quantity: newQuantity };
            }
          }
          return item; 
        });    
        return updatedCartContents.filter((item) => item !== null);
      });
    } else {
      setCartContents(prevCartContents => {
        const updatedCartContents = [...prevCartContents];
        const itemIndex = updatedCartContents.findIndex(item => item.id === id);
        updatedCartContents.splice(itemIndex, 1);
        return updatedCartContents;
      })
    }

    resetAddedToCartMap();
  }

  function resetAddedToCartMap() {
    setAddedToCartMap((prevMap) => {
      const updatedMap = {};
    
      Object.keys(prevMap).forEach((productId) => {
        updatedMap[productId] = false;
      });
    
      return updatedMap;
    });
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout cartItemCount={cartItemCount}/>}>
          <Route index element={<Home />} />
          <Route path="/store" element={
            <Store 
              products={products} 
              originalProducts={originalProducts}
              setProducts={setProducts}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              quantity={quantity}
              downQuantity={downQuantity}
              upQuantity={upQuantity}
              addedToCartMap={addedToCartMap}
              resetAddedToCartMap={resetAddedToCartMap}
            />} 
          />
          <Route path="/store/:id" element={
            <Product
              setProducts={setProducts}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              addedToCartMap={addedToCartMap}
              resetAddedToCartMap={resetAddedToCartMap}
            />}
          />
          <Route path="/cart" element={
            <Cart 
              products={products} 
              addToCart={addToCart}
              cartContents={cartContents}
              removeFromCart={removeFromCart}
            />} 
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
