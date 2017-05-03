/* eslint-disable react/no-string-refs */

import React from 'react';
import {
  NumberInput, isLte,
  Button,
  notify,
} from 'giu';
import {
  ExampleLabel, exampleStyle,
} from './demo1-common';

class FormExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: null,
      b: 4,
    };
  }

  render() {
    return (
      <div style={exampleStyle}>
        <ExampleLabel>Uncontrolled vs. controlled form example</ExampleLabel>
        {this.renderUncontrolled()}
        {this.renderControlled()}
      </div>
    );
  }

  renderUncontrolled() {
    const props = { required: true, validators: [isLte(10)] };
    return (
      <div>
        <b>Uncontrolled:{' '}</b>
        <NumberInput ref="a1" value={null} {...props} />
        <NumberInput ref="b1" value={3} {...props} />
        <Button onClick={this.onSubmit('1')}>Read values</Button>
      </div>
    );
  }

  renderControlled() {
    const props = {
      required: true,
      validators: [isLte(10)],
    };
    return (
      <div>
        <b>Controlled:{' '}</b>
        <NumberInput ref="a2"
          value={this.state.a}
          onChange={(ev, val) => this.setState({ a: val })}
          {...props}
        />
        <NumberInput ref="b2"
          value={this.state.b}
          onChange={(ev, val) => this.setState({ b: val })}
          {...props}
        />
        <Button onClick={this.onSubmit('2')}>Read values</Button>
      </div>
    );
  }

  onSubmit = (suffix) => async () => {
    try {
      const [a, b] = await Promise.all([
        this.refs[`a${suffix}`].validateAndGetValue(),
        this.refs[`b${suffix}`].validateAndGetValue(),
      ]);
      notify({
        msg: `Values: ${a}, ${b}`,
        icon: this.context.theme === 'mdl' ? 'thumb_up' : 'thumbs-up',
      });
    } catch (err) {
      notify({
        msg: 'Validation failed',
        type: 'error',
        icon: this.context.theme === 'mdl' ? 'warning' : 'bullhorn',
      });
    }
  }

  readValues = async () => {
  }
}

FormExample.contextTypes = { theme: React.PropTypes.any };

export default FormExample;
