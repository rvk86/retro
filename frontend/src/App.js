import React, {
  Component
} from 'react';

import PageHeader from 'react-bootstrap/lib/PageHeader';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Modal from 'react-bootstrap/lib/Modal';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import {
  fetchJson,
  fetchBlob
} from './helpers/fetch/Fetch';

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
    printSizes: [],
    printSize: {},
    title: ''
  }

  componentDidMount() {
    fetchJson(`palette_list`)
      .then((res) => {
        this.setState({
          palettes: res
        });
      });
    fetchJson(`print_size_list`)
      .then((res) => {
        this.setState({
          printSizes: res,
          printSize: res[0]
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

  setPrintSize = (e) => {
    this.setState({
      printSize: this.state.printSizes[e.target.value]
    });
  }

  setMapArt = () => {
    this.setState({
      mapArtUrl: 'http://www.downgraf.com/wp-content/uploads/2014/09/01-progress.gif'
    });

    let query = {
      center: `${this.state.mapInfo.center.lat},${this.state.mapInfo.center.lng}`,
      zoom: this.state.mapInfo.zoom,
      palette_id: this.state.palettes[this.state.paletteIndex].id,
      background_index: this.state.backgroundIndex,
      title: this.state.title,
      print_size_id: this.state.printSize.id
    };

    fetchBlob(`map`, query)
      .then((res) => {
        var mapArtUrl = URL.createObjectURL(res);
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
            <Col xs={6}>
              <Map onBoundsChanged={this.setMapInfo}
                   printSize={this.state.printSize}
                   title={this.state.title}/>
            </Col>
            <Col xs={6}>
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
                               onChange={this.setTitle} />
                </FormGroup>
                <FormGroup>
                  <FormControl componentClass="select"
                               onChange={this.setPrintSize}
                               placeholder="Select print size">
                    {this.state.printSizes.map((size, index) => {
                      return (
                        <option value={index} key={size.id}>{size.title}</option>
                      )
                    })}
                  </FormControl>
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
