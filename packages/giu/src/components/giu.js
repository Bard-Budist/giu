// @flow

/* eslint-disable global-require */

import React from 'react';
import PropTypes from 'prop-types';

// ==========================================
// Component
// ==========================================
// -- A root component that can be used for custom themes.
type Props = {
  theme: string | Object,
  children: any,
};

class Giu extends React.PureComponent {
  props: Props;

  getChildContext() {
    return { theme: this.props.theme };
  }

  render() {
    return this.props.children;
  }
}

Giu.childContextTypes = {
  theme: PropTypes.any,
};

// ==========================================
// Public API
// ==========================================
export default Giu;
