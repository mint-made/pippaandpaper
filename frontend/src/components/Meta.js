import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({
  title = '',
  description,
  keywords,
  brand,
  showBrand = true,
}) => {
  const generateTitle = () => {
    return !title ? brand : showBrand ? `${title} - ${brand}` : title;
  };
  return (
    <Helmet>
      <title>{generateTitle()}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  brand: 'Pippa & Paper',
  description: 'Hand-Made Products',
  keywords: 'cards, prints, stationery, totes, watercolor',
};

export default Meta;
