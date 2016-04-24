import React                from 'react';
import ReactDOM             from 'react-dom';
import {
  Select, Input, Textarea, Checkbox,
  Button,
  Icon, LargeMessage,
  Modals, showModal,
  hoverable,
  flexItem,
  flexContainer,
  merge,
}                           from '../src';

// -----------------------------------------------
// Examples
// -----------------------------------------------
const App = () => (
  <div>
    <Modals />
    <Message />
    <Icons />
    <Form />
    <Hoverable />
    <FlexRow>
      <span>Left</span>
      <FlexSpacer />
      <span>Right</span>
    </FlexRow>
  </div>
);

const Message = () => (
  <div style={style.example}>
    <LargeMessage>Hello there!</LargeMessage>
  </div>
);

const Icons = () => (
  <div style={style.example}>
    <Icon icon="heart" id="a" />
    {' '}
    <Icon icon="circle-o-notch" />
    {' '}
    <Icon icon="spinner" spin />
    {' '}
    <Icon icon="arrow-left" id="a" />
  </div>
);

const SELECT_OPTIONS = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' },
];
let cntModal = 1;

const Form = () => (
  <div style={style.example}>
    <div>
      <Select
        value="a"
        options={SELECT_OPTIONS}
      />
      <Select
        value={null}
        options={SELECT_OPTIONS}
        allowNull
        onChange={(_, value) => console.log(value)}
      />
      <Input
        type="text"
        value="a"
        placeholder="text"
        onChange={(_, value) => console.log(value)}
      />
      <Input
        type="number"
        step="0.1"
        value={null}
        placeholder="number"
        onChange={(_, value) => console.log(value)}
      />
      <Checkbox id="myCheck" value />
      <label htmlFor="myCheck">Label</label>
      <Button onClick={() => showModal({ title: `Modal ${cntModal++}` })}>
        Add modal
      </Button>
      <Button plain>Text button</Button>
    </div>
    <br />
    <Textarea value="En un lugar de la Mancha..." />
  </div>
);

const Hoverable = hoverable(({ hovering, onHoverStart, onHoverStop }) => (
  <div
    onMouseEnter={onHoverStart}
    onMouseLeave={onHoverStop}
    style={merge(style.example, style.hoverable(hovering))}
  >
    Hoverable
  </div>
));

const FlexRow = ({ children }) => (
  <div style={merge(style.example, flexContainer('row'))}>
    {children}
  </div>
);

const FlexSpacer = ({ children }) => <div style={flexItem('1')}>{children}</div>;

// -----------------------------------------------
// Styles
// -----------------------------------------------
const style = {
  example: {
    marginBottom: 5,
    width: 700,
    border: '1px solid #ccc',
    padding: 5,
  },
  hoverable: hovering => ({
    backgroundColor: hovering ? '#ccc' : undefined,
  }),
};

// -----------------------------------------------
// Render main
// -----------------------------------------------
ReactDOM.render(<App />, document.getElementById('app'));
