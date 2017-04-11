import React, { Component } from 'react';

import './ColorSelector.css';

class ColorSelector extends Component {
  state = {
    palettes: [],
    selectedPalette: null,
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
  
  selectPalette = (paletteId) => {
    //Don't run if palette already selected
    if(paletteId === this.state.selectedPalette) return;
    
    this.setState({selectedPalette: paletteId, selectedBackgroundIndex: null});
    this.props.selectPalette(paletteId);
  }
  
  selectBackground = (paletteId, index) => {
    // Only select background for selected palette
    if(paletteId !== this.state.selectedPalette) return;
    
    this.setState({selectedBackgroundIndex: index});
    this.props.selectBackground(index);
  }
  
  render() {
    let colorBars = this.state.palettes.map((palette) => {
      return (
        <div key={palette.id}  
             className={this.state.selectedPalette === palette.id ? 'selected colorBar' : 'colorBar'}
             onClick={() => this.selectPalette(palette.id)}>
          <div className="colorTitle">{palette.title}</div>
          <div className="colorPalette">
            {palette.colors.map((color, index) => {
              let style = {background: color, width: `${100 / palette.colors.length}%`};
              return (
                <div key={index} 
                     className="colorBlock" 
                     style={style}
                     onClick={() => this.selectBackground(palette.id, index)}>
                  <div className={this.state.selectedBackgroundIndex === index ? 'bgText selected' : 'bgText'}>
                    Background color
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
    
    return (
      <div className="ColorSelector">
        {colorBars}
      </div>
    );
  }
}

export default ColorSelector;
