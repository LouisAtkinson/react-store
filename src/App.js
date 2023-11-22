import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import Home from './components/Home.js';
import Store from './components/Store.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Popup from './components/Popup.js'

function App() {
  const [originalProducts, setOriginalProducts] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [quantity, setQuantity] = React.useState(1);
  const [currentProduct, setCurrentProduct] = React.useState(null);
  const [showPopup, setShowPopup] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/products")
        .then(res => res.json())
        .then(data => {
          setProducts(data.products);
          setOriginalProducts(data.products);
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

  const [cartContents, setCartContents] = React.useState([])

  let timeoutId; 

  function addToCart(props, quantity, doShowPopup) {
    setCurrentProduct(props);

    if (doShowPopup) {
      setShowPopup(true);
    
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = false;
      }
  
      timeoutId = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }

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
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
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
              showPopup={showPopup}
            />} 
          />
          <Route path="/store/:id" element={
            <Product
              setProducts={setProducts}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              showPopup={showPopup}
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
      {showPopup && currentProduct && (
        <Popup 
          showPopup={showPopup} 
          setShowPopup={setShowPopup}
          url={currentProduct.url}
          id={currentProduct.id}
          title={currentProduct.title}
          price={currentProduct.price}
          quantity={currentProduct.quantity}
          downQuantity={downQuantity}
          upQuantity={upQuantity}
          removeFromCart={removeFromCart}
        />
      )}
    </div>
  );
}

export default App;
