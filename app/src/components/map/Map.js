import React, { PropTypes, Component } from 'react';
import GoogleMapReact from 'google-map-react';
import './Map.css';

class Map extends Component {
  static propTypes = {
    onChange: PropTypes.func
  }
  
  static defaultProps = {
    center: {lat: 59.95, lng: 30.33},
    zoom: 11
  }

  render() {
    return (
      <div className="Map">
        <GoogleMapReact
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
            onChange={this.props.onChange}>
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
