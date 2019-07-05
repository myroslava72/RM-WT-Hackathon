import React from 'react';
import PropTypes from 'prop-types';

const BookingFormSuccess = ({ customerData }) => (
  <React.Fragment>
    <div className="row">
      <div className="col-md-12">
        <div className="text-center">
          <h1 className="my-1">
          Thank you!
          </h1>
        </div>
        <div className="alert alert-success">
          <p>
For further communication with the hotel, please use
            {' '}
            <strong>
              {customerData.lastBookingId}
            </strong>
            {' '}
as a reference. Your order is in
            {' '}
            {customerData.lastBookingStatus}
            {' '}
state which means that
            {' '}
            {customerData.lastBookingStatus === 'pending' && (<span>the hotel accepted your request and will contact you with further information.</span>)}
            {customerData.lastBookingStatus === 'confirmed' && (<span>the hotel accepted your request and awaits your arrival.</span>)}
          </p>
        </div>
      </div>
    </div>
  </React.Fragment>
);

BookingFormSuccess.propTypes = {
  customerData: PropTypes.instanceOf(Object).isRequired,
};

export default BookingFormSuccess;
