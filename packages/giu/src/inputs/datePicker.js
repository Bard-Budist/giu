// @flow

import React from 'react';
import classnames from 'classnames';
import moment from '../vendor/moment';
import { startOfToday, getTimeInSecs } from '../gral/dates';
import type { Moment, KeyboardEventPars } from '../gral/types';
import { KEYS } from '../gral/constants';
import Button from '../components/button';
import Icon from '../components/icon';

// ==========================================
// Declarations
// ==========================================
type Props = {|
  disabled: boolean,
  curValue: ?Moment,
  onChange: (ev: ?SyntheticEvent<*>, nextValue: ?Moment) => any,
  utc: boolean,
  todayName: string,
|};

type State = {
  shownMonthStart: Moment,
  // Copy of props for getDerivedState...
  curValue: ?Moment,
};

// ==========================================
// Component
// ==========================================
class DatePicker extends React.Component<Props, State> {
  startOfCurValue: ?Moment;
  shownMonthNumber: number;

  state: any = {};

  // If curValue changes, reset the shownMonthStart (otherwise, the user
  // can modify shownMonthStart to see another month without selecting a
  // new date)
  static getDerivedStateFromProps(props: Props, prevState: State) {
    const nextValue = props.curValue;
    const prevValue = prevState.curValue;
    const state: Object = { curValue: nextValue };
    if (
      prevState.shownMonthStart == null ||
      (prevValue == null && nextValue != null) ||
      (prevValue != null && nextValue == null) ||
      (prevValue != null && nextValue != null && !prevValue.isSame(nextValue))
    ) {
      const refMoment =
        nextValue != null ? nextValue.clone() : startOfToday(props.utc);
      state.shownMonthStart = refMoment.startOf('month');
    }
    return state;
  }

  // ==========================================
  // Imperative API
  // ==========================================
  doKeyDown({ which, shiftKey, ctrlKey, altKey, metaKey }: KeyboardEventPars) {
    if (shiftKey || ctrlKey || altKey || metaKey) return;
    switch (which) {
      case KEYS.pageUp:
        this.onClickPrevMonth();
        break;
      case KEYS.pageDown:
        this.onClickNextMonth();
        break;
      case KEYS.right:
        this.changeDateByDays(+1);
        break;
      case KEYS.left:
        this.changeDateByDays(-1);
        break;
      case KEYS.down:
        this.changeDateByDays(+7);
        break;
      case KEYS.up:
        this.changeDateByDays(-7);
        break;
      case KEYS.home:
        this.goToStartEndOfMonth('start');
        break;
      case KEYS.end:
        this.goToStartEndOfMonth('end');
        break;
      case KEYS.del:
      case KEYS.backspace:
        this.props.onChange(null, null);
        break;
      default:
        break;
    }
  }

  // ==========================================
  render() {
    const { curValue, utc } = this.props;
    this.startOfCurValue =
      curValue != null ? curValue.clone().startOf('day') : null;
    this.shownMonthNumber = this.state.shownMonthStart.month();

    // Clone the `shownMonthStart` moment this way, so that it gets the correct locales
    // in case moment changes!
    const shownMonthStart = moment(this.state.shownMonthStart.valueOf());
    if (utc) shownMonthStart.utc();
    return (
      <div className="giu-date-picker">
        {this.renderMonth(shownMonthStart)}
        {this.renderDayNames()}
        {this.renderWeeks(shownMonthStart)}
        {this.renderToday()}
      </div>
    );
  }

  renderMonth(shownMonthStart: Moment) {
    const { disabled } = this.props;
    return (
      <div className="giu-date-picker-row">
        <div className="giu-date-picker-month-change">
          {!disabled && (
            <Icon icon="arrow-left" onClick={this.onClickPrevMonth} skipTheme />
          )}
        </div>
        <Button
          className="giu-date-picker-month-name"
          onClick={this.onClickMonthName}
          skipTheme
          plain
        >
          {shownMonthStart.format('MMMM YYYY')}
        </Button>
        <div className="giu-date-picker-month-change">
          {!disabled && (
            <Icon
              icon="arrow-right"
              onClick={this.onClickNextMonth}
              skipTheme
            />
          )}
        </div>
      </div>
    );
  }

  renderDayNames() {
    const dayNames = moment.weekdaysMin();
    const firstDayOfWeek = moment.localeData().firstDayOfWeek();
    const els = new Array(7);
    for (let i = 0; i < 7; i++) {
      const idx = (i + firstDayOfWeek) % 7;
      els[i] = (
        <div key={i} className="giu-date-picker-day-name">
          {dayNames[idx]}
        </div>
      );
    }
    return <div className="giu-date-picker-row">{els}</div>;
  }

  renderWeeks(shownMonthStart: Moment) {
    const curDate = shownMonthStart.clone();
    const endDate = moment(curDate).add(1, 'month');
    curDate.subtract(curDate.weekday(), 'days');
    const weeks = [];
    let i = 0;
    while (curDate.isBefore(endDate)) {
      weeks.push(this.renderWeek(curDate, i));
      curDate.add(1, 'week');
      i += 1;
    }
    return weeks;
  }

  renderWeek(weekStartDate: Moment, idx: number) {
    const curDate = moment(weekStartDate);
    const els = new Array(7);
    for (let i = 0; i < 7; i++) {
      els[i] = this.renderDay(curDate, i);
      curDate.add(1, 'day');
    }
    return (
      <div key={idx} className="giu-date-picker-row">
        {els}
      </div>
    );
  }

  renderDay(mom: Moment, idx: number) {
    const { disabled } = this.props;
    const id = mom.toISOString();
    const selected = !!this.startOfCurValue && this.startOfCurValue.isSame(mom);
    const inAnotherMonth = mom.month() !== this.shownMonthNumber;
    return (
      <div
        key={idx}
        id={id}
        className={classnames('giu-date-picker-day', {
          selected,
          disabled,
          'in-another-month': inAnotherMonth,
        })}
        onClick={this.onClickDay}
      >
        {mom.date()}
      </div>
    );
  }

  renderToday() {
    const { todayName } = this.props;
    return (
      <div className="giu-date-picker-today" onClick={this.onClickToday}>
        {todayName}
      </div>
    );
  }

  // ==========================================
  onClickMonthName = () => {
    const { utc } = this.props;
    const shownMonthStart = startOfToday(utc).startOf('month');
    this.setState({ shownMonthStart });
  };

  onClickPrevMonth = () => {
    this.changeShownMonth('subtract');
  };
  onClickNextMonth = () => {
    this.changeShownMonth('add');
  };
  changeShownMonth(op: 'subtract' | 'add') {
    const shownMonthStart = this.state.shownMonthStart.clone(); // eslint-disable-line
    if (op === 'add') {
      shownMonthStart.add(1, 'month');
    } else {
      shownMonthStart.subtract(1, 'month');
    }
    this.setState({ shownMonthStart });
  }

  onClickDay = (ev: SyntheticEvent<*>) => {
    const { utc } = this.props;
    if (!(ev.target instanceof Element)) return;
    const startOfDay = moment(ev.target.id);
    if (utc) startOfDay.utc();
    this.changeDateTo(ev, startOfDay);
  };

  onClickToday = (ev: SyntheticEvent<*>) => {
    const { utc } = this.props;
    const startOfDay = startOfToday(utc);
    this.changeDateTo(ev, startOfDay);
    this.onClickMonthName();
  };

  // ==========================================
  goToStartEndOfMonth(op: 'start' | 'end') {
    const startOfDay = this.state.shownMonthStart.clone();
    if (op === 'end') startOfDay.add(1, 'month').subtract(1, 'day');
    this.changeDateTo(null, startOfDay);
  }

  changeDateTo(ev: ?SyntheticEvent<*>, startOfDay: Moment) {
    const { curValue } = this.props;
    const nextValue = startOfDay.clone();
    if (curValue != null) {
      const secs = getTimeInSecs(curValue);
      nextValue.add(moment.duration(secs, 'seconds'));
    }
    this.doChange(ev, nextValue);
  }

  changeDateByDays(days: number) {
    const { curValue } = this.props;
    if (curValue == null) {
      this.goToStartEndOfMonth(days >= 0 ? 'start' : 'end');
      return;
    }
    const nextValue = curValue.clone();
    nextValue.add(days, 'days');
    this.doChange(null, nextValue);
  }

  doChange(ev: ?SyntheticEvent<*>, nextValue: Moment) {
    this.props.onChange(ev, nextValue);
  }
}

// ==========================================
// Public
// ==========================================
export default DatePicker;
