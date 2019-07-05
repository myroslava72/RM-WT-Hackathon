import React from 'react';
import PropTypes from 'prop-types';

import Masonry from 'react-masonry-css';

import AncillaryListingItem from '../AncillaryListingItem';

const AncillaryListing = ({
  ancillaries, estimates, isLoadingMore, showMore, fetchMoreAncillaries,
}) => {
  const ancillaryItems = ancillaries.map(ancillary => (
    <AncillaryListingItem key={ancillary.id} ancillary={ancillary} estimates={estimates[ancillary.id]} />
  ));

  const breakpointColumnsObj = {
    default: 3,
    1200: 3,
    992: 2,
    768: 1,
  };

  return (
    <div>
      {ancillaries.length
        ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid__col"
          >
            {ancillaryItems}
          </Masonry>
        )
        : <h2 className="h3 text-muted text-center">No ancillaries here at the moment.</h2>
      }
      {showMore && (
      <div className="row text-center">
        <div className="col-12">
          <button type="button" className={`btn btn-secondary ${isLoadingMore ? 'disabled' : ''}`} onClick={fetchMoreAncillaries} disabled={isLoadingMore}>
            {isLoadingMore ? (
              <span>
                <i className="mdi mdi-loading mdi-spin text-light" />
                {' '}
                <span>Loading...</span>
              </span>
            ) : <span>Load more</span>}
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

AncillaryListing.propTypes = {
  ancillaries: PropTypes.instanceOf(Array).isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
  showMore: PropTypes.bool.isRequired,
  fetchMoreAncillaries: PropTypes.func.isRequired,
  estimates: PropTypes.instanceOf(Object).isRequired,
};

export default AncillaryListing;
