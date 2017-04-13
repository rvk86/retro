import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import './ColorSelector.css';

class ColorSelector extends Component {
  state = {
    palettes: [],
    selectedPaletteIndex: 0,
    selectedBackgroundIndex: null
  }
  
  constructor(props) {
    super(props);
    fetch(`http://127.0.0.1:8000/palette_list`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.setState({palettes: json});
      });
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
      this.scroll(-1);
    } 
    if(e.key === 'ArrowDown') {
      e.preventDefault();
      this.scroll(1);
    }
  }
  
  selectPalette = (paletteIndex) => {
    //Don't run if palette already selected
    if(paletteIndex === this.state.selectedPaletteIndex) return;
    
    this.setState({selectedPaletteIndex: paletteIndex, selectedBackgroundIndex: null});
    this.props.selectPalette(this.state.palettes[paletteIndex].id);
  }
  
  selectBackground = (paletteIndex, backgroundIndex) => {
    // Only select background for selected palette
    if(paletteIndex !== this.state.selectedPaletteIndex) return;
    
    this.setState({selectedBackgroundIndex: backgroundIndex});
    this.props.selectBackground(backgroundIndex);
  }
  
  scroll = (offset) => {
    // Dont scroll further than top
    if(this.state.selectedPaletteIndex === 0 && offset < 0) return;
    
    let newIndex = this.state.selectedPaletteIndex + offset;

    // Dont scroll lower than bottom
    if(newIndex >= this.state.palettes.length  && offset > 0) return;

    this.selectPalette(newIndex);
  }
  
  render() {
    let colorBars = this.state.palettes.map((palette, paletteIndex) => {
      return (
        <div key={palette.id}  
             className={this.state.selectedPaletteIndex === paletteIndex ? 'selected colorBar' : 'colorBar'}>
          <div className="colorPalette">
            {palette.colors.map((color, backgroundIndex) => {
              let style = {background: color, width: `${100 / palette.colors.length}%`};
              return (
                <div key={backgroundIndex} 
                     className="colorBlock" 
                     style={style}
                     onClick={() => this.selectBackground(paletteIndex, backgroundIndex)}>
                  <div className={this.state.selectedBackgroundIndex === backgroundIndex ? 'bgText selected' : 'bgText'}>
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
      top: -((this.props.barHeight * this.state.selectedPaletteIndex) - (this.props.barHeight / 2))
    };
    
    return (
      <div className="ColorSelector">
        <div className="navigation">
          <Button bsStyle="primary" 
                  onClick={() => this.scroll(-1)} 
                  className={this.state.selectedPaletteIndex <= 0 ? 'disabled' : ''}>
            <Glyphicon glyph="chevron-up"/>
          </Button>
        </div>
        <div className="scrollableWrapper">
          <div className="scrollable" style={scrollableStyle}>
            {colorBars}
          </div>
        </div>
        <div className="navigation">
          <Button bsStyle="primary" 
                  onClick={() => this.scroll(1)}
                  className={this.state.selectedPaletteIndex >= (this.state.palettes.length - 1) ? 'disabled' : ''}>
            <Glyphicon glyph="chevron-down"/>
          </Button>
        </div>
      </div>
    );
  }
}

export default ColorSelector;
