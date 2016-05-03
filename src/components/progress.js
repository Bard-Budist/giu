import React                from 'react';
import PureRenderMixin      from 'react-addons-pure-render-mixin';
import { omit }             from 'timm';

// ==========================================
// Component
// ==========================================
class Progress extends React.Component {
  static propTypes = {
    // all other props are passed through
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const otherProps = omit(this.props, PROP_KEYS);
    return <progress {...otherProps} style={style.progress} />;
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  progress: {
    width: '100%',
  },
};

// ==========================================
// Miscellaneous
// ==========================================
const PROP_KEYS = Object.keys(Progress.propTypes);

// ==========================================
// Public API
// ==========================================
export default Progress;
