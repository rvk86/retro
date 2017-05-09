import React, {
  PropTypes,
  Component
} from 'react';
import {
  Redirect,
  Link
} from 'react-router-dom';

import './MapArt.css';
import BgImage from '../../media/room_1.jpg';

class MapArt extends Component {
  static propTypes = {
    mapArtUrl: PropTypes.string,
    reset: PropTypes.func
  }

  render() {
    if (!this.props.location.state) return <Redirect to="/" />;

    return (
      <div className="MapArt">
        <Link to="/">Go back</Link>
        <img src={this.props.location.state.mapArtUrl} alt="room" />
      </div>
    );
  }
}

export default MapArt;
