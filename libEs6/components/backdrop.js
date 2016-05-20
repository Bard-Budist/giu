import React                from 'react';
import PureRenderMixin      from 'react-addons-pure-render-mixin';
import { merge }            from 'timm';
import { cancelEvent }      from '../gral/helpers';

// ==========================================
// Component
// ==========================================
class Backdrop extends React.Component {
  static propTypes = {
    style:                  React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  // All props are forwarded to the child `<div>`
  render() {
    return (
      <div
        className="giu-backdrop"
        onWheel={cancelEvent}
        {...this.props}
        style={style.backdrop(this.props)}
      />
    );
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  backdrop: ({ style: baseStyle }) => merge({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'white',
    opacity: 0.7,
  }, baseStyle),
};

// ==========================================
// Public API
// ==========================================
export default Backdrop;
