import React from 'react';
let DemoContent = (props) => {
  return <div>{ props.name }</div>
}
/**
 * 问题： width
 */
let simulationData = [
  {
    width: 25,
    height: 0,
    data: [
      {Row: 0, Col: 0, width: 25, height: 50, content: '<div>1A</div>', style: { backgroundColor: 'brown' }, type: 0},
      {Row: 0, Col: 1, width: 25, height: 150, content: '<div>1A</div>', style: { backgroundColor: 'aqua', zIndex: 2 }, type: 0},
      {Row: 0, Col: 2, width: 50, height: 50, content: '<div>1A</div>', style: { backgroundColor: 'blue' }, type: 0},
    ]
  },
  {
    width: 25,
    height: 50,
    data: [
      {Row: 1, Col: 0, width: 25, height: 100, content: '<div>1A</div>', style: { backgroundColor: 'lightcyan' }, type: 0},
      {Row: 1, Col: 2, width: 25, height: 100, content: '<div>1A</div>', style: { backgroundColor: 'brown' }, type: 0},
      {Row: 1, Col: 3, width: 25, height: 160, content: '<div>1A</div>', style: { backgroundColor: 'lightcyan' }, type: 0},
    ]
  },
  {
    width: 25,
    height: 150,
    data: [
      {Row: 1, Col: 0, width: 50, height: 60, content: '<div>1A</div>', style: { backgroundColor: 'brown' }, type: 0},
      {Row: 1, Col: 2, width: 25, height: 120, content: '<div>1A</div>', style: { backgroundColor: 'blue' }, type: 0},
    ]
  },
  {
    width: 25,
    height: 210,
    data: [
      {Row: 1, Col: 0, width: 50, height: 60, content: '<div>1A</div>', style: { backgroundColor: 'lightcyan' }, type: 0},
      {Row: 1, Col: 3, width: 25, height: 60, content: '<div>1A</div>', style: { backgroundColor: 'brown' }, type: 0},
    ]
  },
  {
    width: 25,
    height: 270,
    data: [
      {Row: 1, Col: 0, width: 50, height: 120, content: '<div>1A</div>', style: { backgroundColor: 'brown' }, type: 0},
      {Row: 1, Col: 2, width: 25, height: 60, content: '<div>1A</div>', style: { backgroundColor: 'lightcyan' }, type: 0},
      {Row: 1, Col: 3, width: 25, height: 60, content: '<div>1A</div>', style: { backgroundColor: 'aqua' }, type: 0},
    ]
  },
  {
    width: 25,
    height: 330,
    data: [
      {Row: 1, Col: 2, width: 50, height: 60, content: '<div>1A</div>', style: { backgroundColor: 'blue' }, type: 0},
    ]
  }
]

export default simulationData