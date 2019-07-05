import React from 'react';
import PropTypes from 'prop-types';
import ImageList from '../ImageList';

class RoomTypeImageModal extends React.Component {
  componentWillUnmount() {
    const backdrops = document.getElementsByClassName('modal-backdrop');
    for (let i = 0; i < backdrops.length; i += 1) {
      backdrops[i].remove();
    }
    const body = document.getElementsByTagName('body');
    for (let i = 0; i < body.length; i += 1) {
      body[i].classList.remove('modal-open');
      body[i].style.paddingRight = '';
    }
  }

  render() {
    const { roomType, index } = this.props;
    return (
      <div className="modal modal-carousel" id={`roomModal-${index + 1}`} tabIndex={`-${index + 1}`} role="dialog" data-backdrop="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{roomType.name}</h5>
              <button type="button" className="close animated fadeIn" data-dismiss="modal" aria-label="Close">
                <i className="mdi mdi-close" />
              </button>
            </div>
            <div className="modal-body d-flex align-items-center animated fadeIn">
              <ImageList list={roomType.images || []} withIndicators />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RoomTypeImageModal.defaultProps = {
  index: 0,
};

RoomTypeImageModal.propTypes = {
  roomType: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number,
};

export default RoomTypeImageModal;
