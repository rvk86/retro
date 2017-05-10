import React from 'react';
import ReactDOM from 'react-dom';
import SampleMap from './SampleMap';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SampleMap />, div);
});
