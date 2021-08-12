import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Returns an overview of the product + variant details that the customer has selected
 * This can be displayed in Cart, Place Order & OrderScreen
 * @param {Object} item The item object of the selected Item + variant options
 */

const ItemVariantInfo = ({ item, total = false, quantity = false }) => {
  //Returns numbers to two decimal points
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  return (
    <>
      <Link to={`/product/${item._id}`}>
        {item.name} - £{addDecimals(item.price)}
      </Link>
      {item.variantId && (
        <>
          <hr className='my-2' />
          {item.variations &&
            item.variations.map((variation, index) =>
              !variation.isOptional ||
              (variation.isOptional && variation.isSelected) ? (
                <p className='m-1' key={`variation-${index}`}>
                  {variation.name + ': '}
                  {variation.options[variation.selectedOption].name}
                  {variation.options[variation.selectedOption].additionalPrice >
                    0 &&
                    ' (+£' +
                      addDecimals(
                        variation.options[variation.selectedOption]
                          .additionalPrice
                      ) +
                      ')'}
                </p>
              ) : null
            )}
          {item.personalizations &&
            item.personalizations.map((personalization, index) =>
              !personalization.isOptional ||
              (personalization.isOptional && personalization.isSelected) ? (
                <p key={index}>
                  {personalization.name + ': '}
                  {personalization.value}
                  {personalization.additionalPrice > 0 &&
                    ' (+£' + addDecimals(personalization.additionalPrice) + ')'}
                </p>
              ) : null
            )}
          {total && (
            <>
              <hr className='my-2' />
              Total: £{addDecimals(item.totalPrice)}
            </>
          )}
        </>
      )}
      {quantity && (
        <>
          <hr className='my-2' />
          <p>Quantity: {item.qty}</p>
        </>
      )}
    </>
  );
};

export default ItemVariantInfo;
