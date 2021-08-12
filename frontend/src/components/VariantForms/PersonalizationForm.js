import React from 'react';
import { Form } from 'react-bootstrap';

const PersonalizationForm = ({ personalization, onChange, label = false }) => {
  return (
    <>
      {label && (
        <Form.Label>
          {personalization.name}
          {` (+£${personalization.additionalPrice})`}
        </Form.Label>
      )}
      <Form.Control
        as='textarea'
        rows={3}
        placeholder='Personalization Name'
        value={personalization.value}
        onChange={onChange}
      ></Form.Control>
    </>
  );
};

export default PersonalizationForm;
