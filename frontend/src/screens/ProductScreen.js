import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Accordion,
  useAccordionToggle,
  Carousel,
  Container,
} from 'react-bootstrap';

import { listProductDetails } from '../actions/productActions';
import { addToCart } from '../actions/cartActions';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import VariationForm from '../components/VariantForms/VariationForm';
import PersonalizationForm from '../components/VariantForms/PersonalizationForm';
import DisplayReviews from '../components/reviews/DisplayReviews';
import WriteReviewForm from '../components/reviews/WriteReviewForm';

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [selectedPersonalizations, setSelectedPersonalizations] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    if (!product.name || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id));
    } else {
      const variationsDeepCopy = JSON.parse(JSON.stringify(product.variations));
      const personalizationsDeepCopy = JSON.parse(
        JSON.stringify(product.personalizations)
      );
      setSelectedVariations([...variationsDeepCopy]);
      setSelectedPersonalizations([...personalizationsDeepCopy]);
    }
  }, [dispatch, match, product, history]);

  /**
   * Handler for adding an item to cart; dispatches action and redirects to /cart
   * Variant ID is created here as an identifier in the cart between items
   * that have different variations or personalizations
   */
  const addToCartHandler = () => {
    const productDeepCopy = JSON.parse(JSON.stringify(product));
    productDeepCopy.variations = selectedVariations;
    productDeepCopy.personalizations = selectedPersonalizations;
    productDeepCopy.totalPrice = getTotalPrice();
    productDeepCopy.image = productDeepCopy.images[0];
    const variantIdArray = selectedVariations
      .map((variation) =>
        !variation.isOptional || (variation.isOptional && variation.isSelected)
          ? variation.selectedOption
          : null
      )
      .concat(
        selectedPersonalizations.map((personalization) =>
          !personalization.isOptional ||
          (personalization.isOptional && personalization.isSelected)
            ? personalization.value
            : null
        )
      );
    productDeepCopy.variantId = variantIdArray.join('-');

    dispatch(addToCart(productDeepCopy, qty));
    history.push('/cart');
  };

  /**
   * Returns the total price of the item inc. variations/personalizations
   */
  const getTotalPrice = () => {
    const variationCost = selectedVariations
      .map((variation) =>
        !variation.isOptional || (variation.isOptional && variation.isSelected)
          ? variation.options[variation.selectedOption].additionalPrice
          : null
      )
      .reduce((acc, value) => acc + value, 0);

    const personalizationCost = selectedPersonalizations
      .map((personalization) =>
        !personalization.isOptional ||
        (personalization.isOptional && personalization.isSelected)
          ? personalization.additionalPrice
          : null
      )
      .reduce((acc, value) => acc + value, 0);
    const totalPrice = product.price + variationCost + personalizationCost;
    return (Math.round(totalPrice * 100) / 100).toFixed(2);
  };

  /**
   * Function to add a custom Accordion function that changes the value of
   * @param {*} param0
   */
  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionToggle(eventKey, () => {
      const variantType = eventKey.split('-')[0];
      const variantIndex = eventKey.split('-')[1];
      if (variantType === 'variation') {
        selectedVariations[variantIndex].isSelected =
          !selectedVariations[variantIndex].isSelected;
        setSelectedVariations([...selectedVariations]);
      }
      if (variantType === 'personalization') {
        // If personalization is optional, has linked image and isn't selected
        // we will set the imageIndex of the carosel to the linkedImage value
        if (
          !selectedPersonalizations[variantIndex].isSelected &&
          typeof selectedPersonalizations[variantIndex].linkedImage === 'number'
        ) {
          handleSelect(selectedPersonalizations[variantIndex].linkedImage);
        }

        selectedPersonalizations[variantIndex].isSelected =
          !selectedPersonalizations[variantIndex].isSelected;
        setSelectedPersonalizations([...selectedPersonalizations]);
      }
    });
    return (
      <p className='cursor-pointer mb-2' onClick={decoratedOnClick}>
        {children}
      </p>
    );
  }
  const ReviewsSection = () => {
    return (
      <ListGroup variant='flush'>
        <h5>
          <Rating
            value={product.rating}
            text={`${product.numReviews} Review${
              product.numReviews === 1 ? '' : 's'
            }`}
            textLeft
          />
          <hr />
        </h5>
        {product.reviews.length === 0 && <Message>No Reviews</Message>}
        <DisplayReviews reviews={product.reviews} />
        <WriteReviewForm productId={match.params.id} />
      </ListGroup>
    );
  };

  /**
   * Returns an ImageCarousel for product.images Array. The image displayed by the
   * carousel can be changed by calling the handleSelect function and passing an
   * indexNumber of the image you want to display from the product.images array.
   * This is used to change the image displayed when a user changes a variaion that
   * has a value in the linkedImage property.
   */
  const ImageCarousel = () => {
    return (
      <Container className='d-flex justify-content-center'>
        <Carousel
          activeIndex={imageIndex}
          onSelect={handleSelect}
          className='mb-5 product-screen-carousel'
          interval={null}
        >
          {product.images.map((image, index) => (
            <Carousel.Item key={index}>
              <Container fluid>
                <Image
                  src={image}
                  fluid
                  className='rounded-0 m-0 p-0 product-screen-image'
                />
              </Container>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    );
  };
  const handleSelect = (selectedIndex) => {
    if (selectedIndex >= 0) {
      setImageIndex(selectedIndex);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta title={product.name} showBrand={false} />
          <Row>
            <Col md={5} className='d-block d-md-none'>
              {product.images && <ImageCarousel />}
            </Col>
            <Col md={7} className='d-none d-md-block'>
              {product.images && <ImageCarousel />}
              <ReviewsSection />
            </Col>
            <Col sm={12} md={5} className='mb-5'>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h2 className='m-0'>{product.name}</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <h4 className='m-0'>£{getTotalPrice()}</h4>
                      </Col>
                      <Col className='d-flex justify-content-end'>
                        {product.countInStock > 0 ? (
                          <p className='m-0'>
                            <i className='fas fa-check text-success'></i>In
                            Stock
                          </p>
                        ) : (
                          <p className='m-0'>
                            <i className='fas fa-times text-danger'></i> Out of
                            Stock
                          </p>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {selectedVariations &&
                    selectedVariations.map((variation, index) => (
                      <ListGroup.Item key={`variation-${index}`}>
                        {variation.isOptional ? (
                          <Accordion>
                            <CustomToggle eventKey={`variation-${index}`}>
                              {variation.name}
                              <span>
                                {variation.isSelected ? (
                                  <i className='fas fa-caret-up ml-1'></i>
                                ) : (
                                  <i className='fas fa-caret-down ml-1'></i>
                                )}
                              </span>
                            </CustomToggle>
                            <Accordion.Collapse eventKey={`variation-${index}`}>
                              <VariationForm
                                variation={variation}
                                onChange={(e) => {
                                  typeof variation.options[e.target.value]
                                    .linkedImage === 'number' &&
                                    handleSelect(
                                      variation.options[e.target.value]
                                        .linkedImage
                                    );
                                  variation.selectedOption = e.target.value;
                                  setSelectedVariations([
                                    ...selectedVariations,
                                  ]);
                                }}
                              />
                            </Accordion.Collapse>
                          </Accordion>
                        ) : (
                          <VariationForm
                            variation={variation}
                            label
                            onChange={(e) => {
                              typeof variation.options[e.target.value]
                                .linkedImage === 'number' &&
                                handleSelect(
                                  variation.options[e.target.value].linkedImage
                                );
                              variation.selectedOption = e.target.value;
                              setSelectedVariations([...selectedVariations]);
                            }}
                          />
                        )}
                      </ListGroup.Item>
                    ))}

                  {selectedPersonalizations &&
                    selectedPersonalizations.map((personalization, index) => (
                      <ListGroup.Item key={`personalization-${index}`}>
                        {personalization.isOptional ? (
                          <Accordion>
                            <CustomToggle eventKey={`personalization-${index}`}>
                              {personalization.name}
                              {` (+£${personalization.additionalPrice})`}
                              <span>
                                {personalization.isSelected ? (
                                  <i className='fas fa-caret-up ml-1'></i>
                                ) : (
                                  <i className='fas fa-caret-down ml-1'></i>
                                )}
                              </span>
                            </CustomToggle>
                            <Accordion.Collapse
                              eventKey={`personalization-${index}`}
                            >
                              <PersonalizationForm
                                personalization={personalization}
                                onChange={(e) => {
                                  personalization.value = e.target.value;
                                  setSelectedPersonalizations([
                                    ...selectedPersonalizations,
                                  ]);
                                }}
                              />
                            </Accordion.Collapse>
                          </Accordion>
                        ) : (
                          <PersonalizationForm
                            personalization={personalization}
                            label
                            onChange={(e) => {
                              personalization.value = e.target.value;
                              setSelectedPersonalizations([
                                ...selectedPersonalizations,
                              ]);
                            }}
                          />
                        )}
                      </ListGroup.Item>
                    ))}

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col className='d-flex align-items-center'>
                          <p className='m-0'>Quantity</p>
                        </Col>
                        <Col>
                          <Form.Control
                            as='select'
                            className='form-select border border-secondary rounded'
                            style={{ minWidth: '120px' }}
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className='btn-block'
                      type='button'
                      disabled={product.countInStock === 0}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Description: {product.description}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
            <Col sm={12} className='d-block d-md-none'>
              <ReviewsSection />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
