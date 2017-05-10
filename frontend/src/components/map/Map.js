import React, {
  PropTypes,
  Component
} from 'react';
import ReactDOM from 'react-dom';

import {
  withGoogleMap,
  GoogleMap,
} from "react-google-maps";

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
    onBoundsChanged: PropTypes.func,
    printSize: PropTypes.object
  }

  constructor() {
    super();

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

  componentWillUpdate(nextProps) {
    let el = ReactDOM.findDOMNode(this);
    let elWidth = el.getBoundingClientRect().width;
    // let fontSize = 0.05 * elWidth;

    let ratio = nextProps.printSize.width / nextProps.printSize.height;
    let height = elWidth * ratio;

    this.mapStyle = {
      height: `${height}px`,
      // padding: `${0.05 * elWidth}px`,
      // fontSize: `${fontSize}px`
    };

    this.titleStyle = {
      fontFamily: nextProps.font.family
    }
  }

  componentDidUpdate(prevProps) {
    //Weird hacky thing with react-google-maps: https://github.com/tomchentw/react-google-maps/issues/337
    window.google.maps.event.trigger(this._map.context['__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'], 'resize');

    if(!this.props.font.family) return;
    if(this.props.font.family == prevProps.font.family) return;
    // Set selected font
    let newFontFace = document.createElement('link');
    newFontFace.href = `https://fonts.googleapis.com/css?family=${this.props.font.family.replace(' ', '+')}`;
    newFontFace.rel = `stylesheet`;
    document.head.appendChild(newFontFace);
  }

  render() {
    return (
      <div className="Map" style={this.mapStyle}>
        <MapElement containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    defaultCenter={this.defaultCenter}
                    onMapMounted={(map) => { this._map = map; }}
                    onSearchBoxMounted={(searchBox) => { this._searchBox = searchBox; }}
                    boundsChanged={() => { this.props.onBoundsChanged(this._map); }} />
        <div className="title" style={this.titleStyle}>{this.props.title}</div>
      </div>
    );
  }
}

export default Map;
