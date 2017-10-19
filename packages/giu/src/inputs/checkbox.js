// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'timm';
import input, { INPUT_HOC_INVALID_HTML_PROPS } from '../hocs/input';

const toInternalValue = val => (val != null ? val : false);
const toExternalValue = val => val;
const isNull = val => val == null;

let cntId = 0;

// ==========================================
// Types
// ==========================================
// -- Props:
// -- START_DOCS
type PublicProps = {
  id?: string,
  label?: any, // React components to be included in the checkbox's `label` element
  disabled?: boolean,
  styleLabel?: Object, // merged with the `label` style
  skipTheme?: boolean,
  // all others are passed through to the `input` unchanged
};
// -- END_DOCS

const FILTERED_OUT_PROPS = [
  'id',
  'label',
  'disabled',
  'styleLabel',
  'skipTheme',
  ...INPUT_HOC_INVALID_HTML_PROPS,
];

type Props = {
  ...$Exact<PublicProps>,
  // Input HOC
  curValue: boolean,
  registerOuterRef: Function,
  registerFocusableRef: Function,
};

// ==========================================
// Component
// ==========================================
class Checkbox extends React.Component {
  static defaultProps = {};
  props: Props;
  labelId: string;
  refCheckbox: ?Object;

  constructor(props: Props) {
    super(props);
    this.labelId = this.props.id || `giu-checkbox_${cntId}`;
    cntId += 1;
  }

  componentDidMount() {
    if (this.context.theme === 'mdl' && this.refCheckbox) {
      window.componentHandler.upgradeElement(this.refCheckbox);
    }
  }

  // ==========================================
  // Render
  // ==========================================
  render() {
    if (!this.props.skipTheme && this.context.theme === 'mdl') {
      return this.renderMdl();
    }
    return this.props.label
      ? this.renderWithLabel()
      : this.renderInput('giu-checkbox');
  }

  renderWithLabel() {
    const { label, registerOuterRef, styleLabel } = this.props;
    return (
      <span
        ref={registerOuterRef}
        className="giu-checkbox"
        style={style.wrapper}
      >
        {this.renderInput()}
        <label htmlFor={this.labelId} style={styleLabel}>
          {label}
        </label>
      </span>
    );
  }

  renderInput(className?: string) {
    const { curValue, disabled, registerFocusableRef } = this.props;
    const inputProps = omit(this.props, FILTERED_OUT_PROPS);
    return (
      <input
        ref={registerFocusableRef}
        id={this.labelId}
        className={className}
        type="checkbox"
        checked={curValue}
        tabIndex={disabled ? -1 : undefined}
        {...inputProps}
        disabled={disabled}
      />
    );
  }

  renderMdl() {
    const inputProps = omit(this.props, FILTERED_OUT_PROPS);
    return (
      <label
        ref={this.registerOuterRefMdl}
        className="mdl-switch mdl-js-switch mdl-js-ripple-effect"
        htmlFor={this.labelId}
        style={style.wrapperMdl}
      >
        <input
          ref={this.props.registerFocusableRef}
          id={this.labelId}
          className="mdl-switch__input"
          type="checkbox"
          checked={this.props.curValue}
          {...inputProps}
          disabled={this.props.disabled}
        />
        <span className="mdl-switch__label" style={style.labelMdl(this.props)}>
          {this.props.label}
        </span>
      </label>
    );
  }

  // ==========================================
  registerOuterRefMdl = c => {
    this.refCheckbox = c;
    const { registerOuterRef } = this.props;
    if (registerOuterRef) registerOuterRef(c);
  };
}

Checkbox.contextTypes = { theme: PropTypes.any };

// ==========================================
// Styles
// ==========================================
const style = {
  wrapper: {
    whiteSpace: 'nowrap',
  },
  wrapperMdl: {
    whiteSpace: 'nowrap',
    width: 'initial',
    marginRight: 10,
  },
  labelMdl: ({ styleLabel }) => ({
    left: 16,
    ...styleLabel,
  }),
};

// ==========================================
// Public API
// ==========================================
export default input(Checkbox, {
  toInternalValue,
  toExternalValue,
  isNull,
  valueAttr: 'checked',
});
