import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';

import { addToCart, removeFromCart } from '../actions/cartActions';
import ItemVariantInfo from '../components/ItemVariantInfo';
import Message from '../components/Message';
import Meta from '../components/Meta';

const CartScreen = ({ match, location, history }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const removeFromCartHandler = (productId, variantId) => {
    dispatch(removeFromCart(productId, variantId));
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  const addToCartHandler = (e, item) => {
    dispatch(addToCart(item, Number(e.target.value)));
  };

  //Returns numbers to two decimal points
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  return (
    <>
      <Meta title='Cart' />
      <Row>
        <Col md={9}>
          <h2 className='text-center'>Cart</h2>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to='/'>Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={`${item._id}-${item.variantId}`}>
                  <Row>
                    <Col xs={4} sm={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col xs={8} sm={5}>
                      <ItemVariantInfo item={item} />
                    </Col>
                    <hr />
                    <Col xs={4} sm={2} className='mt-3'>
                      <Form.Control
                        as='select'
                        className='form-select border border-secondary rounded form-control-sm'
                        style={{ maxWidth: '70px' }}
                        value={item.qty}
                        onChange={(e) => addToCartHandler(e, item)}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={`option-${x + 1}`} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col xs={5} sm={2} className='p-0 text-center mt-4'>
                      <h5 className='m-0'>
                        £{addDecimals(item.totalPrice * item.qty)}
                      </h5>
                      {item.qty > 1 && (
                        <p>(£{addDecimals(item.totalPrice)} each)</p>
                      )}
                    </Col>
                    <Col xs={3} sm={1} className='mt-3'>
                      <Button
                        type='button'
                        variant='light'
                        className='btn-sm text-danger'
                        onClick={() =>
                          removeFromCartHandler(item._id, item.variantId)
                        }
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h5>
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  )
                  {cartItems.reduce((acc, item) => acc + item.qty, 0) > 1
                    ? ' items'
                    : ' item'}
                </h5>
                <h3 className='my-1'>
                  £
                  {addDecimals(
                    cartItems.reduce(
                      (acc, item) => acc + item.qty * item.totalPrice,
                      0
                    )
                  )}
                </h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block p-3'
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;
