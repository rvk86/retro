import React, { Component } from 'react';

import qs from 'qs';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import Map from './components/map/Map';
import './App.css';

class App extends Component {
  state = {
    mapInfo: {},
    mapArtUrl: 'https://facebook.github.io/react/img/logo.svg'
  }
  
  getMapInfo = (mapInfo) => {
    this.setState({mapInfo: mapInfo});
  }
  
  getMapArt = () => {
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
        this.setState({mapArtUrl: mapArtUrl});
      });
  }
  
  render() {
    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={12}>
            <Map onChange={this.getMapInfo}></Map>
            <Button bsStyle="primary" bsSize="large" onClick={this.getMapArt}>Large button</Button>
            <img src={this.state.mapArtUrl} alt=""/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
