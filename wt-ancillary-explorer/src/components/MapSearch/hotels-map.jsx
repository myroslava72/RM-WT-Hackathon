import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Map, TileLayer, Marker, Popup, Rectangle,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { Address } from '../AncillaryLocation';
import greenMarkerUrl from '../../assets/img/marker-green.png';
import greenMarkerRetinaUrl from '../../assets/img/marker-green-2x.png';


// copied over from wt-search-api
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

/**
 * Approximately compute how many degrees in each direction does the
 * given distance go.
 *
 * @param {Number} lat in degrees
 * @param {Number} lng in degrees
 * @param {Number} distance in kilometers
 * @return {Object}
 *
 */
const LATITUDE_DEGREE_LENGTH = 111; // Approximately, in kilometers.
const LONGITUDE_DEGREE_LENGTH_EQUATOR = 111.321;
function convertKilometersToDegrees(lat, lng, distance) {
  // We are invariant wrt. hemispheres.
  const scale = Math.cos(toRadians(Math.abs(lat)));
  // The distance between longitude degrees decreases with the distance from equator.
  const longitudeDegreeLength = scale * LONGITUDE_DEGREE_LENGTH_EQUATOR;

  return {
    lat: distance / LATITUDE_DEGREE_LENGTH,
    lng: distance / longitudeDegreeLength,
  };
}

function getBoundingBox(lat, lng, distance) {
  const distances = convertKilometersToDegrees(lat, lng, distance);
  const topLeft = [lat - distances.lat, lng - distances.lng];
  const bottomRight = [lat + distances.lat, lng + distances.lng];
  return [topLeft, bottomRight];
}

class HotelsMap extends React.PureComponent {
  render() {
    const {
      centerpoint, centerpointName, bboxSide, hotels,
    } = this.props;
    const pins = hotels.map(h => (
      <Marker key={h.id} position={[h.location.latitude, h.location.longitude]}>
        <Popup>
          <div className="map-popup">
            <Address address={h.address} name={(<Link to={`/hotels/${h.id}`}>{h.name}</Link>)} />
          </div>
        </Popup>
      </Marker>
    ));

    // Set path to marker icon
    delete L.Icon.Default.prototype._getIconUrl; // eslint-disable-line
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerRetinaUrl,
      iconUrl: markerUrl,
      shadowUrl,
    });
    const greenMarker = new L.Icon({
      iconRetinaUrl: greenMarkerRetinaUrl,
      iconUrl: greenMarkerUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });

    if (!centerpoint) {
      // WT's contact address
      return (
        <Map center={[47.174037, 8.517811]} zoom={3}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
        </Map>
      );
    }
    const bounds = getBoundingBox(centerpoint[0], centerpoint[1], bboxSide);
    return (
      <Map center={centerpoint} bounds={bounds}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Rectangle
          bounds={bounds}
        />
        <Marker position={centerpoint} icon={greenMarker}>
          <Popup>
            <div className="map-popup">
              <h4>{centerpointName}</h4>
            </div>
          </Popup>
        </Marker>
        {pins}
      </Map>
    );
  }
}

HotelsMap.defaultProps = {
  centerpoint: null,
  centerpointName: '',
  bboxSide: null,
  hotels: [],
};

HotelsMap.propTypes = {
  centerpoint: PropTypes.instanceOf(Array),
  centerpointName: PropTypes.string,
  bboxSide: PropTypes.number,
  hotels: PropTypes.instanceOf(Array),
};

export default HotelsMap;
