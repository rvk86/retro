import React from 'react';
import ReactDOM from 'react-dom';
import ColorSelector from './ColorSelector';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ColorSelector />, div);
});

it('doesnt scroll below 0', () => {
  const div = document.createElement('div');
  let el = ReactDOM.render(<ColorSelector barHeight="50"/>, div);
  el.instance().handleClick();
});
