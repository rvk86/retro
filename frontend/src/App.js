import React, {
  Component
} from 'react';

import PageHeader from 'react-bootstrap/lib/PageHeader';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import {
  fetchJson,
  fetchBlob
} from './helpers/fetch/Fetch';

import Map from './components/map/Map';
import ColorSelector from './components/colorSelector/ColorSelector';
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
    title: '',
    isLoading: false
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
      isLoading: true
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
        this.props.history.push('/map-art', {mapArtUrl: mapArtUrl})
        this.setState({
          isLoading: false
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
    return (
      <div className="App">
        <Grid>
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
                  <FormControl
                    type="text"
                    placeholder="Set a title"
                    value={this.state.title}
                    disabled={this.state.isLoading}
                    onChange={this.setTitle} />
                </FormGroup>
                <FormGroup>
                  <FormControl
                    componentClass="select"
                    placeholder="Select print size"
                    disabled={this.state.isLoading}
                    onChange={this.setPrintSize}>
                    {this.state.printSizes.map((size, index) => {
                      return (
                        <option value={index} key={size.id}>{size.title}</option>
                      )
                    })}
                  </FormControl>
                </FormGroup>
                <FormGroup>
                  <Button
                    bsStyle="primary"
                    disabled={this.state.isLoading}
                    onClick={this.setMapArt}>
                    {this.state.isLoading ? 'Working...' : 'Ready!'}
                  </Button>
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
