import React from 'react';
import Link from 'next/link';
import 'giu/lib/css/reset.css';
import 'giu/lib/css/giu.css';

// ================================================
// Public
// ================================================
class AppWrapper extends React.Component {
  render() {
    return (
      <div>
        <Link href="/play1">
          <a>Play1</a>
        </Link>
      </div>
    );
  }
}

export default AppWrapper;
