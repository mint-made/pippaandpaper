import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Message from '../Message';
import { PRODUCT_CREATE_REVIEW_RESET } from '../../constants/productConstants';
import { createProductReview } from '../../actions/productActions';

const WriteReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { success: successProductReview, error: errorProductReview } =
    productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      alert('Review Submitted!');
      setRating(0);
      setComment('');
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
  }, [dispatch, successProductReview]);

  /**
   * Dispatches the createProductReview action
   * @param {*} e Event object for the review submitted
   */
  const submitReviewHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(productId, {
        rating,
        comment,
      })
    );
  };

  return (
    <ListGroup.Item>
      <h2>Write a Review</h2>
      {errorProductReview && (
        <Message variant='danger'>{errorProductReview}</Message>
      )}
      {userInfo ? (
        <Form onSubmit={submitReviewHandler}>
          <Form.Group controlId='rating'>
            <Form.Label>Rating</Form.Label>
            <Form.Control
              as='select'
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value=''>Select...</option>
              <option value='1'>1 - Poor</option>
              <option value='2'>2 - Fair</option>
              <option value='3'>3 - Good</option>
              <option value='4'>4 - Very Good</option>
              <option value='5'>5 - Excellent</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='comment'>
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as='textarea'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary'>
            Submit
          </Button>
        </Form>
      ) : (
        <Message>
          Please <Link to='/login'>sign in</Link> to write a review
        </Message>
      )}
    </ListGroup.Item>
  );
};

export default WriteReviewForm;
