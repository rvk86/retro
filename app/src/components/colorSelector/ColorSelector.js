import React, { PropTypes, Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

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
  
  _keyDown = (e) => {
    if(e.key === 'ArrowUp') {
      e.preventDefault();
      this.props.selectPalette(-1);
    } 
    if(e.key === 'ArrowDown') {
      e.preventDefault();
      this.props.selectPalette(1);
    }
  }
  
  _touchStart = (e) => {
    e.preventDefault();
    this.touchStartY = e.touches[0].clientY;
  }
  
  _touchEnd = (e) => {
    let diff = e.changedTouches[0].clientY - this.touchStartY;
    let offset = 0;
    if(diff > 20) {
      offset = -1;
    } else if(diff < -20) {
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
    
    return (
      <div className="ColorSelector">
        <div className="navigation">
          <Button bsStyle="primary" 
                  onClick={() => this.props.selectPalette(-1)} 
                  className={this.props.paletteIndex <= 0 ? 'moveUp disabled' : 'moveUp'}>
            <Glyphicon glyph="chevron-up"/>
          </Button>
        </div>
        <div className="scrollableWrapper">
          <div className="scrollable" 
               style={scrollableStyle} 
               onWheel={this.wheel}
               onTouchStart={this._touchStart}
               onTouchEnd={this._touchEnd}>
            {colorBars}
          </div>
        </div>
        <div className="navigation">
          <Button bsStyle="primary" 
                  onClick={() => this.props.selectPalette(1)}
                  className={this.props.paletteIndex >= (this.props.palettes.length - 1) ? 'moveDown disabled' : 'moveDown'}>
            <Glyphicon glyph="chevron-down"/>
          </Button>
        </div>
      </div>
    );
  }
}

export default ColorSelector;
