import React, {
  PropTypes,
  Component
} from 'react';
import {
  Redirect,
  Link
} from 'react-router-dom';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

import './MapArt.css';
import BgImage from '../../media/room_1.jpg';
import BgImage2 from '../../media/room_2.jpg';

class MapArt extends Component {
  render() {
    if (!this.props.location.state) return <Redirect to="/" />;
    return (
      <div className="MapArt">
        {/*<Link to="/"><Button>Go back</Button></Link>*/}
        <div className="image" style={{
          backgroundImage: `url(${this.props.location.state.mapArtUrl})`
        }}></div>
      </div>
    );
  }
}

export default MapArt;
