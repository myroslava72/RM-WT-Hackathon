import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';

import Loader from '../Loader';

const STATUS_SUCCEEDED = 'succeeded';
const STATUS_FAILED = 'failed';

const CancellationForm = ({ hotel, handleSubmit, initialValues }) => {
  const validate = (values) => {
    const errors = {};
    // formats
    if (!values.bookingId) {
      errors.bookingId = 'We need a booking reference!';
    }
    return errors;
  };

  const doSubmit = (values, formActions) => {
    handleSubmit({
      bookingUri: hotel.bookingUri,
      bookingId: values.bookingId,
      finalize: (isOk, code) => {
        formActions.setSubmitting(false);
        if (isOk) {
          formActions.resetForm();
          formActions.setStatus(STATUS_SUCCEEDED);
        } else {
          formActions.setStatus(STATUS_FAILED);
          let msg;
          switch (code) {
            case '#notFound':
              msg = 'Unknown booking reference. A typo, perhaps?';
              break;
            case '#forbidden':
              msg = 'Booking cancellation is not allowed.';
              break;
            case '#alreadyCancelled':
              msg = 'Booking has been already cancelled';
              break;
            default:
              msg = 'Booking cannot be cancelled due to an unknown error.';
          }
          formActions.setErrors({
            bookingId: msg,
          });
        }
      },
    });
  };
  return (
    <div className="col-md-12">
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={doSubmit}
      >
        {({
          isSubmitting, errors, touched, status,
        }) => (
          <React.Fragment>
            {(status === STATUS_SUCCEEDED)
              && <div className="alert alert-success">Success! The booking has been cancelled.</div>
            }
            {isSubmitting && <Loader block={100} label="Submitting..." />}
            {!isSubmitting && (
              <Form className="border bg-white py-1">
                <div className="input-group">
                  <div className="col-md-8 form-inline">
                    <label htmlFor="bookingId" className="col-md-3">Booking reference:</label>
                    <Field type="text" className="form-control col-md-9" name="bookingId" id="bookingId" placeholder="Booking reference" />
                    {errors.bookingId && touched.bookingId && <div className="offset-md-3"><small className="text-danger">{errors.bookingId}</small></div>}
                  </div>
                  <div className="col-md-4 text-right">
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">Cancel booking</button>
                  </div>
                </div>
              </Form>
            )}
          </React.Fragment>
        )}
      </Formik>
    </div>
  );
};

CancellationForm.defaultProps = {
  initialValues: {
    bookingId: '',
  },
};

CancellationForm.propTypes = {
  hotel: PropTypes.instanceOf(Object).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.instanceOf(Object),
};

export default CancellationForm;
