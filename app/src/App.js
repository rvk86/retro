import React, { Component } from 'react';

import qs from 'qs';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Modal from 'react-bootstrap/lib/Modal';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import Map from './components/map/Map';
import LoginButton from './components/loginButton/LoginButton';
import ColorSelector from './components/colorSelector/ColorSelector';
import './App.css';

class App extends Component {
  state = {
    mapInfo: {},
    mapArtUrl: null,
    user: null,
    paletteId: null,
    backgroundIndex: null
  }
  
  getMapInfo = (mapInfo) => {
    this.setState({mapInfo: mapInfo});
  }
  
  getMapArt = () => {
    this.setState({working: 'pulsate'});
    let params = qs.stringify({
      center: `${this.state.mapInfo.center.lat},${this.state.mapInfo.center.lng}`,
      zoom: this.state.mapInfo.zoom,
      palette_id: this.state.paletteId,
      background_index: this.state.backgroundIndex
    });
    
    fetch(`/map/?${params}`)
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
  
  selectPalette = (paletteId) => {
    this.setState({paletteId: paletteId, backgroundIndex: null});
  }
  
  selectBackground = (backgroundIndex) => {
    this.setState({backgroundIndex: backgroundIndex});
  }
  
  render() {
    let mapOverlay, button;
    if(this.state.mapArtUrl) {
      mapOverlay = <div className="mapArt" style={{'backgroundImage': `url(${this.state.mapArtUrl})`}}></div>;
      button = <Button onClick={this.resetMapArt}>Reset</Button>;
    } else {
      button = <Button bsStyle="primary" onClick={this.getMapArt}>Ready!</Button>;
    }
    return (
      <Grid fluid={true}>
      {/*<Modal show={!this.state.user}>
         <Modal.Body>
          <LoginButton callback={this.facebookResponse}/>
        </Modal.Body>
      </Modal>*/}
        <Row>
          <Col xs={12}>
            <PageHeader>One of a kind <small>You are an artist</small></PageHeader>
          </Col>
          <Col xs={8}>
            <Map onChange={this.getMapInfo}>
              {mapOverlay}
            </Map>
          </Col>
          <Col xs={4}>
            <ColorSelector selectPalette={this.selectPalette} 
                           selectBackground={this.selectBackground}
                           barHeight="50"/>
            <form className="form-inline">
              <FormGroup>
                {button}
              </FormGroup>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
