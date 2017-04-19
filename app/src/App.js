import React, {
  Component
} from 'react';

import qs from 'qs';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Modal from 'react-bootstrap/lib/Modal';
import FormControl from 'react-bootstrap/lib/FormControl';
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
    palettes: [],
    paletteIndex: 0,
    backgroundIndex: null,
    title: ''
  }

  componentWillMount() {
    // Get palettes from server
    fetch(`/palette_list`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({
          palettes: json
        });
      });
  }

  getMapInfo = (mapInfo) => {
    this.setState({
      mapInfo: mapInfo
    });
  }
  
  setTitle = (e) => {
    this.setState({
      title: e.target.value
    });
  }

  getMapArt = () => {
    let params = qs.stringify({
      center: `${this.state.mapInfo.center.lat},${this.state.mapInfo.center.lng}`,
      zoom: this.state.mapInfo.zoom,
      palette_id: this.state.palettes[this.state.paletteIndex].id,
      background_index: this.state.backgroundIndex,
      title: this.state.title
    });

    fetch(`/map/?${params}`)
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        var mapArtUrl = URL.createObjectURL(blob);
        this.setState({
          mapArtUrl: mapArtUrl,
          working: null
        });
      });
  }

  resetMapArt = () => {
    this.setState({
      mapArtUrl: null
    });
  }

  facebookResponse = (res) => {
    if (res.accessToken) {
      this.setState({
        user: res
      });
    }
  }

  selectPalette = (offset) => {
    if (this.state.paletteIndex === 0 && offset < 0) return;
    if (this.state.paletteIndex === (this.state.palettes.length - 1) && offset > 0) return;

    this.setState({
      paletteIndex: this.state.paletteIndex + offset,
      backgroundIndex: null
    });
  }

  selectBackground = (paletteIndex, backgroundIndex) => {
    if (paletteIndex !== this.state.paletteIndex) return;

    this.setState({
      backgroundIndex: backgroundIndex
    });
  }

  render() {
    let mapOverlay, button;
    if (this.state.mapArtUrl) {
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
            <PageHeader>One of a kind</PageHeader>
          </Col>
          <Col xs={8}>
            <Map onChange={this.getMapInfo}>
              {mapOverlay}
            </Map>
          </Col>
          <Col xs={4}>
            <ColorSelector palettes={this.state.palettes}
                           paletteIndex={this.state.paletteIndex}
                           selectPalette={this.selectPalette} 
                           backgroundIndex={this.state.backgroundIndex}
                           selectBackground={this.selectBackground}
                           barHeight={50}/>
            <form>
              <FormGroup>
              <FormControl type="text"
                           value={this.state.title}
                           placeholder="Set a title"
                           onChange={this.setTitle}></FormControl>
              </FormGroup>
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
