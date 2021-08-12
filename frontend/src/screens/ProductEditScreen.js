import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Carousel, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import Meta from '../components/Meta';

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [imagesArray, setImagesArray] = useState([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [tag, setTag] = useState('');
  const [tagsArray, setTagsArray] = useState([]);
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  //Variations + Personalizations
  const [variations, setVariations] = useState([]);
  const [personalizations, setPersonalizations] = useState([]);

  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login');
    }

    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push('/admin/productlist');
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setCategory(product.category);
        setSubCategory(product.subCategory);
        setTagsArray(product.tags);
        setCountInStock(product.countInStock);
        setDescription(product.description);
        setVariations(product.variations);
        setPersonalizations(product.personalizations);
        setImagesArray(product.images);
      }
    }
  }, [dispatch, history, productId, product, successUpdate, userInfo]);

  /**
   * Handler for uploading images added by the user
   * @param {Object} e Event object to get the image file added by the user
   */
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      console.log(typeof formData);
      const { data } = await axios.post('/api/upload', formData, config);

      setImage(data.imagePath);
      setImagesArray([...imagesArray, data.imagePath]);
      setUploading(false);
    } catch (e) {
      console.error(e);
      setUploading(false);
    }
  };

  /**
   * Dispatches the updateProduct action
   * @param {Object} e Event object to prevent default page reload
   */
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        category,
        subCategory,
        description,
        tags: tagsArray,
        countInStock,
        variations,
        personalizations,
        images: imagesArray,
      })
    );
  };

  /**
   * Adds a new variation to the product
   */
  const addVariationHandler = () => {
    setVariations((variations) => [
      ...variations,
      {
        name: '',
        isOptional: true,
        isSelected: false,
        selectedOption: 0,
        options: [
          {
            name: '',
            additionalPrice: '',
          },
        ],
      },
    ]);
  };

  /**
   * Adds a new personalization to the product
   */
  const addPersonalizationHandler = () => {
    setPersonalizations((personalizations) => [
      ...personalizations,
      {
        name: '',
        isOptional: true,
        isSelected: false,
        value: '',
        additionalPrice: '',
      },
    ]);
  };

  /**
   * Adds a new option to the variation[index]
   * @param {Number} index variation[index] to have an option added
   */
  const addOptionHandler = (index) => {
    const newVariationsArray = [...variations];
    newVariationsArray[index].options.push({
      name: '',
      additionalPrice: '',
    });
    setVariations(newVariationsArray);
  };

  const arrayMove = (array, fromIndex, toIndex) => {
    if (toIndex > array.length || toIndex < 0) {
      return array;
    }
    const deletedElement = array.splice(fromIndex, 1);
    array.splice(toIndex, 0, ...deletedElement);
    return array;
  };
  return (
    <>
      <Meta title='Edit Product' />
      <Row>
        <Col sm={3} className='d-flex justify-content-center'>
          <Link to='/admin/productlist' className='btn btn-light m-0 '>
            Go Back
          </Link>

          <Link to={`/product/${product._id}`} className='btn btn-light m-0 '>
            View Product
          </Link>
        </Col>
        <Col sm={9} className='d-flex justify-content-center'>
          <h1>Edit Product</h1>
        </Col>
      </Row>

      <FormContainer>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Row>
            <Col lg={4} className='px-0'>
              <Carousel
                className='mb-2 product-screen-carousel'
                interval={null}
              >
                {imagesArray.map((image, index) => (
                  <Carousel.Item key={index}>
                    <Image
                      src={image}
                      fluid
                      className='rounded-0 m-0 p-0 product-screen-image'
                    />
                    <Carousel.Caption className='carousel-caption'>
                      <h2 className='m-0 p-0 text-left text-dark'>
                        #{index + 1}
                      </h2>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
              <Row>
                {imagesArray.map((image, index) => (
                  <Col sm={4} key={index}>
                    <Image
                      src={image}
                      fluid
                      className='rounded-0 m-0 mb-1 p-0 product-screen-image'
                    />
                    <div className='d-flex justify-content-around'>
                      <Button
                        variant='success'
                        className='btn-sm px-2 py-1 rounded'
                        onClick={() => {
                          const newArr = arrayMove(
                            imagesArray,
                            index,
                            index - 1
                          );
                          setImagesArray([...newArr]);
                        }}
                      >
                        {' '}
                        <i className='fas fa-angle-double-left'></i>
                      </Button>
                      <Button
                        variant='success'
                        className='btn-sm px-2 py-1 rounded'
                        onClick={() => {
                          const newArr = arrayMove(
                            imagesArray,
                            index,
                            index + 1
                          );
                          setImagesArray([...newArr]);
                        }}
                      >
                        {' '}
                        <i className='fas fa-angle-double-right'></i>
                      </Button>
                      <Button
                        variant='danger'
                        className='btn-sm px-2 py-1 rounded'
                        onClick={() => {
                          imagesArray.splice(index, 1);
                          setImagesArray([...imagesArray]);
                        }}
                      >
                        {' '}
                        <i className='fas fa-trash'></i>
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>

            <Col lg={8} className='pr-0'>
              <Form onSubmit={submitHandler}>
                <div className='p-3 border border-3 rounded-lg'>
                  <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='name'
                      placeholder='Enter Name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Row>
                    <Col>
                      <Form.Group controlId='price'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='Enter price'
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId='countInStock'>
                        <Form.Label>Count In Stock </Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='Count In Stock'
                          value={countInStock}
                          onChange={(e) =>
                            setCountInStock(Number(e.target.value))
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <p className='mb-2'>Image</p>
                  <Form.Group
                    controlId='image'
                    className='border-bottom border-secondary rounded'
                  >
                    <Form.Control
                      type='text'
                      placeholder='Enter image URL'
                      className='border-0'
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    ></Form.Control>
                    <hr className='m-0' />
                    <Form.File
                      id='image-file'
                      label='Choose File'
                      custom
                      onChange={uploadFileHandler}
                    ></Form.File>
                    {uploading && <Loader />}
                  </Form.Group>
                  <Row>
                    <Col xs={12}>
                      <Form.Group controlId='description'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          type='text'
                          placeholder='Enter Description'
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId='category'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter category'
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId='subCategory'>
                        <Form.Label>Sub-Category</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter Sub-Category'
                          value={subCategory}
                          onChange={(e) => setSubCategory(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={9}>
                      <Form.Group controlId='tags'>
                        <Form.Label>Tags (Click a tag to remove)</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter Tag'
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col xs={3} className='pl-0 pt-4 mt-3'>
                      <Button
                        variant='success'
                        className='btn-sm px-2 py-1 ml-2 rounded'
                        onClick={() => {
                          setTagsArray([...tagsArray, tag]);
                          setTag('');
                        }}
                      >
                        <i className='fas fa-plus'></i>
                      </Button>
                    </Col>
                    <Col className='mb-3'>
                      {tagsArray.map((tag, index) => (
                        <Button
                          variant='outline-primary'
                          key={index}
                          className='py-0 px-1 mr-1'
                          onClick={() => {
                            tagsArray.splice(index, 1);
                            setTagsArray([...tagsArray]);
                          }}
                        >
                          {tag}
                        </Button>
                      ))}
                    </Col>
                  </Row>
                  <div className='border border-3 rounded-lg mb-2'>
                    <h4 className='p-2 mb-0'>
                      Variations
                      <Button
                        variant='success'
                        className='btn-sm px-2 py-1 ml-2 rounded'
                        onClick={() => addVariationHandler()}
                      >
                        <i className='fas fa-plus'></i>
                      </Button>
                    </h4>

                    {variations &&
                      variations.map((variation, index) => (
                        <div key={index} className='border-bottom-3 p-2'>
                          <Form.Group controlId={`variation-name-${index}`}>
                            <Row>
                              <Col sm={10}>
                                <p>Variation Name</p>
                              </Col>
                              <Col sm={2}>
                                <Button
                                  variant='danger'
                                  className='btn-sm px-2 py-1 ml-2 rounded'
                                  onClick={() => {
                                    variations.splice(index, 1);
                                    setVariations([...variations]);
                                  }}
                                >
                                  <i className='fas fa-trash'></i>
                                </Button>
                              </Col>
                            </Row>

                            <Form.Control
                              type='text'
                              placeholder='e.g. Size'
                              value={variation.name}
                              onChange={(e) => {
                                variation.name = e.target.value;
                                setVariations([...variations]);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className='ml-1'>
                            <Form.Check
                              className='d-inline-block'
                              type='checkbox'
                              checked={variation.isOptional}
                              onChange={(e) => {
                                variation.isOptional = !variation.isOptional;
                                setVariations([...variations]);
                              }}
                            ></Form.Check>
                            <Form.Label>Optional?</Form.Label>
                          </div>

                          <Row>
                            <Col sm={5}>
                              <p>
                                Option Name{' '}
                                <Button
                                  variant='success'
                                  className='btn-sm px-2 py-1 ml-2 rounded'
                                  onClick={() => addOptionHandler(index)}
                                >
                                  <i className='fas fa-plus'></i>
                                </Button>
                              </p>
                            </Col>
                            <Col sm={3}>
                              <p>Price</p>
                            </Col>
                            <Col sm={2}>
                              <p>Default</p>
                            </Col>
                          </Row>
                          {variation.options &&
                            variation.options.map((option, index) => (
                              <Row key={index}>
                                <Col sm={5}>
                                  <Form.Group
                                    controlId={`${variation.name}-option-${index}-name`}
                                  >
                                    <Form.Control
                                      className='form-control-sm'
                                      type='text'
                                      placeholder='e.g. Large'
                                      value={option.name}
                                      onChange={(e) => {
                                        option.name = e.target.value;
                                        setVariations([...variations]);
                                      }}
                                    ></Form.Control>
                                  </Form.Group>
                                </Col>
                                <Col sm={3}>
                                  <Form.Group
                                    controlId={`${variation.name}-option-${index}-additionalPrice`}
                                  >
                                    <Form.Control
                                      className='form-control-sm'
                                      type='number'
                                      placeholder='4.00'
                                      value={option.additionalPrice}
                                      onChange={(e) => {
                                        option.additionalPrice = Number(
                                          e.target.value
                                        );
                                        setVariations([...variations]);
                                      }}
                                    ></Form.Control>
                                  </Form.Group>
                                </Col>
                                <Col sm={2}>
                                  <Form.Group
                                    className='d-flex justify-content-center'
                                    controlId={`${variation.name}-option-${index}-isSelected`}
                                  >
                                    <Form.Check
                                      type='checkbox'
                                      checked={
                                        variation.selectedOption === index
                                      }
                                      onChange={(e) => {
                                        variation.selectedOption = index;
                                        setVariations([...variations]);
                                      }}
                                    ></Form.Check>
                                  </Form.Group>
                                </Col>
                                <Col sm={1}>
                                  <Button
                                    variant='danger'
                                    className='btn-sm px-2 py-1 ml-2 rounded'
                                    onClick={() => {
                                      variation.options.splice(index, 1);
                                      setVariations([...variations]);
                                    }}
                                  >
                                    <i className='fas fa-trash'></i>
                                  </Button>
                                </Col>

                                <Col className='ml-1 mb-3'>
                                  <Form.Label>Linked Image:</Form.Label>
                                  <Form.Control
                                    className='form-select  ml-2 form-control-sm d-inline-block'
                                    style={{ maxWidth: '150px' }}
                                    as='select'
                                    value={option.linkedImage}
                                    onChange={(e) => {
                                      variation.options[index].linkedImage =
                                        e.target.value;
                                      setVariations([...variations]);
                                    }}
                                  >
                                    <option value={-1}>No Linked Image</option>
                                    {imagesArray.map((image, index) => (
                                      <option key={index} value={index}>
                                        #{index + 1}
                                      </option>
                                    ))}
                                  </Form.Control>
                                </Col>
                              </Row>
                            ))}
                        </div>
                      ))}

                    <h4 className='p-2 mb-0'>
                      Personalization
                      <Button
                        variant='success'
                        className='btn-sm px-2 py-1 ml-2 rounded'
                        onClick={() => addPersonalizationHandler()}
                      >
                        <i className='fas fa-plus'></i>
                      </Button>
                    </h4>
                    {personalizations &&
                      personalizations.map((personalization, index) => (
                        <div
                          key={`personalization-${index}`}
                          className='border-bottom-3 p-2'
                        >
                          <Row>
                            <Col sm={6}>
                              <Form.Group
                                controlId={`personalization-name-${index}`}
                              >
                                <Form.Label>Personalization Name</Form.Label>
                                <Form.Control
                                  type='text'
                                  placeholder='e.g. Greeting Message'
                                  value={personalization.name}
                                  onChange={(e) => {
                                    personalization.name = e.target.value;
                                    setPersonalizations([...personalizations]);
                                  }}
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                            <Col sm={4}>
                              <Form.Group
                                controlId={`additional-price-${index}`}
                              >
                                <Form.Label>Additional Price</Form.Label>
                                <Form.Control
                                  type='number'
                                  placeholder='2.00'
                                  value={personalization.additionalPrice}
                                  onChange={(e) => {
                                    personalization.additionalPrice = Number(
                                      e.target.value
                                    );
                                    setPersonalizations([...personalizations]);
                                  }}
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                            <Col sm={2}>
                              <Button
                                variant='danger'
                                className='btn-sm px-2 py-1 ml-2 rounded'
                                onClick={() => {
                                  personalizations.splice(index, 1);
                                  setPersonalizations([...personalizations]);
                                }}
                              >
                                <i className='fas fa-trash'></i>
                              </Button>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={2}>
                              <p>Optional?</p>
                            </Col>
                            <Col sm={2}>
                              <Form.Check
                                type='checkbox'
                                checked={personalization.isOptional}
                                onChange={(e) => {
                                  personalization.isOptional =
                                    !personalization.isOptional;
                                  setPersonalizations([...personalizations]);
                                }}
                              ></Form.Check>
                            </Col>
                            {personalization.isOptional ? (
                              <Col sm={8}>
                                <Form.Label>Linked Image:</Form.Label>
                                <Form.Control
                                  className='form-select  ml-2 form-control-sm d-inline-block'
                                  style={{ maxWidth: '150px' }}
                                  as='select'
                                  value={personalization.linkedImage}
                                  onChange={(e) => {
                                    personalization.linkedImage =
                                      e.target.value;
                                    setPersonalizations([...personalizations]);
                                  }}
                                >
                                  <option
                                    key={`${personalization.name}-option-null`}
                                    value={null}
                                  >
                                    No Linked Image
                                  </option>
                                  {imagesArray.map((image, index) => (
                                    <option
                                      key={`${personalization.name}-option-${index}`}
                                      value={index}
                                    >
                                      #{index + 1}
                                    </option>
                                  ))}
                                </Form.Control>
                              </Col>
                            ) : null}
                          </Row>
                          <Form.Group
                            controlId={`personalization-name-${index}`}
                          >
                            <Form.Label>Placeholder Text</Form.Label>
                            <Form.Control
                              as='textarea'
                              rows={2}
                              placeholder='e.g. Happy Birthday Richard'
                              value={personalization.value}
                              onChange={(e) => {
                                personalization.value = e.target.value;
                                setPersonalizations([...personalizations]);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </div>
                      ))}
                  </div>
                  <Button type='submit' variant='success'>
                    Update
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
