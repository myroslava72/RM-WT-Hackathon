import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown/with-html';
import ScrollAnimation from 'react-animate-on-scroll';

import PillList from '../PillList';
import AncillaryInfoBox from '../AncillaryInfoBox';
import RoomTypes from '../RoomTypes';
import GuestForm from '../GuestForm';
import { ancillaryCategory } from '../../services/enums';
import languageList from '../../assets/language-list.json';

// TODO use cancellationPolicies + defaultCancellationAmount
const AncillaryDetail = ({
  ancillary, estimates, errors, handleGuestFormSubmit, guestFormInitialValues,
  handleBookRoomTypeClicked, handleCancellationFormSubmit,
}) => (
  <React.Fragment>
    <header className="row">
      <div className="col-md-12">

        <div className="text-center">
          <h1 className="mt-1">{ancillary.name}</h1>
          <div className="row">
            <div className="col-md-10 mx-auto">
              <ReactMarkdown source={ancillary.description} className="hotel-description mb-1" escapeHtml />
            </div>
          </div>
          {(ancillary.amenities || ancillaryCategory[ancillary.category] || ancillary.spokenLanguages) && (
            <div className="mb-2">
              <PillList list={[ancillaryCategory[ancillary.category]]} className="badge-primary" prefix="Category: " />
              <PillList list={ancillary.amenities} />
              <PillList list={ancillary.spokenLanguages && ancillary.spokenLanguages.map(l => languageList[l])} className="badge-light" prefix="Spoken language:" />
              <PillList list={ancillary.tags} className="badge-info" />
            </div>
          )}
        </div>

      </div>
    </header>

    <div className="row">
      <div className="col">
        <GuestForm handleSubmit={handleGuestFormSubmit} initialValues={guestFormInitialValues} />
      </div>
    </div>
    {errors.length > 0 && (
    <div className="row">
      <div className="col-md-12">
        <div className="alert alert-danger">Ancillary data is not complete and price estimation might not work as expected.</div>
      </div>
    </div>
    )}

    <div className="row">
      <div className="col-md-12">
        <h3 className="mb-1 h4">Ancillary Products</h3>
        <div className="row">
          <RoomTypes
            ancillary={ancillary}
            estimates={estimates}
            onBookRoomTypeClicked={handleBookRoomTypeClicked}
          />
        </div>
      </div>
    </div>
  </React.Fragment>
);

AncillaryDetail.defaultProps = {
  estimates: [],
  errors: [],
};

AncillaryDetail.propTypes = {
  ancillary: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array),
  errors: PropTypes.instanceOf(Array),
  handleGuestFormSubmit: PropTypes.func.isRequired,
  handleCancellationFormSubmit: PropTypes.func.isRequired,
  guestFormInitialValues: PropTypes.instanceOf(Object).isRequired,
  handleBookRoomTypeClicked: PropTypes.func.isRequired,
};

export default AncillaryDetail;
