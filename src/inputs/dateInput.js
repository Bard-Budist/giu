import React                from 'react';
import {
  omit, merge,
  set as timmSet,
  addDefaults,
}                           from 'timm';
import moment               from 'moment';
import {
  bindAll,
  cancelEvent,
}                           from '../gral/helpers';
import {
  COLORS, KEYS,
  IS_IOS,
}                           from '../gral/constants';
import {
  HIDDEN_FOCUS_CAPTURE,
  inputReset, INPUT_DISABLED,
}                           from '../gral/styles';
import {
  dateTimeFormat, dateTimeFormatNative,
  dateFormat,
  timeFormat,
  getUtcFlag,
  startOfDefaultDay,
}                           from '../gral/dates';
import { isDate }           from '../gral/validators';
import input                from '../hocs/input';
import {
  floatAdd,
  floatDelete,
  floatUpdate,
  warnFloats,
}                           from '../components/floats';
import {
  DateTimePicker,
  TRAPPED_KEYS,
}                           from '../inputs/dateTimePicker';

// External value: `Date?`
// Internal value: `String` (introduced by the user, copied & pasted, via dropdown...)
// External<->internal conversion uses props, since there are a number of cases
const NULL_VALUE = '';
function toInternalValue(extDate, props) {
  if (extDate == null) return NULL_VALUE;
  const { type, date, time, seconds, utc } = props;
  const mom = moment(extDate);
  if (getUtcFlag(date, time, utc)) mom.utc();
  const fmt = type === 'native'
    ? dateTimeFormatNative(date, time)
    : dateTimeFormat(date, time, seconds);
  return mom.format(fmt);
}
function toExternalValue(str, props) {
  const mom = displayToMoment(str, props);
  return mom !== null ? mom.toDate() : null;
}
function isNull(val) { return val === NULL_VALUE; }

function momentToDisplay(mom, props) {
  if (mom == null) return NULL_VALUE;
  const { type, date, time, seconds } = props;
  const fmt = type === 'native'
    ? dateTimeFormatNative(date, time)
    : dateTimeFormat(date, time, seconds);
  return mom.format(fmt);
}
function displayToMoment(str, props) {
  if (str === NULL_VALUE) return null;
  const { type, date, time, utc } = props;
  const fUtc = getUtcFlag(date, time, utc);
  let mom;
  if (!date) {
    // Add missing date info
    mom = startOfDefaultDay(fUtc);
    mom.add(moment.duration(str));
  } else {
    // Parse string, including seconds (even if props.seconds may be false)
    let fmt;
    if (type === 'native') {
      fmt = undefined; // automatic format detection for native HTML inputs
    } else {
      fmt = date && time
        ? `${dateFormat()} ${timeFormat(true)}`
        : dateFormat();
    }
    const fnMoment = fUtc ? moment.utc : moment;
    mom = fnMoment(str, fmt);
  }
  return mom.isValid() ? mom : null;
}

// ==========================================
// Wrapper
// ==========================================
// -- Props:
// --
// -- * **type** *string(`native` | `onlyField` | `inlinePicker` | `dropDownPicker`)? =
// --   `dropDownPicker`*
// -- * **nativeOnIos** *boolean? = true*: whether the custom DateInput should be
// --   replaced by a native one in iOS
// -- * **placeholder** *string?*: when unspecified, the expected date/time
// --   format will be used
// -- * **date** *boolean? = true*: whether the date is part of the value
// -- * **time** *boolean?*: whether the time is part of the value
// -- * **analogTime** *boolean? = true*: whether the time picker should be
// --   analogue (traditional clock) or digital (list)
// -- * **seconds** *boolean?*: whether seconds should be included in the time value
// -- * **utc** *boolean?*: by default, it is `true` *unless* `date` and `time` are both `true`.
// --   In other words, local time is only used by default if both `date` and `time` are enabled
// -- * **todayName** *string? = 'Today'*: label for the *Today* button
// -- * **lang** *string?*: the current language. Use it to inform Giu that
// --   you have changed moment's language, so that it updates the string representation of
// --   the current value accordingly and re-renders the component.
// --   Note: **you still must configure moment() yourself**
// -- * **style** *object?*: merged with the `input` style
// -- * **styleOuter** *object?*: when `type === 'inlinePicker'`,
// --   merged with the outermost `span` style
// -- * **accentColor** *string?*: CSS color descriptor (e.g. `darkgray`, `#ccffaa`...)
const DEFAULT_PROPS = {
  type:                   'dropDownPicker',
  nativeOnIos:            true,
  date:                   true,
  time:                   false,
  analogTime:             true,
  seconds:                false,
  todayName:              'Today',
  accentColor:            COLORS.accent,
};

const DateInputWrapper = props0 => {
  let props = addDefaults(props0, DEFAULT_PROPS);
  if (IS_IOS && props.nativeOnIos) {
    if (props.type === 'dropDownPicker') props = timmSet(props, 'type', 'native');
    props = timmSet(props, 'analogTime', false);
  }
  props = omit(props, ['nativeOnIos']);
  return <DateInput {...props} />;
};

DateInputWrapper.propTypes = {
  type:                     React.PropTypes.oneOf([
    'native',
    'onlyField',
    'inlinePicker',
    'dropDownPicker',
  ]),
  nativeOnIos:              React.PropTypes.bool,
};

// ==========================================
// Component
// ==========================================
class BaseDateInput extends React.Component {
  static propTypes = {
    type:                   React.PropTypes.oneOf([
      'native',
      'onlyField',
      'inlinePicker',
      'dropDownPicker',
    ]),
    nativeOnIos:            React.PropTypes.bool,
    disabled:               React.PropTypes.bool,
    placeholder:            React.PropTypes.string,
    date:                   React.PropTypes.bool,
    time:                   React.PropTypes.bool,
    analogTime:             React.PropTypes.bool,
    seconds:                React.PropTypes.bool,
    utc:                    React.PropTypes.bool,
    todayName:              React.PropTypes.string,
    lang:                   React.PropTypes.string,
    floatPosition:          React.PropTypes.string,
    floatAlign:             React.PropTypes.string,
    floatZ:                 React.PropTypes.number,
    style:                  React.PropTypes.object,
    styleOuter:             React.PropTypes.object,
    accentColor:            React.PropTypes.string,
    // From input HOC
    curValue:               React.PropTypes.string.isRequired,
    errors:                 React.PropTypes.array.isRequired,
    registerOuterRef:       React.PropTypes.func.isRequired,
    registerFocusableRef:   React.PropTypes.func.isRequired,
    fFocused:               React.PropTypes.bool.isRequired,
    onFocus:                React.PropTypes.func.isRequired,
    onBlur:                 React.PropTypes.func.isRequired,
    onChange:               React.PropTypes.func.isRequired,
    // all others are passed through unchanged
  };

  constructor(props) {
    super(props);
    this.state = { fFloat: false };
    this.cmdsToPicker = null;
    this.keyDown = undefined;
    this.lastExtValue = toExternalValue(props.curValue, props);
    bindAll(this, [
      'registerInputRef',
      'onMouseDown',
      'onFocus',
      'onBlur',
      'onKeyDown',
      'onChangePicker',
    ]);
  }

  componentDidMount() {
    if (this.props.type === 'dropDownPicker') {
      warnFloats(this.constructor.name);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.curValue !== this.props.curValue) {
      this.lastExtValue = toExternalValue(nextProps.curValue, nextProps);
    }
  }

  componentDidUpdate(prevProps) {
    this.renderFloat();
    const { lang, onChange } = this.props;

    // When the external language changes, we must update the internal value (a string)
    // to reflect the new date format
    if (prevProps.lang !== lang && this.lastExtValue != null) {
      onChange(
        null,
        toInternalValue(this.lastExtValue, this.props),
        { fDontFocus: true },
      );
    }
  }
  componentWillUnmount() { floatDelete(this.floatId); }

  // ==========================================
  // Render
  // ==========================================
  render() {
    const { type } = this.props;
    let out;
    if (type === 'native') {
      out = this.renderNativeField();
    } else if (type === 'inlinePicker') {
      out = (
        <span
          className="giu-date-input giu-date-input-inline-picker"
          style={this.props.styleOuter}
        >
          {this.renderField(true)}
          {this.renderPicker(true)}
        </span>
      );
    } else {
      out = this.renderField();
    }
    return out;
  }

  renderNativeField() {
    const {
      curValue, onChange, placeholder,
      date, time,
      disabled,
    } = this.props;
    const otherProps = omit(this.props, PROP_KEYS);
    let htmlInputType;
    if (date && time) {
      htmlInputType = 'datetime-local';
    } else if (date) {
      htmlInputType = 'date';
    } else {
      htmlInputType = 'time';
    }
    return (
      <input ref={this.registerInputRef}
        className="giu-date-input"
        type={htmlInputType}
        value={curValue}
        {...otherProps}
        placeholder={placeholder || dateTimeFormatNative(date, time)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChange={onChange}
        tabIndex={disabled ? -1 : undefined}
        style={style.field(this.props)}
      />
    );
  }

  renderField(fHidden) {
    const {
      curValue, onChange, placeholder,
      date, time, seconds,
      disabled,
      onCopy, onCut, onPaste,
    } = this.props;
    const otherProps = omit(this.props, PROP_KEYS);
    return (
      <input ref={this.registerInputRef}
        className={fHidden ? undefined : 'giu-date-input'}
        type="text"
        value={curValue}
        {...otherProps}
        placeholder={placeholder || dateTimeFormat(date, time, seconds)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onCopy={fHidden ? onCopy : undefined}
        onCut={fHidden ? onCut : undefined}
        onPaste={fHidden ? onPaste : undefined}
        onChange={onChange}
        onKeyDown={this.onKeyDown}
        tabIndex={disabled ? -1 : undefined}
        style={fHidden ? style.fieldHidden : style.field(this.props)}
      />
    );
  }

  renderFloat() {
    if (this.props.type !== 'dropDownPicker') return;
    const { fFloat } = this.state;

    // Remove float
    if (!fFloat && this.floatId != null) {
      floatDelete(this.floatId);
      this.floatId = null;
      return;
    }

    // Create or update float
    if (fFloat) {
      const { floatZ, floatPosition, floatAlign } = this.props;
      const floatOptions = {
        position: floatPosition,
        align: floatAlign,
        zIndex: floatZ,
        getAnchorNode: () => this.refInput,
        children: this.renderPicker(),
      };
      if (this.floatId == null) {
        this.floatId = floatAdd(floatOptions);
      } else {
        floatUpdate(this.floatId, floatOptions);
      }
    }
  }

  renderPicker(fInline) {
    const {
      type,
      curValue,
      disabled, fFocused,
      date, time, analogTime, seconds, utc,
      todayName,
      accentColor,
    } = this.props;
    const mom = displayToMoment(curValue, this.props);
    const registerOuterRef = type === 'inlinePicker'
      ? this.props.registerOuterRef
      : undefined;
    return (
      <DateTimePicker
        registerOuterRef={registerOuterRef}
        disabled={disabled}
        fFocused={fInline && fFocused}
        curValue={mom}
        onMouseDown={this.onMouseDown}
        onChange={this.onChangePicker}
        date={date}
        time={time}
        analogTime={analogTime}
        seconds={seconds}
        utc={utc}
        todayName={todayName}
        cmds={this.cmdsToPicker}
        keyDown={this.keyDown}
        accentColor={accentColor}
      />
    );
  }

  // ==========================================
  // Handlers
  // ==========================================
  registerInputRef(c) {
    this.refInput = c;
    this.props.registerFocusableRef(c);
  }

  onMouseDown(ev) {
    cancelEvent(ev);
    if (!this.props.fFocused && !IS_IOS) this.refInput.focus();
  }

  onFocus(ev) {
    this.setState({ fFloat: true });
    this.props.onFocus(ev);
  }

  onBlur(ev) {
    this.setState({ fFloat: false });
    this.props.onBlur(ev);
  }

  onKeyDown(ev) {
    const { type } = this.props;
    if (type === 'onlyField') return;
    const { which } = ev;
    const { fFloat } = this.state;
    if (which === KEYS.esc) {
      cancelEvent(ev);
      this.setState({ fFloat: !fFloat });
      this.keyDown = undefined;
      return;
    }

    if ((fFloat || type === 'inlinePicker') &&
        TRAPPED_KEYS.indexOf(which) >= 0) {
      cancelEvent(ev);
      const { keyCode, metaKey, shiftKey, altKey, ctrlKey } = ev;
      this.keyDown = { which, keyCode, metaKey, shiftKey, altKey, ctrlKey };
      this.forceUpdate();
    }
  }

  onChangePicker(ev, nextValue) {
    this.props.onChange(
      ev,
      momentToDisplay(nextValue, this.props),
      { fDontFocus: IS_IOS },
    );
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outerInline: undefined,
  fieldBase: inputReset(),
  field: ({ style: styleField, disabled }) => {
    let out = style.fieldBase;
    if (disabled) out = merge(out, INPUT_DISABLED);
    out = merge(out, styleField);
    return out;
  },
  fieldHidden: HIDDEN_FOCUS_CAPTURE,
};

// ==========================================
// Miscellaneous
// ==========================================
const PROP_KEYS = Object.keys(BaseDateInput.propTypes);

// ==========================================
// Public API
// ==========================================
const DateInput = input(BaseDateInput, {
  toInternalValue, toExternalValue, isNull,
  defaultValidators: { isDate: isDate() },
  validatorContext: { moment },
  fIncludeClipboardProps: true,
});

export default DateInputWrapper;
