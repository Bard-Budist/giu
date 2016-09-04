import React                from 'react';
import { bindAll }          from '../gral/helpers';
import throttle             from 'lodash/throttle';

// ===============================================================
// VerticalManager
// ===============================================================
// Renders hidden first, reports on its height, then becomes visible when
// it gets a `top` property passed from the top. Becoming visible does not
// mean its child component gets re-rendered (this is more efficient than
// react-virtualized when using its CellMeasurer component).
class VerticalManager extends React.Component {
  static propTypes = {
    id:                     React.PropTypes.string.isRequired,
    childProps:             React.PropTypes.object,
    ChildComponent:         React.PropTypes.any.isRequired,
    onChangeHeight:         React.PropTypes.func.isRequired,
    top:                    React.PropTypes.number,
    rowHeight:              React.PropTypes.number,
  };

  static defaultProps = {
    childProps:             {},
  };

  constructor(props) {
    super(props);
    bindAll(this, ['measureHeight']);
    this.throttledMeasureHeight = throttle(this.measureHeight.bind(this), 200);
  }

  componentDidMount() {
    this.measureHeight();
    window.addEventListener('resize', this.throttledMeasureHeight);
  }

  componentDidUpdate() {
    this.measureHeight();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledMeasureHeight);
  }

  measureHeight() {
    const container = this.refs.container;
    if (!container) return;
    const height = container.clientHeight;
    if (height !== this.height) {
      this.height = height;
      this.props.onChangeHeight(this.props.id, height);
    }
  }

  // ===============================================================
  // Render
  // ===============================================================
  render() {
    const { ChildComponent, childProps } = this.props;
    return (
      <div ref="container" style={style.outer(this.props)}>
        <ChildComponent
          {...childProps}
          onMayHaveChangedHeight={this.measureHeight}
        />
      </div>
    );
  }
}

// ===============================================================
// Styles
// ===============================================================
const style = {
  outer: ({ top }) => ({
    position: 'absolute',
    opacity: top != null ? 1 : 0,
    top,
    left: 0,
    right: 0,

    // Important transition, no only aesthetically. When a row's contents changes height
    // and it is not shown because it is above the viewport, wheneve the user scrolls up
    // to that row it will get rendered, report on its new height, and all of the subsequent
    // rows will get repositioned. This should happen slowly to avoid confusing jumps
    // while scrolling
    // TODO: maybe disable this transition when list is draggable (react-sortable-hoc already
    // includes transition CSS)
    transition: 'top 300ms',
  }),
};

// ===============================================================
// Public API
// ===============================================================
export default VerticalManager;
