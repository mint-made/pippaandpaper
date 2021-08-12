import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants';

export const addToCart = (addedProduct, qty) => async (dispatch, getState) => {
  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      _id: addedProduct._id,
      name: addedProduct.name,
      image: addedProduct.image,
      price: addedProduct.price,
      countInStock: addedProduct.countInStock,
      variations: addedProduct.variations,
      personalizations: addedProduct.personalizations,
      variantId: addedProduct.variantId,
      totalPrice: addedProduct.totalPrice,
      qty: qty,
    },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart =
  (productId, variantId) => (dispatch, getState) => {
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: { productId, variantId },
    });

    localStorage.setItem(
      'cartItems',
      JSON.stringify(getState().cart.cartItems)
    );
  };

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem('paymentMethod', JSON.stringify(data));
};
