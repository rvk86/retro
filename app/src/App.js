import React, { Component } from 'react';

import qs from 'qs';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Modal from 'react-bootstrap/lib/Modal';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import Map from './components/map/Map';
import LoginButton from './components/loginButton/LoginButton';
import './App.css';

class App extends Component {
  state = {
    mapInfo: {},
    mapArtUrl: null,
    user: null
  }
  
  getMapInfo = (mapInfo) => {
    this.setState({mapInfo: mapInfo});
  }
  
  getMapArt = () => {
    this.setState({working: 'pulsate'});
    let params = qs.stringify({
      center: `${this.state.mapInfo.center.lat},${this.state.mapInfo.center.lng}`,
      zoom: this.state.mapInfo.zoom,
      palette_id: '694737',
      background_index: 0
    });
    
    fetch(`http://127.0.0.1:8000/map/?${params}`)
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        var mapArtUrl = URL.createObjectURL(blob);
        this.setState({mapArtUrl: mapArtUrl, working: null});
      });
  }
  
  resetMapArt = () => {
    this.setState({mapArtUrl: null});
  }
  
  facebookResponse = (res) => {
    if(res.accessToken) {
      this.setState({user: res});
    }
  }
  
  render() {
    let mapOverlay;
    if(this.state.mapArtUrl) {
      mapOverlay = (
        <div className="mapArtWrapper" style={{'backgroundImage': `url(${this.state.mapArtUrl})`}}>
          <Button bsStyle="primary" bsSize="large" onClick={this.resetMapArt}>Ugly! Try again please</Button>
        </div>
      );
    } else {
      mapOverlay = (
        <form className="form-inline">
        <FormGroup>
          <FormControl componentClass="select" placeholder="select">
            <option value="select">select</option>
            <option value="other">...</option>
          </FormControl>
          <Button bsStyle="primary" onClick={this.getMapArt}>I'm an artist, make this art</Button>
        </FormGroup>
      </form>
      );
    }
    return (
      <Grid fluid={true}>
      <Modal show={!this.state.user}>
        <Modal.Body>
          <LoginButton callback={this.facebookResponse}/>
        </Modal.Body>
      </Modal>
        <Row>
          <Col xs={12}>
            <Map onChange={this.getMapInfo}>
              {mapOverlay}
            </Map>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
