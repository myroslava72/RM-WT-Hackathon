import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import selectors from '../selectors';
import actions from '../actions';

import ScrollToTopOnMount from '../components/ScrollToTopOnMount';
import MapSearch from '../components/MapSearch';

const SearchOnMap = ({
  handleSearchFormSubmit, results, sortedResults, searchError,
}) => (
  <React.Fragment>
    <ScrollToTopOnMount />
    <MapSearch
      handleSearchFormSubmit={handleSearchFormSubmit}
      results={results}
      sortedResults={sortedResults}
      searchError={searchError}
    />
  </React.Fragment>
);

SearchOnMap.defaultProps = {
  results: [],
  sortedResults: [],
  searchError: undefined,
};

SearchOnMap.propTypes = {
  handleSearchFormSubmit: PropTypes.func.isRequired,
  results: PropTypes.instanceOf(Array),
  sortedResults: PropTypes.instanceOf(Array),
  searchError: PropTypes.string,
};

export default connect(
  (state) => {
    const filterAncillaries = selectors.ancillaries.makeAncillaryFilterByIds();
    const getAncillary = selectors.ancillaries.makeGetAncillaryById();
    const searchResults = selectors.search.getResults(state);
    return {
      results: filterAncillaries(state, searchResults),
      sortedResults: selectors.search.getSortedResults(state, getAncillary),
      searchError: selectors.errors.getSearch(state),
    };
  },
  dispatch => ({
    handleSearchFormSubmit: values => dispatch(actions.search.byAttributes(values)),
  }),
)(SearchOnMap);
