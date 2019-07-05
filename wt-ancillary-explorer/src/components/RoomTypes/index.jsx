import React from 'react';
import PropTypes from 'prop-types';
import RoomType from './room-type';

const RoomTypes = ({ ancillary, estimates, onBookRoomTypeClicked }) => {
  if (!ancillary.roomTypes) {
    return [];
  }
  return ancillary.roomTypes
    .map((rt, index) => (
      <RoomType
        ancillary={ancillary}
        key={rt.id}
        roomType={rt}
        estimate={estimates.find(e => e.id === rt.id)}
        index={index}
        onBookRoomTypeClicked={onBookRoomTypeClicked}
      />
    ));
};


RoomTypes.propTypes = {
  ancillary: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array).isRequired,
  onBookRoomTypeClicked: PropTypes.func.isRequired,
};

export default RoomTypes;
