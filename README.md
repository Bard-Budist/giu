# Giu [![npm version](https://img.shields.io/npm/v/giu.svg)](https://www.npmjs.com/package/giu)

An opinionated Swiss-army knife for React webapp GUI building.

**WORK IN PROGRESS**

## Why?

- Flexibility:
    + If you use the ES6 sources and Webpack 2, you can bundle only the components you need, nothing more. For example, if you `import Modal`, you will not embed Redux, which you will if you `import Modals`.
    + If you need a simple confirmation modal, use `Modal` directly. If you need stacked modals and more state control, include a `Modals` component at the top of your app and use the provided API. If you need even more control, use the exported `modalReducer` and `modalActions` (action creators) with your own application's Redux store. Same for `Notifications`and `Floats`.
    + In form components (`TextInput`, `Select`, `Textarea`...), choose whether you want Giu to handle state for you (and then retrieve the component's value when e.g. the user clicks on Submit) or you want full control from outside.
    + Styles: lightweight styles are included for some components, but you can always customise the appearance including your own `style` attributes.
- Nice touches:
    + Textarea with auto-resize
    + Keyboard shortcuts, autofocus, default buttons on Modals
    + Sticky/retainable notifications
- The styles used on Giu inputs are very low-key and can be easily overriden.
- Completeness:
    + Basic components: Button, Icon, Spinner, LargeMessage...
    + Form components: TextInput, NumberInput, Select, Textarea, Checkbox...
    + Not-so-basic ones: Modal(s), Notification(s)...
    + Higher-order components: Hoverable
    + Style helpers: ...
    + Other helpers: ...

## Installation

Giu is intended to be bundled with [*webpack*](https://webpack.github.io/), so it is recommended to include it in your `devDependencies`:

```
$ npm install --save-dev giu
```

Make sure you also install the required `peerDependencies` ([*react*](https://github.com/facebook/react), [*react-addons-pure-render-mixin*](https://www.npmjs.com/package/react-addons-pure-render-mixin) and [*moment*](https://github.com/moment/moment)).

Installation notes: 

* *moment* will not be included in your production bundle if you don't use `DateInput` and set up *webpack*'s' [*tree shaking*](http://www.2ality.com/2015/12/webpack-tree-shaking.html). However, it should be installed since *webpack* will look for it in development mode.

* Why is *moment* part of `peerDependencies` and not `dependencies`? For i18n reasons: we want to make sure the user's `moment` object and the one used internally by Giu are exactly the same, so that `DateInput`'s strings and other locale-specific attributes (e.g. first day of the week) are shown correctly. If the version specified by the user and by Giu were incompatible, we would end up with two different `moment` objects.

## Inputs

Giu provides a wide variety of inputs and several useful abstractions over native HTML native elements: state delegation (optional), comprehensive validation, JS types and nullability.

You'll understand the benefits it brings with an example. Let's say you want to build a form that allows users to modify certain parameters of their registration profile, e.g. their age. With native HTML inputs, you'd use something like this:

```js
<input id="age"
  type="number" min={0} step={1}
  value={this.state.age} onChange={age => this.setState({ age: Number(age) })}
/>
```

It seems simple, right? But in reality you are handling a lot of stuff yourself:

* You must keep track of the original `age` value in the profile (let's assume it was received as `this.props.age`), as well as the modified user value (`this.state.age`).
* You must provide an `onChange` handler and keep your state up to date.
* You must convert back and forth between the input's `string` value and your `number` attribute.
* You must validate input contents before submitting the form.

You *could* use Giu similarly:

```js
<NumberInput id="age" 
  min={0} step={1}
  value={this.state.age} onChange={(ev, age) => this.setState({ age })}
/>
```

This approach follows *The React Way™*, but we're already seeing a first benefit: the `onChange` handler will be called (in addition to the native event) with the *converted* input value: either a `number` (*not* a `string`) or `null`. No need to perform the conversion ourselves.

But we can further improve on this:

```js
<NumberInput ref="age" /* or: ref={c => { this.refAge = c; }}*/
  min={0} step={1}
  value={this.props.age}
  required validators={[isGte(18)]}
/>
```

What's happened here? We only pass the original age as `value`, but we delegate keeping track of the value entered by the user. We also drop the `onChange` handler and add some `validators` (see [details below](#input-validation)). When the time comes to submit the form, we can do:

```js
onClickSubmit() {
  this.refs.age.validateAndGetValue().then(age => { ... })
}
```

The promise returned by `validateAndGetValue()` will either resolve with the current value or reject if validation fails.


### Input value types

Most HTML inputs can only hold strings. Giu inputs provide you with JS types and allow `null` values (if you don't specify the `required` prop):

| Components | JS type |
| --- | --- |
| `TextInput`, `PasswordInput`, `Textarea` | *string* |
| `NumberInput`, `RangeInput` | *number* |
| `Checkbox` | *boolean* |
| `DateInput` | *Date* (see full range of date/time possibilities below) |
| `Select`, `RadioGroup` | *any* (depends on the values specified in the `items` prop, see below) |
| `ColorInput` | *string* (8-digit hex color code) |
| `FileInput` | *File* |


### Input validation

#### Predefined validators

Some validators are already enabled by default:

```js
// Shows an error if the provided value is an invalid date.
// Will NOT complain if left blank; by default, Giu inputs can be left blank.
<DateInput />
```

Validation occurs automatically when the input loses focus (`blur`). You can also trigger it imperatively with the `validateAndGetValue()` function (see [Imperative API](#imperative-api)).

Enabling additional validators is also simple:

```js
// Shows an error if left blank ('is required')
// OR if the format is not valid ('must be a valid date...').
<DateInput required />

// Shows an error only if a value is specified but it's not valid.
<TextInput validators={[isEmail()]} />
<NumberInput validators={[isGte(5), isLte(10)]} />
```

Here is the list of predefined validators, with some examples:

```js
// Generic
isRequired() // same as the 'required' attribute, but allowing customization
isEqualTo(password, 'password')
isOneOf(['rabbit', 'cow', 'eagle'])

// Strings
hasAtLeastChars(5)
hasAtMostChars(20)
hasLengthWithinRange(5, 20)
isEmail()
isUrl()
matchesPattern(/[-+]?[0-9]*\.?[0-9]+/)

// Numbers
isNumber()
isGreaterThanOrEqual(0) // or: isGte(0)
isLowerThanOrEqual(1000) // or: isLte(1000)
isWithinRange(0, 1000)

// Dates and times
isDate()
```

As we saw above, some of these validators are automatically enabled for certain components, e.g. `isDate()` in `DateInput`s and `isNumber()` in `NumberInput`s. However, you can include them in your `validators` list for customization (e.g. i18n), as you'll see next.


#### Custom validators

Customize a predefined validator by passing it an additional argument upon instantiation. This argument can be a string or a function returning the desired error message (e.g. for i18n) based on the following arguments:

* Default error message
* Current (internal) input value
* Extra context, including the validator arguments (e.g. the `min` and `max` values for `isWithinRange`) and additional information (e.g. the expected format `fmt` for date/time values).

Some examples:

```js
// Override the message for the `isEmail` validator
<TextInput validators={[
  isEmail("please write your email address (it's safe with us!)"),
]} />

// Override the message for the `required` validator
<TextInput validators={[isRequired('please write your name')]} />

// Specify a function to further customize/translate your message
import i18n from 'mady';  // a translation function
<TextInput validators={[
  isEmail((defaultMsg, value) => i18n("'{VALUE}' is not a valid email address", { VALUE })),
]} />

// The error message function may use the extra context parameter:
<DateInput validators={[
  isDate((defaultMsg, value, { fmt }) => `follow this format: ${fmt}`),
]} />
<NumberInput validators={[
  isGte(15, (defaultMsg, value, { min }) => i18n('must be >= {MIN}', { MIN: min })),
]} />
```

You can also create your own validators, which can be sync (return an error message) or async (return a promise) and should have this signature:

* **value** *any?*: the current internal value of the input component
* **props** *object*: the input component's props (including defaults props)
* **context** *object?*: additional validator context provided by certain components. For example, `DateInput` injects the `moment` object via context
* **Returns** *Promise(string?)|string?*: error message

A couple of examples:

```js
// A custom sync validator
<TextInput required validators={[
  val => val.toLowerCase() === 'unicorn' ? undefined : 'must be a \'unicorn\''
]} />

// A custom async validator
<TextInput required validators={[
  val => new Promise((resolve, reject) =>
    setTimeout(() => 
      val.toLowerCase() === 'unicorn'
        ? resolve()
        : resolve('checked the database; you must be a \'unicorn\'')
    , 1000)
  ),
]} />
```


### Imperative API

Giu generally follows *The React Way™*. In some particular cases, however, you may need or prefer a more imperative style:

1. Validate and fetch an input value before submitting a form
2. Move focus to an input, or away from it
3. Set an input's value (without affecting the original, reference value in the `value` prop) or revert the input state to the `value` prop

You have already seen how to accomplish task 1, via a direct component call. Assuming you keep a `ref` to the input component:

```js
onClickSubmit() {
  this.refs.age.validateAndGetValue().then(age => { ... })
}
```

This is the only truly *imperative* API provided by Giu, provided for convenience.

Tasks 2 and 3 above are managed via a *pseudo-imperative* API, the `cmds` prop, an array of commands that are executed by the [Input HOC](#input-hoc). Commands are plain objects with a `type` attribute, plus other attributes as needed. Currently supported commands are:

* `SET_VALUE`: change the current input state (without affecting the original `value` prop). The new value is passed in the command object as `value`.
* `REVERT`: revert the current input state to the original `value` prop.
* `FOCUS`, `BLUR`: move the focus to or away from the input component.

*Important note: Commands in the `cmds` prop are executed when a new array is passed down (strict equality is checked). Take this into account so that your commands are not executed more than once!*


### Common input props

* Basic (see also the [introduction to inputs](#inputs)):
    * **value** *any?*: either the original value, or the current input value (if you want to handle state yourself). See also the list of [input value types](#input-value-types)
    * **onChange** *function?*: include it if you want to handle input state yourself, or if you just want to be informed about user changes
    * **onFocus** *function?*
    * **onBlur** *function?*
    * **disabled** *boolean?*: prevents the input from being interacted with; also affects styles
    * **cmds** *array(object)?*: see [Imperative API](imperative-api)
* Validation-related (see also [input validation](#input-validation)):
    * **required** *boolean?*: synonym for the `isRequired()` validator
    * **validators** *array(object|function)?*: objects are used for predefined validators, whereas functions are used for custom ones
    * **noErrors** *boolean?*: ignore validation altogether
* Float-related (for all inputs with floating pickers, e.g. `Select`, `DateInput`, `ColorInput`):
    * **floatPosition** *string(`above`|`below`)?*: if unspecified, a suitable position is selected algorithmically
    * **floatAlign** *string(`left`|`right`)? = `left`*: if unspecified, a suitable position is selected algorithmically
    * **floatZ** *number? = 5*
* Error-float-related:
    * **errorPosition** *string(`above`|`below`)?*: if unspecified, Giu chooses `below` except if `floatPosition` is specified (it then chooses the opposite position)
    * **errorAlign** *string(`left`|`right`)? = `left`*
    * **errorZ** *number?*: if unspecified, Giu chooses a suitable z-index algorithmically


### Specific input props

xx | `Checkbox` | *boolean* |
| `DateInput` | *Date* (see full range of date/time possibilities below) |
| `Select`, `RadioGroup` | *any* (depends on the values specified in the `items` prop, see below) |
xx | `ColorInput` | *string* (8-digit hex color code) |
| `FileInput` | *File* |

#### TextInput, PasswordInput, NumberInput, RangeInput, Textarea

* **style** *object?*: merged with the `input`/`textarea` style
* **vertical** *boolean?*: [only for `RangeInput`]

#### Checkbox

* **label** *string?*: gets converted to a `label` element
* **styleLabel** *object?*: merged with the `label` style

#### DateInput

* **type** *string(`onlyField`|`inlinePicker`|`dropDownPicker`)? =
  `dropDownPicker`*
* **placeholder** *string?*: when unspecified, the expected date/time
  format will be used
* **date** *boolean? = true*: whether the date is part of the value
* **time** *boolean?*: whether the time is part of the value
* **analogTime** *boolean? = true*: whether the time picker should be
  analogue (traditional clock) or digital (list)
* **seconds** *boolean?*: whether seconds should be included in the time value
* **utc** *boolean?*: by default, it is `true` *unless* `date` and `time` are both `true`.
  In other words, local time is only used by default if both `date` and `time` are enabled
* **todayName** *string? = 'Today'*: label for the *Today* button
* **style** *object?*: merged with the `input` style
* **styleOuter** *object?*: when `type === 'inlinePicker'`,
  merged with the outermost `span` style
* **accentColor** *string?*: CSS color descriptor (e.g. `darkgray`, `#ccffaa`...)

#### Select

* **type** *string(`native`|`inlinePicker`|`dropDownPicker`)? = `native`*
* **items** *array(object)*: each item has the following attributes:
  - **value** *any*: any value that can be converted to JSON. Values should be unique
  - **label** *string*: descriptive string that will be shown to the user
  - **keys** *array(string)?*: keyboard shortcuts for this option, e.g.
    `mod+a` (= `cmd+a` in OS X, `ctrl+a` in Windows), `alt+backspace`, `shift+up`...
    **Only supported in non-native Selects**
* **required** *boolean?*: apart from its use for [validation](#input-validation),
  enabling this flag disables the addition of a `null` option to the `items` list

You can also include a separator between `items` by including the special
`LIST_SEPARATOR` item (**only in non-native Selects**):

```js
import { Select, LIST_SEPARATOR } from 'giu';
<Select items={[
  { value: 1, label: '1', keys: ['mod+1'] },
  { value: 2, label: '2', keys: ['mod+2'] },
  LIST_SEPARATOR,
  { value: 3, label: '3', keys: ['mod+3'] },
  { value: 4, label: '4', keys: ['mod+4'] },
]} />
```

Additional props for non-native Selects:
* **styleList** *object?*: when `type === 'inlinePicker'`,
  merged with the outermost `div` style
* **twoStageStyle** *boolean?*: when enabled, two different visual styles are applied
  to an item depending on whether it is just *hovered* or also *selected*. If disabled,
  a single style is used to highlight the selected or the hovered item
* **accentColor** *string?*: CSS color descriptor (e.g. `darkgray`, `#ccffaa`...)

#### RadioGroup

* **items** *array(object)*: each item has the following attributes
  - **value** *any*: any value that can be converted to JSON. Values should be unique
  - **label** *any?*: React elements that will be shown as a label for
    the corresponding radio button
  - **labelExtra** *any?*: React elements that will be shown below the main label

#### ColorInput

* **inlinePicker** *boolean?*: whether the complete color picker
  should be inlined (`true`) or appear as a dropdown when clicked
* **onCloseFloat** *function?*
* **accentColor** *string?*: CSS color descriptor (e.g. `darkgray`, `#ccffaa`...)

#### FileInput

* **children** *any? = `Choose file…`*: React elements that
  will be shown inside the button
* **style** *object?*: will be merged with the outermost `span` element


## DropDownMenu

TBW

## Modals

TBW

## Notifications

TBW

## Floats

TBW

## Hints

TBW

## Tiny little things

### Button

An inconspicuous-looking button-in-a-`span`.

* **plain** *boolean?*: removes most button styles
* **children** *any*: button contents (can include `Icon`
  components, etc.)
* **onClick** *function?*: `click` handler
* **disabled** *boolean?*
* **style** *object?*: merged with the `span` style
* *All other props are passed through to the `span` element*

### Icon and Spinner

A wrapper for Font Awesome icons.

* **icon** *string*: e.g. `ambulance`, `cogs`...
* **size** *string(`lg`|`2x`|`3x`|`4x`|`5x`)?*
* **fixedWidth** *boolean?*
* **spin** *boolean?*
* **disabled** *boolean?*
* **style** *object?*: merged with the `i` element style
* *All other props are passed through to the `i` element*

`Spinner` is a convenient shortcut for an `Icon` that, well, spins.

### LargeMessage

A simple `div` showing a centered message with a large font size.
Ideal for *No matches found*, *Choose one of the options above*,
that kind of thing.

* **children** *any*: the contents to be shown

### Progress

A wrapper for the native HTML `progress` element (with 100% width).
*All props are passed through to the `progress` element*


## Higher-order components (HOCs)

[HOCs](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750#.v1zqfc63a) are used internally by Giu components and are also provided in the user API. They work fine with all kinds of base components: [ES6 classes](https://facebook.github.io/react/docs/reusable-components.html#es6-classes), [plain-old `createClass`-style components](https://facebook.github.io/react/docs/multiple-components.html#composition-example) and [stateless functions](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions).

Example usage:

```js
import { hoverable } from 'giu';
import { Component } from 'react';

class MyReactComponent extends Component {
    /* ... */
}

export default hoverable(MyReactComponent);
```

### Hoverable HOC

Keeps track of `hovering` state and passes it as prop to your base
component. Provides `onHoverStart`/`onHoverStop` event handlers
you can attach to any of your base component's DOM elements
(works for multiple elements).
If you attach these handlers to an element with an `id` attribute,
the provided `hovering`
prop will contain the ID of the hovered element (or `null`); otherwise,
just `true` (or `null`).

Specific props received from the parent (all other props are
passed through):

* **onHoverStart** *function?*: relays the original event to
  the parent component.
* **onHoverStop** *function?*: relays the original event to
  the parent component.

Additional props passed to the base component:

* **hovering** *string|number|boolean?*: identifies the
  element that is hovered (see description above), or `null` if none
* **onHoverStart** *function*: `onMouseEnter` event handler you can attach to
  your target DOM elements
* **onHoverStop** *function*: `onMouseLeave` event handler you can attach to
  your target DOM elements

### Input HOC

TBW


## Helpers

You can find here a wide variety of helper functions, from very simple ones (`cancelEvent()`, `flexContainer()`) to relatively complex (`scrollIntoView()`). This is just an opinionated collection of hopefully useful bits and pieces for building React components.

### DOM node visibility helpers

**isVisible()**

Determines whether the provided node is *fully* visible
in the browser window.

* **node** *object?*: DOM node; if unspecified, the function returns `false`
* **bcr** *object?*: bounding client rectangle for `node`; if not specified,
  `getBoundingClientRect()` will be called on `node`
* **Returns** *boolean*

**scrollIntoView()**

Scrolls the node's ancestors so that a node is fully visible
in the browser window (or at least most of it, if it is too large).
Implemented as a recursive algorithm that is first run
for vertical scrolling, then in the horizontal direction.

* **node** *object?*: DOM node
* **options** *object? = {}*: the following options are allowed:
  - **topAncestor** *object*: stop the recursive algorithm at this
    ancestor (otherwise stops at the root level or when a `Modal`
    ancestor is reached)

### Style helpers

**flexContainer()**

Provides an inline style object for a Flex container.

* **flexDirection** *string(`row`|`column`)? = `row`*
* **style** *object?*: custom style (merged with the Flex style)
* **Returns** *object*: Flex container style

**flexItem()**

Provides an inline style object for a Flex item.

* **flex** *string|number*: value for the CSS `flex`/`-webkit-flex` attribute
* **style** *object?*: custom style (merged with the Flex style)
* **Returns** *object*: Flex item style

**boxWithShadow()**

Provides an inline style object for a slightly rounded shadowed box.

* **style** *object?*: custom style (merged with the base style)
* **Returns** *object*: inline style

**isDark()/isLight()**

Determines whether the provided color is perceived as dark or light.
Can be used to decide whether text on this background color should be light
or dark, respectively, for good readability.

* **color** *string/Color*: parameter describing the color (anything that
  can be processed by [tinycolor](https://github.com/bgrins/TinyColor))
* **Returns** *bool*: whether the color is dark (light)

**darken()/lighten()**

Darkens or lightens a given color by a given percentage.

* **color** *string/Color*: parameter describing the color (anything that
  can be processed by [tinycolor](https://github.com/bgrins/TinyColor))
* **percentage** *number? = 10*: percentage by which the color will be modified
* **Returns** *string*: hex string for the new color, e.g. `#ffaadd`

**addStylesToPage()**

Creates a new `<style>` element containing the provided CSS styles and
attaches it to the page.

* **styles** *string*: CSS styles to be added to the page

### Miscellaneous helpers

**bindAll()**

Binds a list of object methods to the object with `Function#bind()`.
Especially useful for ES6-style React components.

* **self** *object*: methods will be bound to this object
* **fnNames** *array<string>*: list of method names

**cancelEvent()**

Calls `preventDefault()` and `stopPropagation()` on the provided event.

* **ev** *object?*: event to be cancelled

**preventDefault()**

Calls `preventDefault()` on the provided event.

* **ev** *object?*: event for which default behaviour is to be prevented

**cancelBodyScrolling()**

`onWheel` event handler that can be attached to a scroller DOM node,
in order to prevent `wheel` events to cause document scrolling when
the scroller reaches the top/bottom of its contents.

* **ev** *object*: `wheel` event

**windowHeightWithoutScrollbar()/windowWidthWithoutScrollbar()**

Provides the inner height (width) of the window
excluding scrollbars (if any).

* **Returns** *number*: inner height (width) in pixels

**getScrollbarWidth()**

Measures and returns the scrollbar width.

Measurements are taken lazily when first requested.
On window `resize`, it is measured again (zooming causes
the reported widths to change, and the `resize` event is a
reliable way to detect zooming).
Note that the returned value might be zero,
e.g. on OS X with overlaid scrollbars.

* **Returns** *number*: scrollbar width in pixels


## [Changelog](https://github.com/guigrpa/giu/blob/master/CHANGELOG.md)


## License (MIT)

Copyright (c) [Guillermo Grau Panea](https://github.com/guigrpa) 2016

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
