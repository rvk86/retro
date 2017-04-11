import React, { PropTypes, Component } from 'react';
import GoogleMapReact from 'google-map-react';

import Config from '../../config';
import './Map.css';

class Map extends Component {
  state = {
    defaultCenter: {lat: 59.95, lng: 30.33},
    defaultZoom: 11,
    center: null,
    language: 'nl'
  }
  
  static propTypes = {
    onChange: PropTypes.func
  }
  
  constructor(props) {
    super(props);
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((res) => {
        this.setState({center: {lat: res.coords.latitude, lng: res.coords.longitude}});
      });
    }
  }

  render() {
    return (
      <div className="Map">
        <GoogleMapReact
            bootstrapURLKeys={{
              key: Config.googleMapsApiKey
            }}
            defaultCenter={this.state.defaultCenter}
            center={this.state.center}
            defaultZoom={this.state.defaultZoom}
            onChange={this.props.onChange}>            
        </GoogleMapReact>
        <div className="MapOverlay">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Map;
