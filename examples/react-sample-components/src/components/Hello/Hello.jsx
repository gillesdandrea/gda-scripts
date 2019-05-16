import React from 'react';
import PropTypes from 'prop-types';

import './Hello.scss';

export default class Hello extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
  };

  static defaultProps = {
    name: 'World',
  };

  render() {
    const { name } = this.props;
    return <div className="hello">Hello {name}!</div>;
  }
}
