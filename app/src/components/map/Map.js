import React, {
  PropTypes,
  Component
} from 'react';
import ReactDOM from 'react-dom';

import {
  withGoogleMap,
  GoogleMap,
} from "react-google-maps";

import Config from '../../config';
import './Map.css';
import MapStyles from './MapStyles.json';

const MapElement = withGoogleMap(props => (
  <GoogleMap ref={props.onMapMounted}
             defaultZoom={13}
             defaultCenter={props.defaultCenter}
             defaultOptions={{ styles: MapStyles }}
             onBoundsChanged={props.boundsChanged}>
  </GoogleMap>
));

class Map extends Component {
  static propTypes = {
    onBoundsChanged: PropTypes.func
  }

  componentWillMount() {
    this.defaultCenter = {
      lat: 52.3557194,
      lng: 4.8889233
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((res) => {
        this.defaultCenter = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        };
      });
    }
  }

  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    el.style.height = `${el.clientWidth}px`;
  }

  render() {
    return (
      <div className="Map">
        <MapElement containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    defaultCenter={this.defaultCenter}
                    onMapMounted={(map) => { this._map = map; }}
                    onSearchBoxMounted={(searchBox) => { this._searchBox = searchBox; }}
                    boundsChanged={() => { this.props.onBoundsChanged(this._map); }} />
      </div>
    );
  }
}

export default Map;
