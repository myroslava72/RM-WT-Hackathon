import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import selectors from '../selectors';

const ErrorPage = ({ status, message }) => (
  <div className="row">
    <div className="col-md-12">
      <h1>
        {`${status}: ${message}`}
      </h1>
      <div className="row text-center">
        <div className="col-12">
          <Link className="btn btn-secondary" to="/">Back to homepage</Link>
        </div>
      </div>
    </div>
  </div>
);

ErrorPage.defaultProps = {
  status: 404,
  message: 'Page not found',
};

ErrorPage.propTypes = {
  status: PropTypes.number,
  message: PropTypes.string,
};

export default connect(
  (state) => {
    const error = selectors.errors.getGlobal(state);
    return { ...error };
  },
)(ErrorPage);
