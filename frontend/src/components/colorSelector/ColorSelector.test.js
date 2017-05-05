import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ColorSelector from './ColorSelector';

const props = {
  palettes: [
    {
      id: '1',
      title: 'test1',
      colors: ['#000000', '#ffffff']
    },
    {
      id: '2',
      title: 'test2',
      colors: ['#aaaaaa', '#bbbbbb']
    }
  ],
  paletteIndex: 0,
  selectPalette: sinon.spy(),
  backgroundIndex: null,
  selectBackground: sinon.spy(),
  barHeight: 50
};

it('has a colorBar element for every palette', () => {
  const el = shallow(<ColorSelector {...props}/>);
  expect(el.find('.colorBar').length).toBe(2);
});

it('invokes selectPalette on click move buttons', () => {
  const el = shallow(<ColorSelector {...props}/>);
  expect(props.selectPalette.callCount).toBe(0);
  el.find('.moveDown').simulate('click');
  expect(props.selectPalette.callCount).toBe(1);
  el.find('.moveUp').simulate('click');
  expect(props.selectPalette.callCount).toBe(2);
});

it('toggles selected class on colorBlock', () => {
  const el = shallow(<ColorSelector {...props}/>);
  expect(el.find('.colorBlock.selected').length).toBe(0);
  el.setProps({backgroundIndex: 0});
  expect(el.find('.colorBlock.selected').length).toBe(1);
  el.setProps({backgroundIndex: 1});
  expect(el.find('.colorBlock.selected').length).toBe(1);
});

// it('invokes selectBackground on click colorBlock', () => {
//   const el = shallow(<ColorSelector {...props}/>);
//   expect(props.selectBackground.callCount).toBe(0);
//   console.log(el.find('.colorBar.selected').first('.colorBlock'))
//   el.find('.colorBar.selected').first('.colorBlock').simulate('click');
//   expect(props.selectBackground.callCount).toBe(1);
//   el.first('.colorBlock').simulate('click');
//   expect(props.selectBackground.callCount).toBe(2);
// });

it('toggles button disabled class when reaching top and bottom of list', () => {
  const el = shallow(<ColorSelector {...props}/>);
  expect(el.find('.moveUp').hasClass('disabled')).toBe(true);
  expect(el.find('.moveDown').hasClass('disabled')).toBe(false);

  el.setProps({paletteIndex: 1});
  
  expect(el.find('.moveUp').hasClass('disabled')).toBe(false);
  expect(el.find('.moveDown').hasClass('disabled')).toBe(true);
  
  el.setProps({paletteIndex: 0});
  
  expect(el.find('.moveUp').hasClass('disabled')).toBe(true);
  expect(el.find('.moveDown').hasClass('disabled')).toBe(false);
});
