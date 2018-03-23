// @flow

import React from 'react';
import type { ComponentType } from 'react';
import throttle from 'lodash/throttle';

// ===============================================================
// Declarations
// ===============================================================
// Renders hidden first, reports on its height, then becomes visible when
// it gets a `top` property from its owner.
// Becoming visible does not
// mean its child component gets re-rendered (this is more efficient than
// react-virtualized when using its CellMeasurer component).

type PublicProps = {
  registerOuterRef?: (ref: any) => void,
  id: string,
  index: number,
  childProps?: Object,
  ChildComponent: ComponentType<*>,
  onChangeHeight?: (id: string, height: number) => any,
  top?: number,
};

type DefaultProps = {
  childProps: Object,
};

type Props = {
  ...$Exact<PublicProps>,
  ...$Exact<DefaultProps>,
};

// ===============================================================
// VerticalManager
// ===============================================================
class VerticalManager extends React.Component<Props> {
  static defaultProps: DefaultProps = {
    childProps: {},
  };
  height: number;
  throttledMeasureHeight: () => any;
  refVerticalManager: ?Object;

  constructor(props: Props) {
    super(props);
    this.throttledMeasureHeight = throttle(this.measureHeight.bind(this), 200);
  }

  componentDidMount() {
    this.asyncMeasureHeight();
    window.addEventListener('resize', this.throttledMeasureHeight);
  }

  componentDidUpdate() {
    this.asyncMeasureHeight();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledMeasureHeight);
  }

  measureHeight = () => {
    const { onChangeHeight } = this.props;
    if (!onChangeHeight) return;
    const { refVerticalManager } = this;
    if (!refVerticalManager) return;
    const height = refVerticalManager.clientHeight;
    /* eslint-disable max-len */
    // console.log(`Measured height for ${this.props.id} - ${this.props.childProps.item.name}: ${height}`)
    /* eslint-enable max-len */
    if (height !== this.height) {
      this.height = height;
      onChangeHeight(this.props.id, height);
    }
  };

  // Some components (e.g. Textarea) are too fast reporting that
  // they have changed, before the DOM has actually been updated
  // and the new height can be measured. Wait for the next tick
  // for things to stabilise before measuring.
  asyncMeasureHeight = () => {
    setImmediate(this.measureHeight);
  };

  // ===============================================================
  render() {
    const { id, index, ChildComponent, childProps } = this.props;
    const saneId = id.replace(/[:,]/g, '');
    return (
      <div
        ref={this.registerOuterRef}
        className="giu-vertical-manager"
        id={`giu-vertical-manager-${saneId}`}
        style={style.outer(this.props)}
      >
        <ChildComponent
          // react-sortable-hoc sortableRow requires the index
          index={index}
          {...childProps}
          onMayHaveChangedHeight={this.asyncMeasureHeight}
          // Disable participation of this row in drag-n-drop
          // (react-sortable-hoc) if its `top` is `undefined`
          // (i.e. if it is hidden and temporarily possitioned at the top,
          // hence possibly interfering in react-sortable-hoc´s algorithm)
          // or if props being passed through signal that dragging is disabled
          // (this increases component coupling, I know... :( ))
          disabled={
            !childProps.fSortedManually ||
            childProps.disableDragging ||
            this.props.top == null
          }
        />
      </div>
    );
    // Typical example of `onMayHaveChangedHeight`: in the `render`
    // property of a given DataTable column:
    // <Textarea onChange={this.props.onMayHaveChangedHeight} />
  }

  // ===============================================================
  registerOuterRef = (c: ?Object) => {
    this.refVerticalManager = c;
    if (this.props.registerOuterRef) this.props.registerOuterRef(c);
  };
}

// ===============================================================
const style = {
  outer: ({ top }) => ({
    position: 'absolute',
    opacity: top != null ? 1 : 0,
    zIndex: top != null ? undefined : -5000,
    // transform: top != null ? `translateY(${top}px)` : undefined,
    top: top != null ? Math.round(top) : undefined,
    left: 0,
    right: 0,
  }),
};

// ===============================================================
// Public
// ===============================================================
export default VerticalManager;
