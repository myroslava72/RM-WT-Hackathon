import React from 'react';
import PropTypes from 'prop-types';
import {
  Field,
} from 'formik';

const GuestInfoForm = ({
  form,
}) => (
  <React.Fragment>
    <div className="form-row mb-1">
      <div className="offset-md-3 col-md-3">
        Name
      </div>
      <div className="col-md-3">
        Surname
      </div>
      <div className="col-md-3">
        Age
      </div>
    </div>
    {form.values.booking.guestInfo && form.values.booking.guestInfo.map((guest, index) => (
      <div className="form-row mb-1" key={`guest.${guest.id}`}>
        <div className="col col-md-3 col-form-label">
          <label htmlFor={`booking.guestInfo.${index}.name`}>
            Guest #
            {index + 1}
          </label>
        </div>
        <div className="col-md-3">
          <Field
            aria-label="Name"
            type="text"
            className="form-control"
            name={`booking.guestInfo.${index}.name`}
            id={`booking.guestInfo.${index}.name`}
            min="0"
          />
        </div>
        <div className="col-md-3">
          <Field
            aria-label="Surname"
            type="text"
            className="form-control"
            name={`booking.guestInfo.${index}.surname`}
            id={`booking.guestInfo.${index}.surname`}
            min="0"
          />
        </div>
        <div className="col-md-3">
          <Field
            aria-label="Age"
            type="number"
            disabled
            className="form-control"
            name={`booking.guestInfo.${index}.age`}
            id={`booking.guestInfo.${index}.age`}
            min="0"
          />
        </div>
      </div>
    ))}
  </React.Fragment>
);

GuestInfoForm.propTypes = {
  form: PropTypes.instanceOf(Object).isRequired,
};

export default GuestInfoForm;
