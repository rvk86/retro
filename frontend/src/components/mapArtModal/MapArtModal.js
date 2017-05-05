import React, { PropTypes, Component } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import Config from '../../config';
import './MapArtModal.css';

class MapArtModal extends Component {
  static propTypes = {
    mapArtUrl: PropTypes.string,
    reset: PropTypes.func
  }

  render() {
    return (
      <Modal className="MapArtModal" show={!!this.props.mapArtUrl} onHide={this.props.reset}>
        <Modal.Header closeButton>
          <Modal.Title>Your very own piece of art!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={this.props.mapArtUrl} />
        </Modal.Body>
      </Modal>
    );
  }
}

export default MapArtModal;
