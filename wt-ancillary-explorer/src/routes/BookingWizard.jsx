import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import selectors from '../selectors';
import actions from '../actions';
import BookingForm from '../components/BookingForm';
import BookingFormSuccess from '../components/BookingFormSuccess';
import ScrollToTopOnMount from '../components/ScrollToTopOnMount';

class BookingWizard extends React.PureComponent {
  componentDidMount() {
    const {
      ancillary, guestData, ancillaryBookingData, customerData,
      estimates, history,
    } = this.props;
    if (!ancillary || !guestData || !ancillaryBookingData || !customerData || !estimates) {
      history.push('/');
    }
  }

  render() {
    const {
      ancillary, guestData, ancillaryBookingData, customerData,
      estimates, handleBookingFormSubmit, error,
    } = this.props;

    if (customerData.lastBookingId) {
      return (
        <React.Fragment>
          <ScrollToTopOnMount />
          <BookingFormSuccess
            customerData={customerData}
          />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <ScrollToTopOnMount />
        {guestData && ancillary && estimates && customerData && (
          <BookingForm
            guestData={guestData}
            error={error}
            ancillaryBookingData={ancillaryBookingData}
            ancillary={ancillary}
            estimates={estimates}
            customerData={customerData}
            handleBookingFormSubmit={handleBookingFormSubmit}
          />
        )}
      </React.Fragment>
    );
  }
}

BookingWizard.defaultProps = {
  ancillary: undefined,
  guestData: undefined,
  estimates: [],
  ancillaryBookingData: undefined,
  customerData: undefined,
  error: undefined,
};

BookingWizard.propTypes = {
  ancillary: PropTypes.instanceOf(Object),
  guestData: PropTypes.instanceOf(Object),
  estimates: PropTypes.instanceOf(Array),
  ancillaryBookingData: PropTypes.instanceOf(Object),
  customerData: PropTypes.instanceOf(Object),
  handleBookingFormSubmit: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  error: PropTypes.string,
};

export default connect(
  (state) => {
    const ancillaryBookingData = selectors.booking.getAncillaryData(state);
    const getAncillaryById = selectors.ancillaries.makeGetAncillaryById();
    return {
      ancillary: getAncillaryById(state, ancillaryBookingData.id),
      estimates: selectors.estimates.getCurrentByAncillaryId(state, ancillaryBookingData.id),
      guestData: selectors.booking.getGuestData(state),
      customerData: selectors.booking.getCustomerData(state),
      ancillaryBookingData,
      error: selectors.errors.getBooking(state),
    };
  },
  dispatch => ({
    handleBookingFormSubmit: (values) => {
      dispatch(actions.booking.submitBooking(values));
    },
  }),
)(BookingWizard);
