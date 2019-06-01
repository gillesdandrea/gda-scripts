import React from 'react';
import PropTypes from 'prop-types';

import './Hello.scss';

const propTypes = {
  name: PropTypes.string,
};

const defaultProps = {
  name: 'World',
};

const Hello = ({ name }) => <div className="hello">Hello {name}!</div>;

Hello.propTypes = propTypes;
Hello.defaultProps = defaultProps;

export default Hello;
