import React, {
  PropTypes,
  Component
} from 'react';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';
import Geosuggest from 'react-geosuggest';

import Config from '../../config';
import './Map.css';

class Map extends Component {
  state = {
    defaultCenter: {
      lat: 59.95,
      lng: 30.33
    },
    defaultZoom: 11,
    center: null,
    language: 'nl'
  }

  static propTypes = {
    onChange: PropTypes.func
  }

  componentWillMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((res) => {
        this.setState({
          center: {
            lat: res.coords.latitude,
            lng: res.coords.longitude
          }
        });
      });
    } else {
      this.setState({
        center: {
          lat: 52.3557194,
          lng: 4.8889233
        }
      });
    }
  }

  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    el.style.height = `${el.clientWidth}px`;
  }

  setCenter = (suggest) => {
    this.setState({
      center: suggest.location
    });
    console.log(suggest)
  }

  render() {
    let overlay;
    if (this.props.children) {
      overlay = (
        <div className="MapOverlay">
          {this.props.children}
        </div>
      );
    }
    return (
      <div className="Map">
        <Geosuggest className="form-group" 
                    inputClassName="form-control"
                    suggestsClassName="btn-group-vertical"
                    suggestItemClassName="btn btn-default"
                    onSuggestSelect={this.setCenter}/>
        <GoogleMapReact
            bootstrapURLKeys={{
              key: Config.googleMapsApiKey
            }}
            center={this.state.center}
            defaultZoom={this.state.defaultZoom}
            onChange={this.props.onChange}>            
        </GoogleMapReact>
        {overlay}
      </div>
    );
  }
}

export default Map;
