import React from 'react';
import PropTypes from 'prop-types';

import './Hello.scss';

import { Add } from '../../../../js-class-lib/dist/js-class-lib';
// import { add } from '../../../../js-sample-lib/dist/js-sample-lib';
// const add = (a, b) => a + b;

const adder = new Add(1);

const propTypes = {
  name: PropTypes.string,
};

const defaultProps = {
  name: 'World',
};

const Hello = ({ name }) => (
  <div className="hello">
    Hello {name}! 2+2={adder.add(2, 2)}
  </div>
);

Hello.propTypes = propTypes;
Hello.defaultProps = defaultProps;

export default Hello;
