import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import actions from '../actions';
import selectors from '../selectors';

import AncillaryListing from '../components/AncillaryListing';
import Loader from '../components/Loader';

class Home extends React.PureComponent {
  componentDidMount() {
    const {
      fetchAncillariesList, areAncillariesInitialized,
      eventuallyResolveErroredAncillaries,
      history,
    } = this.props;
    if (!areAncillariesInitialized) {
      fetchAncillariesList().catch(() => {
        history.push('/error-page');
      });
    }
    eventuallyResolveErroredAncillaries();
  }

  render() {
    const {
      ancillaries, estimates, next, areAncillariesInitialized, isLoadingMore, fetchAncillariesList,
    } = this.props;
    return (
      <div className="row">
        <div className="col-md-12">
          {!areAncillariesInitialized
            ? <Loader block={200} label="Loading ancillaries from API..." />
            : (
              <React.Fragment>

                <header className="row">
                  <div className="col-md-12">

                    <div className="text-center">
                      <h1 className="mt-1">Ancillary Explorer</h1>
                      <div className="row">
                        <div className="col-md-10 mx-auto mb-2">
                          <p className="lead mb-1">Browse ancillary providers, check their products and get pricing information!</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </header>

                <AncillaryListing
                  ancillaries={ancillaries || []}
                  estimates={estimates || {}}
                  isLoadingMore={isLoadingMore}
                  showMore={!!next}
                  fetchMoreAncillaries={fetchAncillariesList}
                />
              </React.Fragment>
            )}
        </div>
      </div>
    );
  }
}

Home.defaultProps = {
  next: undefined,
};

Home.propTypes = {
  fetchAncillariesList: PropTypes.func.isRequired,
  ancillaries: PropTypes.instanceOf(Array).isRequired,
  estimates: PropTypes.instanceOf(Object).isRequired,
  next: PropTypes.string,
  areAncillariesInitialized: PropTypes.bool.isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
  eventuallyResolveErroredAncillaries: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(connect(
  state => ({
    ancillaries: selectors.ancillaries.getAncillariesWithName(state),
    estimates: selectors.estimates.getCurrent(state),
    next: selectors.ancillaries.getNextAncillary(state),
    areAncillariesInitialized: selectors.ancillaries.areAncillariesInitialized(state),
    isLoadingMore: selectors.ancillaries.isLoadingMore(state),
  }),
  dispatch => ({
    fetchAncillariesList: () => dispatch(actions.ancillaries.fetchAncillariesList()),
    eventuallyResolveErroredAncillaries: () => dispatch(actions.ancillaries.eventuallyResolveErroredAncillaries()),
  }),
)(Home));
