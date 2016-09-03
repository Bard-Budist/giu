import React                from 'react';
import Icon                 from './icon';

// ==========================================
// Component
// ==========================================
class Spinner extends React.PureComponent {
  render() {
    return <Icon icon="circle-o-notch" {...this.props} />;
  }
}

// ==========================================
// Public API
// ==========================================
export default Spinner;
