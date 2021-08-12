import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from 'react-paypal-button-v2';

import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import ItemVariantInfo from '../components/ItemVariantInfo';
import Loader from '../components/Loader';
import { CART_RESET } from '../constants/cartConstants';
import Meta from '../components/Meta';

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [sdkReady, setSdkReady] = useState(false);

  //Returns numbers to two decimal points
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.totalPrice * item.qty, 0)
  );
  cart.shippingPrice = addDecimals(0);
  cart.taxPrice = addDecimals(0);
  cart.totalPrice = addDecimals(
    Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)
  );

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, loading, error } = orderCreate;

  useEffect(() => {
    if (success) {
      dispatch({ type: CART_RESET });
      history.push(`/order/${order._id}`);
    }
    if (!cart.paymentMethod) {
      history.push('/payment');
    }
    if (cart.paymentMethod) {
      const addPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/config/paypal');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=GBP&disable-funding=credit,sofort`;
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
      };
      if (!window.paypal) {
        addPaypalScript();
      } else {
        setSdkReady(true);
      }
    }
    // eslint-disable-next-line
  }, [history, success]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        paymentResult,
      })
    );
  };

  return (
    <>
      <Meta title='Place Order' />
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={7}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
              </p>
              <p className='m-0'>{cart.shippingAddress.address}</p>
              <p className='m-0'>{cart.shippingAddress.city}</p>
              <p className='m-0'>{cart.shippingAddress.postalCode}</p>
              <p className='m-0'>{cart.shippingAddress.country}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col xs={3}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col xs={6}>
                          <ItemVariantInfo item={item} quantity />
                        </Col>
                        <Col xs={3} className='text-center'>
                          <h5 className='m-0'>
                            £{addDecimals(item.totalPrice * item.qty)}
                          </h5>
                          {item.qty > 1 && (
                            <p>(£{addDecimals(item.totalPrice)} each)</p>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={5}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>£{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>£{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>£{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {loading && <Loader />}
                {error && <Message variant='danger'>{error}</Message>}

                {!sdkReady ? (
                  <Loader />
                ) : (
                  <PayPalButton
                    amount={cart.totalPrice}
                    onSuccess={successPaymentHandler}
                    currency='GBP'
                  />
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
