import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import selectors from '../selectors';
import actions from '../actions';
import Loader from '../components/Loader';
import AncillaryDetail from '../components/AncillaryDetail';
import ScrollToTopOnMount from '../components/ScrollToTopOnMount';

class Ancillary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.startBookingWizard = this.startBookingWizard.bind(this);
  }

  componentDidMount() {
    const {
      fetchAncillaryDetail, match, ancillary, history,
    } = this.props;
    if (!ancillary || (!ancillary.hasDetailLoaded && !ancillary.hasDetailLoading)) {
      fetchAncillaryDetail({ id: match.params.ancillaryId }).catch(() => {
        history.push('/error-page');
      });
    }
  }

  startBookingWizard(values) {
    const { handleBookRoomTypeClicked, history } = this.props;
    handleBookRoomTypeClicked(values);
    history.push('/booking');
  }

  render() {
    const {
      ancillary, estimates, errors,
      handleGuestFormSubmit, guestFormInitialValues,
      handleCancellationFormSubmit,
    } = this.props;
    return (
      <Fragment>
        <ScrollToTopOnMount />
        {(!ancillary || ancillary.hasDetailLoading || !ancillary.hasDetailLoaded)
          ? <Loader block={200} label="Loading ancillary from API..." />
          : (
            <AncillaryDetail
              ancillary={ancillary}
              estimates={estimates}
              errors={errors}
              guestFormInitialValues={guestFormInitialValues}
              handleGuestFormSubmit={handleGuestFormSubmit}
              handleCancellationFormSubmit={handleCancellationFormSubmit}
              handleBookRoomTypeClicked={this.startBookingWizard}
            />
          )}
      </Fragment>
    );
  }
}

Ancillary.defaultProps = {
  ancillary: undefined,
  estimates: [],
  errors: [],
};

Ancillary.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
  ancillary: PropTypes.instanceOf(Object),
  estimates: PropTypes.instanceOf(Array),
  errors: PropTypes.instanceOf(Array),
  fetchAncillaryDetail: PropTypes.func.isRequired,
  handleGuestFormSubmit: PropTypes.func.isRequired,
  guestFormInitialValues: PropTypes.instanceOf(Object).isRequired,
  handleBookRoomTypeClicked: PropTypes.func.isRequired,
  handleCancellationFormSubmit: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(connect(
  (state, ownProps) => {
    const getAncillaryById = selectors.ancillaries.makeGetAncillaryById();
    const { ancillaryId } = ownProps.match.params;
    return {
      ancillary: getAncillaryById(state, ancillaryId),
      estimates: selectors.estimates.getCurrentByAncillaryId(state, ancillaryId),
      errors: selectors.errors.getByAncillaryId(state, ancillaryId),
      guestFormInitialValues: selectors.booking.getGuestData(state),
    };
  },
  dispatch => ({
    fetchAncillaryDetail: id => dispatch(actions.ancillaries.fetchAncillaryDetail(id)),
    handleGuestFormSubmit: (values) => {
      dispatch(actions.booking.setGuestData(values));
      dispatch(actions.estimates.recomputeAllPrices(values));
    },
    handleBookRoomTypeClicked: (values) => {
      dispatch(actions.booking.addRoomType(values));
      dispatch(actions.booking.determineCancellationFees(values));
    },
    handleCancellationFormSubmit: (values) => {
      dispatch(actions.booking.cancelBooking(values));
    },
  }),
)(Ancillary));
