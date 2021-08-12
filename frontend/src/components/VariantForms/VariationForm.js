import React from 'react';
import { Form } from 'react-bootstrap';

const VariationForm = ({ variation, onChange, label = false }) => {
  return (
    <>
      {label && <Form.Label>{variation.name}</Form.Label>}
      <Form.Control
        as='select'
        className='form-select border border-secondary rounded'
        style={{ minWidth: '120px' }}
        value={variation.selectedOption}
        onChange={onChange}
      >
        {variation.options.map((option, optionIndex) => (
          <option key={option._id} value={optionIndex}>
            {`${option.name} (+£${option.additionalPrice.toFixed(2)})`}
          </option>
        ))}
      </Form.Control>
    </>
  );
};

export default VariationForm;
