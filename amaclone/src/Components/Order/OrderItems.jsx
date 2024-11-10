import React from "react";
import { useSelector } from "react-redux";

const OrderItems = ({ item, quantity }) => {
  const { url } = useSelector((store) => store.url);
  return (
    <div className="cart-item-container">
      <div className="item-left-part">
        <img
          className="cart-item-img"
          src={`${url}/images/${item.image}`}
          alt={item.item_name}
        />
      </div>
      <div className="item-right-part">
        <div className="company">{item.company}</div>
        <div className="item-name">{item.item_name}</div>
        <div className="price-container">
          <span className="current-price">Rs {item.current_price}</span>
          <span className="original-price">Rs {item.original_price}</span>
          <span className="discount-percentage">
            ({item.discount_percentage}% OFF)
          </span>
        </div>
        <div className="qty">Qty: {quantity} </div>
      </div>
    </div>
  );
};

export default OrderItems;
