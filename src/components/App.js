
import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const initialState = {
  cart: [
    {
      id: 1,
      name: "Samsung Galaxy S25",
      price: 75000,
      quantity: 1
    },
    {
      id: 2,
      name: "iPhone 16",
      price: 80000,
      quantity: 2
    },
    {
      id: 3,
      name: "OnePlus 13",
      price: 65000,
      quantity: 1
    }
  ]
};

function cartReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };

    case "DECREMENT":
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)
      };

    case "REMOVE":
      return {
        ...state,
        cart: state.cart.filter(
          (item) => item.id !== action.payload
        )
      };

    case "CLEAR":
      return {
        ...state,
        cart: []
      };

    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

function Navbar() {
  const { state } = useContext(CartContext);

  const totalItems = state.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav>
      <h2>My Shopping Cart 🛒</h2>
      <h3>
        Cart Items: <span id="nav-cart-item-count">{totalItems}</span>
      </h3>
    </nav>
  );
}

function Cart() {
  const { state, dispatch } = useContext(CartContext);

  const totalAmount = state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h1>Shopping Cart</h1>

      {state.cart.length === 0 ? (
        <h2>Cart is currently empty</h2>
      ) : (
        <div id="cart-items-list">
          {state.cart.map((item) => (
            <div key={item.id}>
              <h3>{item.name}</h3>

              <p>
                Price: ₹
                <span id={`cart-item-price-${item.id}`}>
                  {item.price}
                </span>
              </p>

              <button
                id={`decrement-btn-${item.id}`}
                onClick={() =>
                  dispatch({
                    type: "DECREMENT",
                    payload: item.id
                  })
                }
              >
                -
              </button>

              <span id={`cart-amount-${item.id}`}>
                {item.quantity}
              </span>

              <button
                id={`increment-btn-${item.id}`}
                onClick={() =>
                  dispatch({
                    type: "INCREMENT",
                    payload: item.id
                  })
                }
              >
                +
              </button>

              <button
                onClick={() =>
                  dispatch({
                    type: "REMOVE",
                    payload: item.id
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <hr />

      <h2>
        Total Amount: ₹
        <span id="cart-total-amount">{totalAmount}</span>
      </h2>

      <button
        id="clear-all-cart"
        onClick={() => dispatch({ type: "CLEAR" })}
      >
        Clear Cart
      </button>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <div id="main">
        <Navbar />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;
