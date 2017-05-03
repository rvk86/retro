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
import MapArtModal from './components/mapArtModal/MapArtModal';
import './App.css';

class App extends Component {
  state = {
    mapInfo: {},
    mapArtUrl: null,
    user: null,
    palettes: [],
    paletteIndex: 0,
    backgroundIndex: 0,
    title: ''
  }

  componentDidMount() {
    // Get palettes from server
    fetch(`http://192.168.1.105:8000/palette_list`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({
          palettes: json
        });
      });
  }

  setMapInfo = (map) => {
    let center = map.getCenter();
    this.setState({
      mapInfo: {
        center: {
          lat: center.lat(),
          lng: center.lng()
        },
        zoom: map.getZoom()
      }
    });
  }

  setTitle = (e) => {
    this.setState({
      title: e.target.value
    });
  }

  setMapArt = () => {
    this.setState({
      mapArtUrl: 'http://www.downgraf.com/wp-content/uploads/2014/09/01-progress.gif'
    });

    let params = qs.stringify({
      center: `${this.state.mapInfo.center.lat},${this.state.mapInfo.center.lng}`,
      zoom: this.state.mapInfo.zoom,
      palette_id: this.state.palettes[this.state.paletteIndex].id,
      background_index: this.state.backgroundIndex,
      title: this.state.title
    });

    fetch(`http://192.168.1.105:8000/map/?${params}`)
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
      backgroundIndex: 0
    });
  }

  selectBackground = (paletteIndex, backgroundIndex) => {
    console.log(backgroundIndex)
    if (paletteIndex !== this.state.paletteIndex) return;

    this.setState({
      backgroundIndex: backgroundIndex
    });
  }

  render() {
    let button;
    if (this.state.mapArtUrl) {
      button = <Button onClick={this.resetMapArt}>Reset</Button>;
    } else {
      button = <Button bsStyle="primary" onClick={this.setMapArt}>Ready!</Button>;
    }
    return (
      <div className="App">
        <MapArtModal mapArtUrl={this.state.mapArtUrl} reset={this.resetMapArt}/>
        <Grid fluid={true}>
        {/*<Modal show={!this.state.user}>
           <Modal.Body>
            <LoginButton callback={this.facebookResponse}/>
          </Modal.Body>
        </Modal>*/}
          <Row>
            <Col xs={12}>
              <PageHeader>Maps you love</PageHeader>
            </Col>
            <Col xs={4}>
              <Map onBoundsChanged={this.setMapInfo}/>
            </Col>
            <Col xs={8}>
              <ColorSelector palettes={this.state.palettes}
                             paletteIndex={this.state.paletteIndex}
                             selectPalette={this.selectPalette}
                             backgroundIndex={this.state.backgroundIndex}
                             selectBackground={this.selectBackground}
                             barHeight={50}/>

              <form>
                <FormGroup>
                <FormControl type="text"
                             placeholder="Set a title"
                             value={this.state.title}
                             onChange={this.setTitle}></FormControl>
                </FormGroup>
                <FormGroup>
                  {button}
                </FormGroup>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
