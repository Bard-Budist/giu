import React                from 'react';
import { omit }             from 'timm';
import input                from '../hocs/input';

function toInternalValue(val) { return val != null ? val : false; }
function toExternalValue(val) { return val; }
function isNull(val) { return val == null; }

let cntId = 0;

// ==========================================
// Component
// ==========================================
// -- * **label** *string?*: gets converted to a `label` element
// -- * **styleLabel** *object?*: merged with the `label` style
class Checkbox extends React.Component {
  static propTypes = {
    id:                     React.PropTypes.string,
    label:                  React.PropTypes.string,
    disabled:               React.PropTypes.bool,
    styleLabel:             React.PropTypes.object,
    // Input HOC
    curValue:               React.PropTypes.bool.isRequired,
    registerOuterRef:       React.PropTypes.func.isRequired,
    registerFocusableRef:   React.PropTypes.func.isRequired,
    // all others are passed through to the `input` unchanged
  };

  constructor(props) {
    super(props);
    this.labelId = this.props.id || `giu-checkbox_${cntId++}`;
  }

  // ==========================================
  // Render
  // ==========================================
  render() {
    return this.props.label
      ? this.renderWithLabel()
      : this.renderInput('giu-checkbox');
  }

  renderWithLabel() {
    const { label, registerOuterRef, styleLabel } = this.props;
    return (
      <span ref={registerOuterRef}
        className="giu-checkbox"
        style={style.wrapper}
      >
        {this.renderInput()}
        <label htmlFor={this.labelId} style={styleLabel}>{label}</label>
      </span>
    );
  }

  renderInput(className) {
    const { curValue, disabled, registerFocusableRef } = this.props;
    const inputProps = omit(this.props, PROP_KEYS);
    return (
      <input ref={registerFocusableRef}
        id={this.labelId} className={className}
        type="checkbox"
        checked={curValue}
        tabIndex={disabled ? -1 : undefined}
        {...inputProps}
      />
    );
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  wrapper: {
    whiteSpace: 'nowrap',
  },
};

// ==========================================
// Miscellaneous
// ==========================================
const PROP_KEYS = Object.keys(Checkbox.propTypes);

// ==========================================
// Public API
// ==========================================
export default input(Checkbox, {
  toInternalValue, toExternalValue, isNull,
  valueAttr: 'checked',
});
