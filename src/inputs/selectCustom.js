import React                from 'react';
import {
  omit,
  merge,
  set as timmSet,
}                           from 'timm';
import {
  bindAll,
  cancelEvent,
}                           from '../gral/helpers';
import {
  COLORS, KEYS,
  UNICODE,
  NULL_STRING,
}                           from '../gral/constants';
import {
  flexContainer, flexItem,
}                           from '../gral/styles';
import input                from '../hocs/input';
import {
  ListPicker,
  LIST_SEPARATOR,
}                           from '../inputs/listPicker';
import {
  floatAdd,
  floatDelete,
  floatUpdate,
  warnFloats,
}                           from '../components/floats';
import Icon                 from '../components/icon';

function toInternalValue(val) { return val != null ? JSON.stringify(val) : NULL_STRING; }
function toExternalValue(val) { return val !== NULL_STRING ? JSON.parse(val) : null; }

// ==========================================
// Component
// ==========================================
class Select extends React.Component {
  static propTypes = {
    disabled:               React.PropTypes.bool,
    items:                  React.PropTypes.array.isRequired,
    allowNull:              React.PropTypes.bool,
    inlinePicker:           React.PropTypes.bool,
    children:               React.PropTypes.any,
    onClickItem:            React.PropTypes.func,
    onCloseFloat:           React.PropTypes.func,
    floatPosition:          React.PropTypes.string,
    floatAlign:             React.PropTypes.string,
    floatZ:                 React.PropTypes.number,
    styleList:              React.PropTypes.object,
    twoStageStyle:          React.PropTypes.bool,
    accentColor:            React.PropTypes.string,
    // Input HOC
    curValue:               React.PropTypes.string.isRequired,
    onChange:               React.PropTypes.func.isRequired,
    registerOuterRef:       React.PropTypes.func.isRequired,
    fFocused:               React.PropTypes.bool.isRequired,
    keyDown:                React.PropTypes.object,
  };
  static defaultProps = {
    accentColor:            COLORS.accent,
  };

  constructor(props) {
    super(props);
    this.state = { fFloat: false };
    bindAll(this, [
      'registerTitleRef',
      'onMouseDownTitle',
      'onClickItem',
    ]);
  }

  componentWillMount() {
    this.prepareItems(this.props.items, this.props.allowNull);
  }

  componentDidMount() { warnFloats(this.constructor.name); }

  componentWillReceiveProps(nextProps) {
    const { keyDown, items, allowNull, fFocused } = nextProps;
    if (keyDown !== this.props.keyDown) this.processKeyDown(keyDown);
    if (items !== this.props.items || allowNull !== this.props.allowNull) {
      this.prepareItems(items, allowNull);
    }
    if (fFocused !== this.props.fFocused) {
      this.setState({ fFloat: fFocused });
    }
  }

  componentDidUpdate() { this.renderFloat(); }
  componentWillUnmount() { floatDelete(this.floatId); }

  // ==========================================
  // Render
  // ==========================================
  render() {
    if (this.props.inlinePicker) {
      return this.renderPicker();
    } else if (this.props.children) {
      return this.renderProvidedTitle();
    } else {
      return this.renderDefaultTitle();
    }
  }

  renderProvidedTitle() {
    return (
      <span ref={this.registerTitleRef}
        className="giu-select-drop-down-picker"
      >
        {this.props.children}
      </span>
    );
  }

  renderDefaultTitle() {
    const { items, curValue } = this.props;
    const value = curValue === NULL_STRING ? UNICODE.nbsp : curValue;
    let label = UNICODE.nbsp;
    if (curValue !== NULL_STRING) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].value === curValue) {
          label = this.items[i].label;
          break;
        }
      }
    }
    const caretIcon = this.state.fFloat ? 'caret-up' : 'caret-down';
    return (
      <span ref={this.registerTitleRef}
        className="giu-select-drop-down-picker"
        onMouseDown={this.onMouseDownTitle}
        style={style.title(this.props)}
      >
        {label}
        <span style={flexItem(1)} />
        <Icon icon={caretIcon} style={style.caret} />
      </span>
    );
  }

  renderFloat() {
    if (this.props.inlinePicker) return;
    const { fFloat } = this.state;

    // Remove float
    if (!fFloat && this.floatId != null) {
      floatDelete(this.floatId);
      this.floatId = null;
      this.props.onCloseFloat && this.props.onCloseFloat();
      return;
    }

    // Create or update float
    if (fFloat) {
      const { floatZ, floatPosition, floatAlign } = this.props;
      const floatOptions = {
        position: floatPosition,
        align: floatAlign,
        zIndex: floatZ,
        limitSize: true,
        getAnchorNode: () => this.refTitle,
        children: this.renderPicker(),
      };
      if (this.floatId == null) {
        this.floatId = floatAdd(floatOptions);
      } else {
        floatUpdate(this.floatId, floatOptions);
      }
    }
  }

  renderPicker() {
    const {
      inlinePicker,
      registerOuterRef,
      curValue, onChange,
      disabled, fFocused,
      styleList,
      twoStageStyle, accentColor,
    } = this.props;
    return (
      <ListPicker
        registerOuterRef={inlinePicker ? registerOuterRef : undefined}
        items={this.items}
        curValue={curValue}
        onChange={onChange}
        onClickItem={this.onClickItem}
        keyDown={this.keyDown}
        disabled={disabled}
        fFocused={inlinePicker && fFocused}
        style={styleList}
        twoStageStyle={twoStageStyle}
        accentColor={accentColor}
      />
    );
  }

  // ==========================================
  // Event handlers
  // ==========================================
  registerTitleRef(c) {
    this.refTitle = c;
    this.props.registerOuterRef(c);
  }

  // If the menu is not focused, ignore it: it will be handled by the `input` HOC.
  // ...but if it is focused, we want to toggle it
  onMouseDownTitle(ev) {
    if (!this.props.fFocused) return;
    this.setState({ fFloat: !this.state.fFloat });
  }

  onClickItem(ev, nextValue) {
    const { inlinePicker } = this.props;
    if (!inlinePicker) this.setState({ fFloat: false });
    this.props.onClickItem && this.props.onClickItem(ev, nextValue);
  }

  // ==========================================
  // Helpers
  // ==========================================
  processKeyDown(keyDown) {
    if (keyDown.which === KEYS.esc && !this.props.inlinePicker) {
      this.setState({ fFloat: !this.state.fFloat });
      this.keyDown = undefined;
      return;
    }
    this.keyDown = keyDown;
  }

  prepareItems(items, allowNull) {
    this.items = [];
    if (allowNull) this.items.push({ value: NULL_STRING, label: '' });
    items.forEach(item => {
      const { value } = item;
      if (value === LIST_SEPARATOR.value) {
        this.items.push(item);
        return;
      }
      const newItem = timmSet(item, 'value', toInternalValue(value));
      this.items.push(newItem);
    });
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  titleBase: flexContainer('row', {
    display: 'inline-flex',
    border: `1px solid ${COLORS.line}`,
    padding: '1px 2px',
    minWidth: 40,
    cursor: 'pointer',
  }),
  title: ({ fFocused }) => {
    let out = style.titleBase;
    if (fFocused) {
      out = merge(out, {
        boxShadow: COLORS.focusGlow,
        border: `1px solid ${COLORS.focus}`,
      });
    }
    return out;
  },
  caret: {
    marginLeft: 15,
    marginRight: 3,
    marginTop: 1,
  },
};

// ==========================================
// Public API
// ==========================================
export default input(Select, {
  toInternalValue, toExternalValue,
  fIncludeFocusCapture: true,
  trappedKeys: [
    KEYS.esc,
    // For ListPicker
    KEYS.down, KEYS.up,
    KEYS.home, KEYS.end,
    KEYS.return, KEYS.del, KEYS.backspace,
  ],
  className: 'giu-select-custom',
});
