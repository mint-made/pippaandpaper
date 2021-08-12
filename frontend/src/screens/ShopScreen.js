import React, { useEffect } from 'react';
import { Row, Col, Breadcrumb, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { listProducts } from '../actions/productActions';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';

const HomeScreen = ({ match, history }) => {
  const location = useLocation();
  const category = match.params.category
    ? match.params.category.replace(/-/g, ' ')
    : '';
  const subCategory = match.params.subCategory
    ? match.params.subCategory.replace(/-/g, ' ')
    : '';
  const keyword = useQuery().get('q') || '';
  const pageNumber = useQuery().get('page') || 1;
  const sort = useQuery().get('sort') || '';

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  useEffect(() => {
    dispatch(
      listProducts(keyword, pageNumber.toString(), category, subCategory, sort)
    );
  }, [dispatch, pageNumber, category, subCategory, keyword, sort]);

  const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    const sArr = s.split(' ').map((string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    });
    return sArr.join(' ');
  };

  const sortSelectHandler = (value) => {
    history.push(`${location.pathname}?sort=${value}`);
  };

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  return (
    <>
      <Meta
        title={
          subCategory
            ? `${capitalize(category)} - ${capitalize(subCategory)}`
            : category
            ? `${capitalize(category)}`
            : 'Shop'
        }
      />
      <Row>
        <Col xs={8}>
          <Breadcrumb>
            <Breadcrumb.Item href='/shop'>Shop</Breadcrumb.Item>
            {category && (
              <Breadcrumb.Item href={`/shop/${category}`}>
                {capitalize(category)}
              </Breadcrumb.Item>
            )}
            {subCategory && (
              <Breadcrumb.Item href={`/shop/${category}/${subCategory}`}>
                {capitalize(subCategory)}
              </Breadcrumb.Item>
            )}
          </Breadcrumb>
        </Col>
        <Col xs={4} className='d-flex justify-content-end'>
          <Dropdown>
            <Dropdown.Toggle id='dropdown-basic'>Sort By:</Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => sortSelectHandler('price_asc')}>
                Price: Low - High
              </Dropdown.Item>
              <Dropdown.Item onClick={() => sortSelectHandler('price_desc')}>
                Price: High - Low
              </Dropdown.Item>
              <Dropdown.Item onClick={() => sortSelectHandler('date_desc')}>
                Newest Arrivals
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Paginate pages={pages} page={page} keyword={keyword} sort={sort} />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
