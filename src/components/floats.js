import React                from 'react';
import PureRenderMixin      from 'react-addons-pure-render-mixin';
import { createStore }      from 'redux';
import {
  addLast,
  removeAt,
  set as timmSet,
  merge,
  mergeIn,
  addDefaults,
}                           from 'timm';
import {
  bindAll,
  windowHeightWithoutScrollbar, windowWidthWithoutScrollbar,
}                           from '../gral/helpers';
import { isVisible }        from '../gral/visibility';
import { MISC }             from '../gral/constants';
import {
  boxWithShadow,
}                           from '../gral/styles';

// ==========================================
// Store, reducer
// ==========================================
let store = null;
function initStore() { store = createStore(reducer); }

const INITIAL_STATE = {
  cntReposition: 0,
  floats: [],
};
function reducer(state0 = INITIAL_STATE, action) {
  let state = state0;
  let idx;
  let id;
  switch (action.type) {
    case 'FLOAT_ADD':
      state = timmSet(state, 'floats', addLast(state.floats, action.pars));
      break;
    case 'FLOAT_DELETE':
      id = action.id;
      idx = state.floats.findIndex(o => o.id === id);
      if (idx >= 0) {
        state = timmSet(state, 'floats', removeAt(state.floats, idx));
      }
      break;
    case 'FLOAT_UPDATE':
      id = action.id;
      idx = state.floats.findIndex(o => o.id === id);
      if (idx >= 0) {
        state = mergeIn(state, ['floats', idx], action.pars);
      }
      break;
    case 'FLOAT_REPOSITION':
      state = timmSet(state, 'cntReposition', state.cntReposition + 1);
      break;
    default:
      break;
  }
  return state;
}

// ==========================================
// Action creators
// ==========================================
let cntId = 0;
const DEFAULT_FLOAT_PARS = null;
const actions = {
  floatAdd: initialPars => {
    const id = `float_${cntId++}`;
    const pars = addDefaults(initialPars, DEFAULT_FLOAT_PARS, { id });
    return { type: 'FLOAT_ADD', pars };
  },
  floatDelete: id => ({ type: 'FLOAT_DELETE', id }),
  floatUpdate: (id, pars) => ({ type: 'FLOAT_UPDATE', id, pars }),
  floatReposition: () => ({ type: 'FLOAT_REPOSITION' }),
};

// Imperative dispatching
const floatAdd = pars => {
  const action = actions.floatAdd(pars);
  store.dispatch(action);
  return action.pars.id;
};
const floatDelete = (id) => store.dispatch(actions.floatDelete(id));
const floatUpdate = (id, pars) => store.dispatch(actions.floatUpdate(id, pars));
const floatReposition = () => store && store.dispatch(actions.floatReposition());

// ==========================================
// Inits
// ==========================================

// Reposition all floats upon window scroll or resize
// (This does *not* cover div scrolling, of course -- for that,
// you need to explicitly attach the `floatReposition` dispatcher
// as a listener to the corresponding `scroll` event)
try {
  window.addEventListener('scroll', floatReposition);
  window.addEventListener('resize', floatReposition);
} catch (err) { /* ignore */ }

// ==========================================
// Position and visibility calculation
// ==========================================
function isAnchorVisible({ getAnchorNode }) {
  const anchorNode = getAnchorNode();
  if (!anchorNode) return null;
  return isVisible(anchorNode);
}

// ==========================================
// Floats component
// ==========================================
let fFloatsMounted = false;
const isFloatsMounted = () => fFloatsMounted;

class Floats extends React.Component {
  static propTypes = {
    floats:                 React.PropTypes.array,
    cntReposition:          React.PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, [
      'forceUpdate',
      'renderFloat',
    ]);
    if (props.floats == null) {
      if (!store) initStore();
      this.storeUnsubscribe = store.subscribe(this.forceUpdate);
    }
  }

  componentWillMount() {
    fFloatsMounted = true;
    this.refFloats = [];
  }

  componentWillUnmount() {
    fFloatsMounted = false;
    if (this.storeUnsubscribe) this.storeUnsubscribe();
  }

  componentDidMount() { this.repositionFloats(); }
  componentDidUpdate() { this.repositionFloats(); }

  // ==========================================
  render() {
    this.floats = this.props.floats || store.getState().floats;
    return (
      <div
        className="giu-floats"
        style={style.outer}
      >
        {this.floats.map(this.renderFloat)}
      </div>
    );
  }

  renderFloat(props, idx) {
    if (!isAnchorVisible(props)) return null;
    const { id, zIndex = 5 } = props;
    return (
      <div key={id}
        className="giu-float"
        style={style.wrapper(zIndex)}
      >
        <div ref={c => { this.refFloats[idx] = c; }}
          {...props}
          style={style.floatInitial(props)}
        />
      </div>
    );
  }

  // ==========================================
  repositionFloats() {
    const floats = this.floats;
    for (let idx = 0; idx < floats.length; idx++) {
      this.repositionFloat(floats[idx], idx);
    }
  }

  repositionFloat(float, idx) {
    const ref = this.refFloats[idx];
    if (!ref) return;

    // Hide and move to top-left for measuring
    let { position, align } = float;
    ref.style.opacity = '0.5';
    ref.style.top = '0px';
    ref.style.left = '0px';
    ref.style.bottom = null;
    ref.style.right = null;
    ref.style.overflowX = 'visible';
    ref.style.overflowY = 'visible';
    const wFloat = ref.offsetWidth;
    const hFloat = ref.offsetHeight;

    // Preparations
    const anchorNode = float.getAnchorNode();
    const bcr = anchorNode && anchorNode.getBoundingClientRect();
    if (!bcr) return;
    const styleAttrs = {};
    const hWin = windowHeightWithoutScrollbar();
    const wWin = windowWidthWithoutScrollbar();
    const breathe = MISC.windowBorderBreathe;

    // Position vertically
    if (!position) {
      const freeBelow = hWin - bcr.bottom;
      if (freeBelow >= hFloat) {
        position = 'below';
      } else {
        position = freeBelow > bcr.top ? 'below' : 'above';
      }
    }
    if (position === 'below') {
      styleAttrs.top = `${bcr.bottom}px`;
      styleAttrs.bottom = null;
      styleAttrs.maxHeight = `${hWin - bcr.bottom - breathe}px`;
    } else {
      styleAttrs.top = null;
      styleAttrs.bottom = `${windowHeightWithoutScrollbar() - bcr.top}px`;
      styleAttrs.maxHeight = `${bcr.top - breathe}px`;
    }
    styleAttrs.overflowY = 'auto';

    // Position horizontally
    if (!align) {
      const freeRight = wWin - bcr.left;
      if (freeRight >= wFloat) {
        align = 'left';
      } else {
        align = freeRight > bcr.right ? 'left' : 'right';
      }
    }
    if (align === 'left') {
      styleAttrs.left = `${bcr.left}px`;
      styleAttrs.right = null;
      styleAttrs.maxWidth = `${wWin - bcr.left - breathe}px`;
    } else {
      styleAttrs.left = null;
      styleAttrs.right = `${windowWidthWithoutScrollbar() - bcr.right}px`;
      styleAttrs.maxWidth = `${bcr.right - breathe}px`;
    }
    styleAttrs.overflowX = 'auto';

    // Apply style
    Object.keys(styleAttrs).forEach(attr => {
      ref.style[attr] = styleAttrs[attr];
    });
    ref.style.opacity = 1;
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
  wrapper: zIndex => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    zIndex,
  }),
  floatInitial: ({ style: baseStyle, noStyleShadow }) => {
    let out = {
      position: 'fixed',
      top: 0,
      left: 0,
      opacity: 0.5,
    };
    if (!noStyleShadow) out = boxWithShadow(out);
    if (baseStyle) out = merge(out, baseStyle);
    return out;
  },
};

// ==========================================
// Warnings
// ==========================================
let fCheckedFloats = false;
const floatsWarning = name => `<${name}> requires a <Floats> component to be \
included in your application. It will not work properly otherwise.`;

function warnFloats(componentName) {
  if (fCheckedFloats) return;
  fCheckedFloats = true;
  /* eslint-disable no-console */
  if (!isFloatsMounted()) console.warn(floatsWarning(componentName));
  /* eslint-enable no-console */
}


// ==========================================
// Public API
// ==========================================
export {
  Floats,
  reducer,
  actions,
  floatAdd, floatDelete, floatUpdate, floatReposition,
  warnFloats,
};
