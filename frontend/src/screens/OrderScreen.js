import React, { useEffect } from 'react';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import ItemVariantInfo from '../components/ItemVariantInfo';
import { getOrderDetails, dispatchOrder } from '../actions/orderActions';
import {
  ORDER_DISPATCH_RESET,
  ORDER_CREATE_RESET,
} from '../constants/orderConstants';
import Meta from '../components/Meta';

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderDispatch = useSelector((state) => state.orderDispatch);
  const { loading: loadingDispatch, success: successDispatch } = orderDispatch;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { success: successOrderCreate } = orderCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
    if (order && order._id !== orderId) {
      dispatch(getOrderDetails(orderId));
    }
    if (successOrderCreate) {
      dispatch({ type: ORDER_CREATE_RESET });
    }

    if (!order || successDispatch) {
      dispatch({ type: ORDER_DISPATCH_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [
    dispatch,
    orderId,
    successDispatch,
    order,
    history,
    userInfo,
    match,
    successOrderCreate,
  ]);

  const markDispatchededHandler = () => {
    dispatch(dispatchOrder(orderId));
  };

  //Returns numbers to two decimal points
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const formatDate = (date) => {
    return date.slice(0, 16).replace('T', ' at ');
  };

  return (
    <>
      <Meta title='Order' />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <h1>Order {order._id}</h1>
          <Row>
            <Col md={7}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong> {order.user.name}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </p>
                  <p>
                    <strong>Address: </strong>
                    {order.shippingAddress.address},
                    {' ' + order.shippingAddress.city},
                    {' ' + order.shippingAddress.postalCode},
                    {' ' + order.shippingAddress.country}
                  </p>
                  {order.isDispatched ? (
                    <Message variant='success'>
                      Dispatched on {formatDate(order.dispatchedAt)}
                    </Message>
                  ) : (
                    <Message variant='danger'>Not Dispatched</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <Message variant='success'>
                      Paid on {formatDate(order.paidAt)}
                    </Message>
                  ) : (
                    <Message variant='danger'>Not paid</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems.length === 0 ? (
                    <Message>Order is empty</Message>
                  ) : (
                    <ListGroup variant='flush'>
                      {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col xs={4}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col xs={6} lg={5}>
                              <ItemVariantInfo item={item} quantity />
                            </Col>
                            <Col xs={2} lg={3} className='text-center'>
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
                      <Col>£{addDecimals(order.itemsPrice)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>£{addDecimals(order.shippingPrice)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>£{addDecimals(order.totalPrice)}</Col>
                    </Row>
                  </ListGroup.Item>

                  {loadingDispatch && <Loader />}
                  {userInfo && userInfo.isAdmin && order.isPaid && (
                    <ListGroup.Item>
                      <Button
                        type='button'
                        className='btn btn-block'
                        disabled={order.isDispatched}
                        onClick={() => markDispatchededHandler()}
                      >
                        Mark Dispatched
                      </Button>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default OrderScreen;
