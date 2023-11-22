import React, { useEffect, useState } from 'react';

export default function Popup(props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemovedPopupVisible, setIsRemovedPopupVisible] = useState(false);

  useEffect(() => {
    if (props.showPopup && !isRemovedPopupVisible) {
      setIsVisible(true);

      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [props.showPopup, isRemovedPopupVisible]);

  const handleRemoveFromCart = () => {
    setIsVisible(false);
    props.removeFromCart(props.id, props.quantity);
    setIsRemovedPopupVisible(true);

    setTimeout(() => {
      setIsRemovedPopupVisible(false);
    }, 3000);
  };

  return (
    <div className={`popup ${isVisible || isRemovedPopupVisible ? 'visible' : ''}`}>
      {isVisible ? (
        <div className="popup-content">
          <button className="close-button" onClick={() => setIsVisible(false)}>X</button>
          <h4>Added to cart</h4> 
          <img className="popupImage" src={require(`../../public/images/${props.url}`)} alt={props.title} />
          <h3>{props.title}</h3>
          <h4>£{(props.price * props.quantity).toFixed(2)}</h4>
          <button onClick={handleRemoveFromCart} className="undo-button">
            Undo
          </button>
        </div>
      ) : isRemovedPopupVisible ? (
        <div className="popup-content removed-popup">
          <button className="close-button" onClick={() => setIsRemovedPopupVisible(false)}>X</button>
          <div className="removed-message">
            Removed from cart
          </div>
        </div>
      ) : null}
    </div>
  );
}
