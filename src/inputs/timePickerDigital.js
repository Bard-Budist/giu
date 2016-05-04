import React                from 'react';
import moment               from 'moment';
import { bindAll }          from '../gral/helpers';
import {
  startOfToday,
  getTimeInSecs,
}                           from '../gral/dates';
import {
  getScrollbarWidth,
}                           from '../gral/constants';
import { ListPicker }       from '../inputs/listPicker';

const ROW_HEIGHT = '1.3em';

// ==========================================
// Component
// ==========================================
class TimePickerDigital extends React.Component {
  static propTypes = {
    curValue:               React.PropTypes.object,  // moment object, not start of day
    onChange:               React.PropTypes.func.isRequired,
    utc:                    React.PropTypes.bool.isRequired,
    cmds:                   React.PropTypes.array,
    stepMinutes:            React.PropTypes.number,
    accentColor:            React.PropTypes.string.isRequired,
  };
  static defaultProps = {
    stepMinutes:            30,
  };

  constructor(props) {
    super(props);
    bindAll(this, [
      'onChange',
    ]);
  }

  componentWillMount() { this.initTimeItems(); }

  // ==========================================
  // Render
  // ==========================================
  render() {
    const { cmds, accentColor } = this.props;
    return (
      <ListPicker
        items={this.timeItems}
        value={this.getSeconds()}
        onChange={this.onChange}
        focusable={false}
        cmds={cmds}
        style={style.outer} twoStageStyle
        styleItem={style.item}
        accentColor={accentColor}
      />
    );
  }


  // ==========================================
  // Event handlers
  // ==========================================
  onChange(ev, secs) {
    const { curValue, utc, onChange } = this.props;
    if (secs == null) {
      onChange(ev, null);
      return;
    }
    let nextValue;
    if (curValue != null) {
      nextValue = curValue.clone().startOf('day');
    } else {
      nextValue = startOfToday(utc);
    }
    nextValue.add(moment.duration(secs, 'seconds'));
    onChange(ev, nextValue);
  }

  // ==========================================
  // Helpers
  // ==========================================
  initTimeItems() {
    const { stepMinutes } = this.props;
    this.timeItems = [];
    const curTime = moment.utc('2013-04-27T00:00:00Z');
    const endTime = moment(curTime).add(1, 'day');
    while (curTime < endTime) {
      const label = curTime.format('HH:mm');
      const value = getTimeInSecs(curTime);
      this.timeItems.push({ label, value });
      curTime.add(stepMinutes, 'minutes');
    }
  }

  getSeconds() {
    const { curValue, stepMinutes } = this.props;
    let secs = getTimeInSecs(curValue);
    if (secs != null) {
      secs = Math.round(secs / 60 / stepMinutes) * stepMinutes * 60;
      if (secs === 24 * 3600) secs = secs - stepMinutes * 60;
    }
    return secs;
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: {
    marginTop: 3,
    marginBottom: 3,
    padding: 0,
    border: 'none',
    maxHeight: '12.5em',
  },
  item: {
    padding: `0px ${6 + getScrollbarWidth()}px 0px 6px`,
    height: ROW_HEIGHT,
    cursor: 'pointer',
  },
};

// ==========================================
// Public API
// ==========================================
export default TimePickerDigital;
