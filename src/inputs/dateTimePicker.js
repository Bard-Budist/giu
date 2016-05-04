import React                from 'react';
import PureRenderMixin      from 'react-addons-pure-render-mixin';
import { merge }            from 'timm';
import moment               from 'moment';
import {
  bindAll,
  cancelEvent,
}                           from '../gral/helpers';
import { getTimeInSecs }    from '../gral/dates';
import {
  flexContainer,
}                           from '../gral/styles';
import { scrollIntoView }   from '../gral/visibility';
import { COLORS, KEYS }     from '../gral/constants';
import input                from '../hocs/input';
import FocusCapture         from '../components/focusCapture';
import DatePicker           from '../inputs/datePicker';
import TimePickerDigital    from '../inputs/timePickerDigital';

const TRAPPED_KEYS = [
  KEYS.home, KEYS.end,
  KEYS.up, KEYS.down, KEYS.left, KEYS.right,
  KEYS.pageUp, KEYS.pageDown,
  KEYS.backspace, KEYS.del,
];

const DEFAULT_DAY = moment('1977-11-02T00:00:00Z');

function toInternalValue(val) { return val != null ? moment(val) : null; }
function toExternalValue(val) { return val != null ? val.clone().toDate() : null; }

// ==========================================
// Component
// ==========================================
class DateTimePicker extends React.Component {
  static propTypes = {
    disabled:               React.PropTypes.bool,
    focusable:              React.PropTypes.bool,
    date:                   React.PropTypes.bool,
    time:                   React.PropTypes.bool,
    analogTime:             React.PropTypes.bool,
    seconds:                React.PropTypes.bool,
    utc:                    React.PropTypes.bool,
    lang:                   React.PropTypes.string, // bcp47
    todayName:              React.PropTypes.string,
    onKeyDown:              React.PropTypes.func,
    cmds:                   React.PropTypes.array,
    style:                  React.PropTypes.object,
    accentColor:            React.PropTypes.string,
    // Input HOC
    curValue:               React.PropTypes.object,   // a moment object
    onChange:               React.PropTypes.func.isRequired,
    registerFocusableRef:   React.PropTypes.func.isRequired,
    fFocused:               React.PropTypes.bool.isRequired,
    onFocus:                React.PropTypes.func.isRequired,
    onBlur:                 React.PropTypes.func.isRequired,
  };
  static defaultProps = {
    focusable:              true,
    date:                   true,
    time:                   false,
    analogTime:             true,
    seconds:                false,
    todayName:              'Today',
    accentColor:            COLORS.accent,
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      cmdRouting: props.date ? 'date' : 'time',
    };
    bindAll(this, [
      'registerInputRef',
      'onMouseDown',
      'onKeyDown',
      'onFocus',
      'onChange',
    ]);
  }

  componentWillMount() {
    const { utc, date, time } = this.props;
    this.utc = utc != null ? utc : !(date && time);
    this.cmdsToPickers = [];
  }

  // ==========================================
  // Render
  // ==========================================
  render() {
    const { curValue, style: baseStyle } = this.props;
    if (curValue != null && this.utc) curValue.utc();
    return (
      <div ref={c => { this.refOuter = c; }}
        className="giu-date-time-picker"
        style={merge(style.outer(this.props), baseStyle)}
        onMouseDown={this.onMouseDown}
      >
        {this.renderFocusCapture()}
        {this.renderDate()}
        {this.renderSeparator()}
        {this.renderTime()}
      </div>
    );
  }

  renderFocusCapture() {
    const { focusable, onBlur } = this.props;
    if (!focusable) return null;
    return (
      <FocusCapture
        registerRef={this.registerInputRef}
        onFocus={this.onFocus}
        onBlur={onBlur}
        onKeyDown={this.onKeyDown}
      />
    );
  }

  renderDate() {
    const {
      curValue,
      focusable,
      date,
      lang,
      todayName,
      accentColor,
    } = this.props;
    if (!date) return null;
    let cmds;
    if (this.state.cmdRouting === 'date') {
      cmds = focusable ? this.cmdsToPickers : this.props.cmds;
    }
    return (
      <DatePicker
        curValue={curValue}
        onChange={this.onChange('date')}
        utc={this.utc}
        lang={lang}
        todayName={todayName}
        cmds={cmds}
        accentColor={accentColor}
      />
    );
  }

  renderSeparator() {
    const { date, time } = this.props;
    if (!date || !time) return null;
    return <div style={style.separator} />;
  }

  renderTime() {
    const {
      curValue,
      focusable,
      time, analogTime,
      accentColor,
    } = this.props;
    if (!time) return null;
    let cmds;
    if (this.state.cmdRouting === 'time') {
      cmds = focusable ? this.cmdsToPickers : this.props.cmds;
    }
    let out;
    if (analogTime) {
      out = null;
    } else {
      out = (
        <TimePickerDigital
          curValue={curValue}
          onChange={this.onChange('time')}
          utc={this.utc}
          cmds={cmds}
          accentColor={accentColor}
        />
      );
    }
    return out;
  }

  // ==========================================
  // Event handlers
  // ==========================================
  registerInputRef(c) {
    this.refInput = c;
    this.props.registerFocusableRef(c);
  }

  onMouseDown(ev) {
    cancelEvent(ev);
    if (this.props.focusable && this.refInput) this.refInput.focus();
  }

  onFocus(ev) {
    scrollIntoView(this.refOuter);
    this.props.onFocus(ev);
  }

  // Keystrokes from FocusCapture
  onKeyDown(ev) {
    if (TRAPPED_KEYS.indexOf(ev.which) >= 0) {
      cancelEvent(ev);
      this.cmdsToPickers = [{ type: 'KEY_DOWN', which: ev.which }];
      this.forceUpdate();
    }
  }

  onChange(cmdRouting) {
    return (ev, nextValue0) => {
      const { date, time } = this.props;
      let nextValue = nextValue0;
      if (nextValue != null && !(date && time)) {
        if (!time) {
          nextValue = nextValue.clone().startOf('day');
        }
        if (!date) {
          nextValue = DEFAULT_DAY.clone();
          if (this.utc) nextValue.utc();
          nextValue.add(moment.duration(getTimeInSecs(nextValue0), 'seconds'));
        }
      }
      this.props.onChange(ev, nextValue);
      this.redirectCommands(cmdRouting);
    };
  }

  redirectCommands(cmdRouting) {
    if (cmdRouting === this.state.cmdRouting) return;
    this.cmdsToPickers = [];
    this.setState({ cmdRouting });
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: ({ fFocused }) => {
    const out = flexContainer('row', {
      paddingTop: 3,
      paddingBottom: 3,
      overflowY: 'auto',
      border: `1px solid ${COLORS.line}`,
    });
    if (fFocused) {
      out.boxShadow = COLORS.focusGlow;
      out.border = `1px solid ${COLORS.focus}`;
    }
    return out;
  },
  separator: {
    marginLeft: 4,
    marginRight: 2,
    width: 1,
    borderRight: `1px solid ${COLORS.line}`,
  },
};

// ==========================================
// Public API
// ==========================================
export default input(DateTimePicker, { toInternalValue, toExternalValue });
