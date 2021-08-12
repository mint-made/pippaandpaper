//import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

//import SearchBox from './SeachBox.js';
import { logout } from '../actions/userActions.js';
import React from 'react';

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  const categoryArr = [
    {
      name: 'Cards',
      sub: ['Birthday', 'Wedding', 'New Baby', 'Celebrate', 'All Occasions'],
    },
    { name: 'Prints', sub: ['Safari Animals', 'Sea Animal'] },
    {
      name: 'Stationery',
      sub: ['Postcards', 'Notepad', 'To Do List'],
    },
    { name: 'Totes', sub: [] },
  ];

  const kebabCase = (string) => {
    return string.replace(/ /g, '-').toLowerCase();
  };

  //Searchbar:
  //<Route render={({ history }) => <SearchBox history={history} />} />
  return (
    <header>
      <Container>
        <div className='d-none d-md-flex justify-content-center px-3'>
          <LinkContainer to='/'>
            <h2 className='mt-2 mb-0 pb-0 text-dark cursor-pointer'>
              Pippa & Paper
            </h2>
          </LinkContainer>
        </div>
        <Navbar variant='light' expand='md' className='py-4' collapseOnSelect>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <div className='d-flex justify-content-center px-3 d-md-none'>
            <LinkContainer to='/'>
              <h2 className='my-0 text-dark cursor-pointer'>Ecommerce Site</h2>
            </LinkContainer>
          </div>
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='mx-auto'>
              {categoryArr.map((category, index) => (
                <NavDropdown
                  title={category.name}
                  id='nav-dropdown'
                  key={index}
                >
                  {category.sub.map((subCat, index) => (
                    <LinkContainer
                      to={`/shop/${kebabCase(category.name)}/${kebabCase(
                        subCat
                      )}`}
                      key={index}
                    >
                      <NavDropdown.Item>{subCat}</NavDropdown.Item>
                    </LinkContainer>
                  ))}
                </NavDropdown>
              ))}
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <i className='fas fa-shopping-cart'></i>
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown
                  title={
                    <>
                      <i className='fas fa-user'></i>
                    </>
                  }
                  id='username'
                >
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  {userInfo && userInfo.isAdmin && (
                    <>
                      <LinkContainer to='/admin/userlist'>
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/productlist'>
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/orderlist'>
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link href='/login'>
                    <i className='fas fa-user'></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
