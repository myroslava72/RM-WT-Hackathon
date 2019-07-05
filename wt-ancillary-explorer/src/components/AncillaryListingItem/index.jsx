import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown/with-html';
import ScrollAnimation from 'react-animate-on-scroll';
import { withRouter } from 'react-router-dom';
import imagePlaceholder from '../../assets/img/placeholder.png';
import { ancillaryCategory } from '../../services/enums';

class AncillaryListingItem extends React.Component {
  onCardClick = () => {
    const { ancillary, history } = this.props;
    history.push(`/ancillaries/${ancillary.id}`);
  }

  onKeyPress = (e) => {
    if (e.key !== 'Enter') { return; }
    this.onCardClick();
  }

  render() {
    const { ancillary, estimates } = this.props;

    const currentLowestEstimate = estimates.reduce((acc, current) => {
      if (!acc.price || current.price <= acc.price) {
        return current;
      }
      return acc;
    }, {});
    const selectedImage = (ancillary.images && ancillary.images.length)
      ? ancillary.images[0]
      : imagePlaceholder;
    return (
      <ScrollAnimation animateIn="fadeInUp" animateOnce>
        <div onClick={this.onCardClick} onKeyPress={this.onKeyPress} className="card mb-2 card-with-links" role="link" tabIndex="0">
          <img src={selectedImage} alt={ancillary.name} className="card-img-top" />
          <div className="card-body pt-1 text-muted block-fade">
            <h5 className="card-title h6">{ancillary.name}</h5>
            <div className="card-text">
              <ReactMarkdown source={ancillary.description} escapeHtml />
            </div>
          </div>
          {currentLowestEstimate.price && (
          <div className="card-footer bg-white pt-0">
            <div className="animated fadeIn text--accent">
              <i className="mdi mdi-calendar mdi-18px text-muted" />
              {' '}
              <strong>
                  Available from
                {' '}
                <span className="font--alt">{currentLowestEstimate.price.format()}</span>
                {' '}
                {currentLowestEstimate.currency}
              </strong>
            </div>
          </div>
          )}
          <div className="card-footer bg-white pt-0">
            <span className="text--link border-bottom">See detail</span>
            {ancillaryCategory[ancillary.category] && (
            <div className="float-right">
              <span className="badge badge-primary">
                Category:
                {' '}
                {ancillaryCategory[ancillary.category]}
              </span>
            </div>
            )}
          </div>
        </div>
      </ScrollAnimation>
    );
  }
}

AncillaryListingItem.defaultProps = {
  estimates: [],
};

AncillaryListingItem.propTypes = {
  ancillary: PropTypes.instanceOf(Object).isRequired,
  estimates: PropTypes.instanceOf(Array),
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(AncillaryListingItem);
