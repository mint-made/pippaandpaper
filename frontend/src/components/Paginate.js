import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router';

const Paginate = ({
  pages,
  page,
  isAdmin = false,
  keyword = '',
  sort = '',
}) => {
  const location = useLocation();
  const generateLink = (x) => {
    if (!keyword && !sort) {
      return `${location.pathname}?page=${x + 1}`;
    }
    if (!keyword && sort) {
      return `${location.pathname}?sort=${sort}&page=${x + 1}`;
    }
    if (keyword && !sort) {
      return `${location.pathname}?q=${keyword}&page=${x + 1}`;
    }
    if (keyword && sort) {
      return `${location.pathname}?sort=${sort}&q=${keyword}&page=${x + 1}`;
    }
  };

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer key={x + 1} to={generateLink(x)}>
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
