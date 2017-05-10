import React, {
  PropTypes,
  Component
} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import SampleMap from '../sampleMap/SampleMap';
import './ColorSelector.css';

class ColorSelector extends Component {
  static propTypes = {
    palettes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      colors: PropTypes.array
    })),
    barHeight: PropTypes.number,
    paletteIndex: PropTypes.number,
    selectPalette: PropTypes.func,
    backgroundIndex: PropTypes.number,
    selectBackground: PropTypes.func,
  }

  componentWillMount() {
    document.addEventListener("keydown", this._keyDown);
  }


  componentWillUnmount() {
    document.removeEventListener("keydown", this._keyDown);
  }

  shouldComponentUpdate(nextProps) {
    let firstTimeLoaded = this.props.palettes.length === 0 && nextProps.palettes.length > 0;
    let paletteChanged = this.props.paletteIndex !== nextProps.paletteIndex;
    let backgroundChanged = this.props.backgroundIndex !== nextProps.backgroundIndex;

    return firstTimeLoaded || paletteChanged || backgroundChanged;
  }

  _keyDown = (e) => {
    if (e.key === 'ArrowUp') {
      // e.preventDefault();
      this.props.selectPalette(-1);
    }
    if (e.key === 'ArrowDown') {
      // e.preventDefault();
      this.props.selectPalette(1);
    }
  }

  _touchStart = (e) => {
    // e.preventDefault();
    this.touchStartY = e.touches[0].clientY;
  }

  _touchEnd = (e) => {
    let diff = e.changedTouches[0].clientY - this.touchStartY;
    if (diff < 20 && diff > -20) return;

    let offset = 0;
    if (diff > 20) {
      offset = -1;
    } else if (diff < -20) {
      offset = 1;
    }
    this.touchStartY = null;
    this.props.selectPalette(offset);
  }

  _wheel = (e) => {
    let offset = e.deltaY < 0 ? -1 : 1;
    this.scroll(offset);
  }

  render() {
    let colorBars = this.props.palettes.map((palette, paletteIndex) => {
      return (
        <div key={palette.id}
             className={this.props.paletteIndex === paletteIndex ? 'selected colorBar' : 'colorBar'}>
          <div className="colorPalette">
            {palette.colors.map((color, backgroundIndex) => {
              let style = {background: color, width: `${100 / palette.colors.length}%`};
              let selected = this.props.backgroundIndex === backgroundIndex && this.props.paletteIndex === paletteIndex ?
                             'selected' :
                             '';
              return (
                <div key={backgroundIndex}
                     className={`colorBlock ${selected}`}
                     style={style}
                     onClick={() => this.props.selectBackground(paletteIndex, backgroundIndex)}>
                  <div className="bgText">
                    <Glyphicon glyph="ok"/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
    let scrollableStyle = {
      height: this.props.barHeight * 2,
      top: -((this.props.barHeight * this.props.paletteIndex) - (this.props.barHeight / 2))
    };

    // Setting the fill for every path seperately. I tried doing node.style.fill, but for
    // some reason this didn't work on an iPad mini (Chrome 58.0)
    return (
      <div className="ColorSelector">
        <Row>
          <Col sm={6}>
            <SampleMap
              palette={this.props.palettes[this.props.paletteIndex]}
              backgroundIndex={this.props.backgroundIndex}/>
            <p>Just a random map to show you an example of the palette and background color you selected.</p>
          </Col>
          <Col sm={6}>
            <div className="navigation">
              <Button
                bsStyle="primary"
                onClick={() => this.props.selectPalette(-1)}
                className={this.props.paletteIndex <= 0 ? 'moveUp disabled' : 'moveUp'}>
                <Glyphicon glyph="chevron-up"/>
              </Button>
            </div>
            <div className="scrollableWrapper">
              <div
                className="scrollable"
                style={scrollableStyle}
                onWheel={this.wheel}
                onTouchStart={this._touchStart}
                onTouchEnd={this._touchEnd}>
                {colorBars}
              </div>
            </div>
            <div className="navigation">
              <Button
                bsStyle="primary"
                onClick={() => this.props.selectPalette(1)}
                className={this.props.paletteIndex >= (this.props.palettes.length - 1) ? 'moveDown disabled' : 'moveDown'}>
                <Glyphicon glyph="chevron-down"/>
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ColorSelector;
