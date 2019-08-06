// @flow

import React from 'react';
import { omit, merge, set as timmSet, addDefaults } from 'timm';
import moment from '../vendor/moment';
import { cancelEvent, stopPropagation } from '../gral/helpers';
import { KEYS, IS_IOS, IS_MOBILE_OR_TABLET } from '../gral/constants';
import {
  HIDDEN_FOCUS_CAPTURE,
  HIDDEN_FOCUS_CAPTURE_IOS,
  inputReset,
  INPUT_DISABLED,
} from '../gral/styles';
import {
  dateTimeFormat,
  dateTimeFormatNative,
  dateFormat,
  timeFormat,
  getUtcFlag,
  startOfDefaultDay,
} from '../gral/dates';
import type { Moment } from '../gral/types';
import { isDate } from '../gral/validators';
import type { Theme } from '../gral/themeContext';
import Input, { INPUT_HOC_INVALID_HTML_PROPS } from '../hocs/input';
import type { InputHocPublicProps } from '../hocs/input';
import { floatAdd, floatDelete, floatUpdate } from '../components/floats';
import type { FloatPosition, FloatAlign } from '../components/floats';
import { DateTimePicker, TRAPPED_KEYS } from './dateTimePicker';
import IosFloatWrapper from './iosFloatWrapper';

// External value: `Date?`
// Internal value: `String` (introduced by the user, copied & pasted, via dropdown...)
// External<->internal conversion uses props, since there are a number of cases
const NULL_VALUE = '';
const toInternalValue = (extDate, props) => {
  if (extDate == null) return NULL_VALUE;
  const { type, date, time, seconds, utc } = props;
  const mom = moment(extDate);
  if (getUtcFlag(date, time, utc)) mom.utc();
  const fmt =
    type === 'native'
      ? dateTimeFormatNative(date, time)
      : dateTimeFormat(date, time, seconds);
  return mom.format(fmt);
};
const toExternalValue = (str, props) => {
  const mom = displayToMoment(str, props);
  return mom !== null ? mom.toDate() : null;
};
const isNull = val => val === NULL_VALUE;

const momentToDisplay = (mom, props) => {
  if (mom == null) return NULL_VALUE;
  const { type, date, time, seconds } = props;
  const fmt =
    type === 'native'
      ? dateTimeFormatNative(date, time)
      : dateTimeFormat(date, time, seconds);
  return mom.format(fmt);
};
const displayToMoment = (str, props) => {
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
      fmt = date && time ? `${dateFormat()} ${timeFormat(true)}` : dateFormat();
    }
    const fnMoment = fUtc ? moment.utc : moment;
    mom = fnMoment(str, fmt);
  }
  return mom.isValid() ? mom : null;
};

const MANAGE_FOCUS_AUTONOMOUSLY = IS_MOBILE_OR_TABLET;

// ==========================================
// DateInput
// ==========================================
//------------------------------------------
// Declarations
//------------------------------------------
// -- Props:
// -- START_DOCS
type PublicProps = {
  ...$Exact<InputHocPublicProps>, // common to all inputs (check the docs!)
  id?: string,
  type?: PickerType, // see below (default: 'dropDownPicker')
  // Whether Giu should check for iOS in order to simplify certain components
  // (e.g. do not use analogue time picker) -- default: true
  checkIos?: boolean,
  disabled?: boolean,
  placeholder?: string, // when unspecified, the expected date/time format will be used
  date?: boolean, // whether the date is part of the value (default: true)
  time?: boolean, // whether the time is part of the value (default: false)
  // Whether the time picker should be analogue (traditional clock)
  // or digital (list) (default: true)
  analogTime?: boolean, // (default: true [in iOS: false])
  seconds?: boolean, // whether seconds should be included in the time value (default: false)
  // UTC mode; by default, it is `true` *unless* `date` and `time` are both `true`.
  // In other words, local time is only used by default if both `date` and `time` are enabled
  utc?: boolean, // (default: !(date && time))
  todayName?: string, // label for the *Today* button (default: 'Today')
  // Current language (used just for force-render).
  // Use it to inform Giu that you have changed `moment`'s language.
  lang?: string,
  floatPosition?: FloatPosition,
  floatAlign?: FloatAlign,
  style?: Object, // merged with the `input` style
  styleOuter?: Object, // when `type === 'inlinePicker'`, merged with the outermost `span` style
  skipTheme?: boolean,
  // all others are passed through to the `input` unchanged
};

type PickerType = 'native' | 'onlyField' | 'inlinePicker' | 'dropDownPicker';
// -- END_DOCS

const DEFAULT_PROPS = {
  type: 'dropDownPicker',
  checkIos: true,
  date: true,
  time: false,
  analogTime: true,
  seconds: false,
  todayName: 'Today',
};

type DefaultProps = {
  type: PickerType,
  date: boolean,
  time: boolean,
  analogTime: boolean,
  seconds: boolean,
  todayName: string,
};

type Props = {
  ...$Exact<PublicProps>,
  ...$Exact<DefaultProps>,
  // Input HOC
  theme: Theme,
  curValue: string,
  errors: Array<string>,
  registerOuterRef: Function,
  registerFocusableRef: Function,
  fFocused: boolean,
  onFocus: Function,
  onBlur: Function,
  onChange: Function,
  onCopy: Function,
  onCut: Function,
  onPaste: Function,
};

type State = {
  fFloat: boolean,
};

const FILTERED_OUT_PROPS = [
  'type',
  'disabled',
  'placeholder',
  'date',
  'time',
  'analogTime',
  'seconds',
  'utc',
  'todayName',
  'lang',
  'floatPosition',
  'floatAlign',
  'style',
  'styleOuter',
  'skipTheme',
  'accentColor',
  ...INPUT_HOC_INVALID_HTML_PROPS,
  'required',
  'theme',
];

const FILTERED_OUT_PROPS_MDL = FILTERED_OUT_PROPS.concat(['placeholder']);

//------------------------------------------
// Component
//------------------------------------------
class BaseDateInput extends React.Component<Props, State> {
  lastExtValue: ?Moment;
  floatId: ?string;
  refInput: ?Object;

  state = { fFloat: false };
  refPicker: any = React.createRef();
  refMdl: any = React.createRef();

  constructor(props: Props) {
    super(props);
    this.lastExtValue = toExternalValue(props.curValue, props);
  }

  componentDidMount() {
    if (this.props.theme.id === 'mdl' && this.refMdl.current)
      window.componentHandler.upgradeElement(this.refMdl.current);
  }

  componentWillUnmount() {
    if (this.floatId != null) floatDelete(this.floatId);
  }

  componentDidUpdate(prevProps) {
    this.renderFloat();

    // When the external language changes, we must update the internal value (a string)
    // to reflect the new date format
    const { lang, onChange, curValue } = this.props;
    if (curValue !== prevProps.curValue) {
      this.lastExtValue = toExternalValue(curValue, this.props);
    }
    if (lang !== prevProps.lang && this.lastExtValue != null) {
      onChange(null, toInternalValue(this.lastExtValue, this.props), {
        fDontFocus: true,
      });
    }
  }

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
          style={style.outerInline(this.props)}
        >
          {MANAGE_FOCUS_AUTONOMOUSLY ? null : this.renderField(true)}
          {this.renderPicker(true)}
        </span>
      );
    } else {
      // 'only-field' || 'dropDownPicker'
      const elField = this.renderField();
      if (IS_IOS && type === 'dropDownPicker') {
        out = (
          <span style={style.wrapperForIos}>
            {elField}
            {this.renderFloatForIos()}
          </span>
        );
      } else {
        out = elField;
      }
    }
    return out;
  }

  renderNativeField() {
    const { placeholder, date, time } = this.props;
    const otherProps = omit(this.props, FILTERED_OUT_PROPS);
    let htmlInputType;
    if (date && time) {
      htmlInputType = 'datetime-local';
    } else if (date) {
      htmlInputType = 'date';
    } else {
      htmlInputType = 'time';
    }
    return (
      <input
        ref={this.registerInputRef}
        className="giu-date-input"
        type={htmlInputType}
        value={this.props.curValue}
        {...otherProps}
        placeholder={placeholder || dateTimeFormatNative(date, time)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChange={this.props.onChange}
        tabIndex={this.props.disabled ? -1 : undefined}
        style={style.field(this.props)}
      />
    );
  }

  renderField(fHidden) {
    if (!fHidden && !this.props.skipTheme && this.props.theme.id === 'mdl') {
      return this.renderFieldMdl();
    }
    const { placeholder, date, time, seconds } = this.props;
    const otherProps = omit(this.props, FILTERED_OUT_PROPS);
    return (
      <input
        ref={this.registerInputRef}
        className={fHidden ? undefined : 'giu-date-input'}
        type="text"
        value={this.props.curValue}
        {...otherProps}
        placeholder={placeholder || dateTimeFormat(date, time, seconds)}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onCopy={fHidden ? this.props.onCopy : undefined}
        onCut={fHidden ? this.props.onCut : undefined}
        onPaste={fHidden ? this.props.onPaste : undefined}
        onChange={this.props.onChange}
        onKeyDown={this.onKeyDown}
        tabIndex={this.props.disabled ? -1 : undefined}
        style={fHidden ? style.fieldHidden : style.field(this.props)}
      />
    );
  }

  renderFieldMdl() {
    const {
      id,
      curValue,
      placeholder,
      date,
      time,
      seconds,
      fFocused,
    } = this.props;
    const otherProps = omit(this.props, FILTERED_OUT_PROPS_MDL);
    let className =
      'giu-date-input mdl-textfield mdl-js-textfield mdl-textfield--floating-label';
    if (curValue !== '' || fFocused) className += ' is-dirty';
    return (
      <div
        ref={this.refMdl}
        className={className}
        style={style.mdlField(this.props)}
      >
        <input
          ref={this.registerInputRef}
          className="mdl-textfield__input"
          type="text"
          value={curValue}
          id={id}
          {...otherProps}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.props.onChange}
          onKeyDown={this.onKeyDown}
          tabIndex={this.props.disabled ? -1 : undefined}
        />
        <label className="mdl-textfield__label" htmlFor={id}>
          {placeholder || dateTimeFormat(date, time, seconds)}
        </label>
      </div>
    );
  }

  renderFloat() {
    if (this.props.type !== 'dropDownPicker') return;
    if (IS_IOS) return;
    const { fFloat } = this.state;

    // Remove float
    if (!fFloat && this.floatId != null) {
      floatDelete(this.floatId);
      this.floatId = null;
      return;
    }

    // Create or update float
    if (fFloat) {
      const { floatPosition, floatAlign } = this.props;
      const floatOptions = {
        position: floatPosition,
        align: floatAlign,
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

  renderFloatForIos() {
    if (!this.state.fFloat) return null;
    return (
      <IosFloatWrapper
        floatPosition={this.props.floatPosition}
        floatAlign={this.props.floatAlign}
      >
        {this.renderPicker(false)}
      </IosFloatWrapper>
    );
  }

  renderPicker(fInline) {
    const mom = displayToMoment(this.props.curValue, this.props);
    const { type } = this.props;
    const registerOuterRef =
      type === 'inlinePicker' ? this.props.registerOuterRef : undefined;
    return (
      <DateTimePicker
        ref={this.refPicker}
        registerOuterRef={registerOuterRef}
        disabled={!!this.props.disabled}
        fFocused={fInline && this.props.fFocused}
        curValue={mom}
        onMouseDown={this.onMouseDown}
        onClick={this.onClick}
        onChange={this.onChangePicker}
        date={this.props.date}
        time={this.props.time}
        analogTime={this.props.analogTime}
        seconds={this.props.seconds}
        utc={getUtcFlag(this.props.date, this.props.time, this.props.utc)}
        todayName={this.props.todayName}
        accentColor={this.props.theme.accentColor}
      />
    );
  }

  // ==========================================
  registerInputRef = c => {
    this.refInput = c;
    this.props.registerFocusableRef(c);
  };

  onMouseDown = ev => {
    cancelEvent(ev);
    if (!this.props.fFocused && this.refInput) this.refInput.focus();
  };

  // Cancel bubbling of click events; they may reach Modals
  // on their way up and cause the element to blur.
  // Allow free propagation if the element is disabled.
  onClick = ev => {
    if (!this.props.disabled) stopPropagation(ev);
  };

  onFocus = ev => {
    this.setState({ fFloat: true });
    this.props.onFocus(ev);
  };

  onBlur = ev => {
    this.setState({ fFloat: false });
    this.props.onBlur(ev);
  };

  onKeyDown = ev => {
    const { type } = this.props;
    if (type === 'onlyField') return;
    const { which } = ev;
    const { fFloat } = this.state;
    if (which === KEYS.esc) {
      cancelEvent(ev);
      this.setState({ fFloat: !fFloat });
      return;
    }

    if (
      (fFloat || type === 'inlinePicker') &&
      TRAPPED_KEYS.indexOf(which) >= 0
    ) {
      cancelEvent(ev);
      const { keyCode, metaKey, shiftKey, altKey, ctrlKey } = ev;
      const keyDown = { which, keyCode, metaKey, shiftKey, altKey, ctrlKey };
      const target = this.refPicker.current;
      if (target && target.doKeyDown) target.doKeyDown(keyDown);
    }
  };

  onChangePicker = (ev, nextValue) => {
    this.props.onChange(ev, momentToDisplay(nextValue, this.props));
  };
}

// ==========================================
const hocOptions = {
  componentName: 'DateInput',
  toInternalValue,
  toExternalValue,
  isNull,
  defaultValidators: { isDate: isDate() },
  validatorContext: { moment },
  fIncludeClipboardProps: true,
};
const render = (props, ref) => <BaseDateInput {...props} ref={ref} />;
// $FlowFixMe
const DateInput = React.forwardRef((publicProps: PublicProps, ref) => {
  let props = addDefaults(publicProps, DEFAULT_PROPS);
  if (IS_IOS && props.checkIos) props = timmSet(props, 'analogTime', false);
  props = omit(props, ['checkIos']);
  return <Input hocOptions={hocOptions} render={render} {...props} ref={ref} />;
});

// ==========================================
const style = {
  outerInline: ({ styleOuter }) => {
    let out = styleOuter;
    if (IS_IOS) out = timmSet(out, 'position', 'relative');
    return out;
  },
  fieldBase: inputReset(),
  field: ({ style: styleField, disabled }) => {
    let out = style.fieldBase;
    if (disabled) out = merge(out, INPUT_DISABLED);
    out = merge(out, styleField);
    return out;
  },
  mdlField: ({ style: styleField, disabled }) => {
    let out = { width: 150 };
    if (disabled)
      out = merge(out, { cursor: 'default', pointerEvents: 'none' });
    out = merge(out, styleField);
    return out;
  },
  fieldHidden: IS_IOS ? HIDDEN_FOCUS_CAPTURE_IOS : HIDDEN_FOCUS_CAPTURE,
  wrapperForIos: { position: 'relative' },
};

// ==========================================
// Public
// ==========================================
export default DateInput;
