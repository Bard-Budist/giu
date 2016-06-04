import React                from 'react';
import { merge, omit }      from 'timm';
import { IS_IOS }           from '../gral/constants';
import {
  HIDDEN_FOCUS_CAPTURE,
}                           from '../gral/styles';

// ==========================================
// Component
// ==========================================
class FocusCapture extends React.Component {
  static propTypes = {
    disabled:               React.PropTypes.bool,
    registerRef:            React.PropTypes.func,
  };

  render() {
    const { registerRef, disabled } = this.props;
    const otherProps = omit(this.props, PROP_KEYS);
    const el = (
      <input ref={registerRef}
        style={style.input}
        tabIndex={disabled ? -1 : undefined}
        {...otherProps}
      />
    );
    return IS_IOS ?
      <span style={style.iosWrapper}>{el}</span> :
      el;
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  input: IS_IOS ?
    merge(HIDDEN_FOCUS_CAPTURE, {
      position: 'absolute',
      top: 0,
      left: 0,
    }) :
    HIDDEN_FOCUS_CAPTURE,
  iosWrapper: {
    position: 'relative',
    opacity: 0,
  },
};

// ==========================================
// Miscellaneous
// ==========================================
const PROP_KEYS = Object.keys(FocusCapture.propTypes);

// ==========================================
// Public API
// ==========================================
export default FocusCapture;
