import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Table,
  Button,
  Row,
  Col,
  Image,
  Dropdown,
  Form,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  listProducts,
  deleteProduct,
  createProduct,
  listProductCategories,
} from '../actions/productActions';
import Paginate from '../components/Paginate';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import Meta from '../components/Meta';
import { Link, useLocation } from 'react-router-dom';

const ProductListScreen = ({ history, match }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const sort = useQuery().get('sort') || '';
  const category = match.params.category
    ? match.params.category.replace(/-/g, ' ')
    : '';
  const subCategory = match.params.subCategory
    ? match.params.subCategory.replace(/-/g, ' ')
    : '';
  const keyword = useQuery().get('q') || '';
  const pageNumber = useQuery().get('page') || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const productCategories = useSelector((state) => state.productCategories);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategories;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login');
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(
        listProducts(
          keyword,
          pageNumber.toString(),
          category,
          subCategory,
          sort
        )
      );
      dispatch(listProductCategories());
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
    sort,
    category,
    subCategory,
    keyword,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id));
    }
  };

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const createProductHandler = (product) => {
    dispatch(createProduct());
  };

  const sortSelectHandler = (value) => {
    history.push(`${location.pathname}?sort=${value}`);
  };

  const kebabCase = (string) => {
    return string.replace(/ /g, '-').toLowerCase();
  };

  return (
    <>
      <Meta title='Product List' />
      <Row className='align-items-center mb-3'>
        <Col xs={4} className='d-flex justify-content-left'>
          <Form.Group
            controlId='tags'
            className='mb-0'
            style={{ maxWidth: '200px' }}
          >
            <Form.Control
              type='text'
              placeholder='Search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button
            variant='light'
            className='btn'
            onClick={() => history.push(`/admin/productlist?q=${searchTerm}`)}
          >
            <i className='fa fa-search'></i>
          </Button>
        </Col>
        <Col xs={8} className='text-right d-flex justify-content-around'>
          {loadingCategories ? (
            <Loader />
          ) : errorCategories ? (
            <Message variant='danger'>{error}</Message>
          ) : (
            <>
              <Dropdown>
                <Dropdown.Toggle id='dropdown-basic'>Category:</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => history.push(`/admin/productlist/`)}
                  >
                    All
                  </Dropdown.Item>
                  {categories.parent &&
                    categories.parent.map((category, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() =>
                          history.push(
                            `/admin/productlist/${kebabCase(category)}`
                          )
                        }
                      >
                        {category}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle id='dropdown-basic'>
                  Sub-Category:
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      history.push(`/admin/productlist/${kebabCase(category)}/`)
                    }
                  >
                    All
                  </Dropdown.Item>
                  {categories.parent &&
                    categories.sub.map((subCat, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() =>
                          history.push(
                            `/admin/productlist/${kebabCase(
                              category
                            )}/${kebabCase(subCat)}`
                          )
                        }
                      >
                        {subCat}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}

          <Dropdown>
            <Dropdown.Toggle id='dropdown-basic'>Sort By:</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => sortSelectHandler('date_desc')}>
                Newest Arrivals
              </Dropdown.Item>
              <Dropdown.Item onClick={() => sortSelectHandler('price_asc')}>
                Price: Low - High
              </Dropdown.Item>
              <Dropdown.Item onClick={() => sortSelectHandler('price_desc')}>
                Price: High - Low
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button variant='success' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      <Paginate
        pages={pages}
        page={page}
        isAdmin={true}
        sort={sort}
        keyword={keyword}
      />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>SUB-CATEGORY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <LinkContainer
                      to={`/product/${product._id}`}
                      style={{ maxHeight: '50px' }}
                      className='cursor-pointer'
                    >
                      <Image src={product.images[0]} rounded />
                    </LinkContainer>
                  </td>
                  <td>
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </td>
                  <td>£{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.subCategory}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
