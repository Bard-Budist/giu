# Giu [![npm version](https://img.shields.io/npm/v/giu.svg)](https://www.npmjs.com/package/giu)

An opinionated Swiss-army knife for building React application GUIs.

Online demos: [an extremely compact one](http://guigrpa.github.io/giu/demo1.html) and [an interactive version of this documentation](http://guigrpa.github.io/giu).



## Why?

- Improvements over native HTML inputs: (optional) [state delegation](#inputs), [comprehensive validation](#input-validation), [native JS types and nullability](#input-value-types).
- Support for **Server-Side Rendering**.
- Support for **i18n**: error messages, date inputs, etc.
- Love for detail:
    + [Stackable modals](#modals) with autofocus, default buttons, etc.
    + Sticky/retainable [notifications](#notifications)
    + [Keyboard shortcuts](#select) (cmd/ctrl-J, shift-up...) for options in selects and drop-down menus
    + Keyboard navigation for (almost) everything
    + Automatic scroll-into-view when inputs, even custom ones, are focused
    + Smart positioning of floating pickers (date and color inputs, drop-down menus, validation errors, etc.)
    + Ultra-customisable [date/time inputs](#dateinput)
    + Textarea with auto-resize
    + Uniform, lightweight styles with key accents that can easily be overriden
    * An extremely flexible [data table](#datatable) component
    + ... and a gorgeous [analog time picker](#dateinput)!
- Easy creation of [hint screens](#hint-screens) with dynamically-positioned labels and arrows
- Lots of [helper functions](#helpers)


## Installation

Giu is intended to be bundled with [*webpack*](https://webpack.github.io/), so it is recommended to include it in your `devDependencies`:

```
$ npm install --save-dev giu
```

Make sure you also install the required `peerDependencies` ([*react*](https://github.com/facebook/react) and [*moment*](https://github.com/moment/moment)).

Installation notes:

* Many Giu components (including all inputs) require that you **include `<Floats />` at (or near) the root level of your React tree**. No props are required. If you forget it, you'll see a warning in the console and those components will not work correctly. Other components you might want to add (if you use them): `<Modals />`, `<Notifications />`, `<Hints />`. More about them below.

* Why is *moment* part of `peerDependencies` and not `dependencies`? For i18n reasons: we want to make sure the user's `moment` object and the one used internally by Giu are exactly the same, so that `DateInput`'s strings and other locale-specific attributes (e.g. first day of the week) are shown correctly. If the version specified by the user and by Giu were incompatible, we would end up with two different `moment` objects.

## Inputs

Giu provides a wide variety of inputs and several useful abstractions over native HTML native elements: state delegation (optional), comprehensive validation, JS types and nullability.

You'll understand the benefits it brings with an example. Let's say you want to build a form that allows users to modify certain parameters of their registration profile, e.g. their age. With native HTML inputs, you'd use something like this:

```html
<input type="number" id="age"
  min={0} step={1}
  value={this.state.age} onChange={age => this.setState({ age: Number(age) })}
/>
```

It seems simple, right? But in reality you are handling a lot of stuff yourself:

* You must keep track of the original `age` value in the profile (let's assume it was received as `this.props.age`), as well as the modified user value (`this.state.age`).
* You must provide an `onChange` handler and keep your state up to date.
* You must convert back and forth between the input's `string` value and your `number` attribute.
* You must validate input contents before submitting the form.

You *could* use Giu in a similar way:

```html
<NumberInput id="age"
  min={0} step={1}
  value={this.state.age} onChange={(ev, age) => this.setState({ age })}
/>
```

This approach follows *The React Way™*, but we're already seeing a first benefit: the `onChange` handler will be called (in addition to the native event) with the *converted* input value: either a number or `null`; no need to do the conversion ourselves.

But we can further improve on this:

```html
<NumberInput ref="age"
  min={0} step={1}
  value={this.props.age}
  required validators={[isGte(18)]}
/>
// alternatively: <NumberInput ref={c => { this.refAge = c; }} ... />
```

What's happened here? We only pass the original age as `value`, but we delegate keeping track of the value entered by the user. We also drop the `onChange` handler and add some `validators` (see [details below](#input-validation)). When the time comes to submit the form, we can do:

```js
onClickSubmit() {
  this.refs.age.validateAndGetValue().then(age => { ... })
}
```



The promise returned by `validateAndGetValue()` will either resolve with the current value or reject if validation fails.



### Input value types

Most HTML inputs can only hold strings. Giu inputs provide you with JS types and allow `null` values by default (include the `required` flag to change that):

| Components | JS type |
| --- | --- |
| TextInput, PasswordInput, Textarea | *string* |
| NumberInput, RangeInput | *number* |
| Checkbox | *boolean* |
| DateInput | *Date* (see full range of date/time possibilities below) |
| Select, RadioGroup | *any* (depends on the values specified in the `items` prop, see below) |
| ColorInput | *string* (e.g. `rgba(173, 163, 120, 0.62)`) |
| FileInput | *File* |


### Input validation

#### Predefined validators

Some validators are enabled by default:

```html
// Shows an error if the provided value is an invalid date.
// Will NOT complain if left blank; by default, Giu inputs can be left blank.
<DateInput />
```



Validation occurs automatically when the input loses focus (i.e. on `blur`). You can also trigger it imperatively by calling `validateAndGetValue()` (see [Imperative API](#imperative-api)).

Enabling additional validators is easy:

```html
// Shows an error if left blank ('is required')
// OR if the format is not valid ('must be a valid date...').
<DateInput required />

// Shows an error only if a value is specified but it's not valid.
<TextInput validators={[isEmail()]} />
<NumberInput validators={[isGte(5), isLte(10)]} />
```



Here is the list of predefined validators:

```js
// Generic
isRequired() // same as the 'required' attribute, but allowing customisation
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

As we saw above, some of these validators are automatically enabled for certain components, e.g. `isDate()` in DateInputs and `isNumber()` in NumberInputs. However, you can include them in your `validators` list for customisation (e.g. i18n), as you'll see next.



#### Custom validators

Customise a predefined validator by passing it an additional argument upon instantiation. This argument can be a string or a function returning the desired error message (e.g. for i18n) based on the following arguments:

* Default error message
* Current (internal) input value
* Extra context, including the validator arguments (e.g. the `min` and `max` values for `isWithinRange`) and additional information (e.g. the expected format `fmt` for date/time values).

Some examples:

```html
// Override the message for the `isEmail` validator
<TextInput validators={[
  isEmail("please write your email address (it's safe with us!)"),
]} />

// Override the message for the `required` validator
<TextInput validators={[isRequired('please write your name')]} />

// Specify a function to further customise/translate your message
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



You can also create your own validators, which can be synchronous (returning an error message) or asynchronous (returning a promise of an error message) and should have this signature:

* **value** *any?*: the current internal value of the input component
* **props** *object*: the input component's props (including default props)
* **context** *object?*: additional validator context provided by certain components. For example, `DateInput` injects the `moment` object via context
* **Returns** *Promise(string?)|string?*: error message

A couple of examples:

```html
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
        : resolve('checked the database; must be a \'unicorn\'')
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

Tasks 2 and 3 above are managed via a *pseudo-imperative* API, the `cmds` prop, an array of commands that are executed by the so-called Input Higher-Order Component (HOC). Commands are plain objects with a `type` attribute, plus other attributes as needed. Currently supported commands are:

* `SET_VALUE`: change the current input state (without affecting the original `value` prop). The new value is passed in the command object as `value`.
* `REVERT`: revert the current input state to the original `value` prop.
* `FOCUS`, `BLUR`: move the focus to or away from the input component. [*not supported in Mobile Safari*]



*Important note: Commands in the `cmds` prop are executed when a new array is passed down (strict equality is checked). Take this into account so that your commands are not executed more than once!*


### Common input props

* Basic (see also the [introduction to inputs](#inputs)):
    * **value** *any?*: either the original value to be modified by the user, or the current input value (if you want to manage state yourself). See also the list of [input value types](#input-value-types)
    * **onChange** *function?*: include it if you want to manage state yourself, or if you just want to be informed about user changes
    * **onFocus** *function?*
    * **onBlur** *function?*
    * **disabled** *boolean?*: prevents the input from being interacted with; also affects styles
    * **cmds** *array(object)?*: see [Imperative API](#imperative-api)
* Validation-related (see also [input validation](#input-validation)):
    * **required** *boolean?*: synonym for the `isRequired()` validator
    * **validators** *array(object|function)?*: objects are used for predefined validators, whereas functions are used for custom ones
    * **noErrors** *boolean?*: ignore validation altogether
* Float-related (for all inputs with floating pickers, e.g. Select, DateInput, ColorInput):
    * **floatPosition** *string(`above`|`below`)?*: if unspecified, a suitable position is selected algorithmically
    * **floatAlign** *string(`left`|`right`)? = `left`*: if unspecified, a suitable position is selected algorithmically
    * **floatZ** *number? = 5*
* Error-float-related:
    * **errorPosition** *string(`above`|`below`)?*: if unspecified, Giu chooses `below` except if `floatPosition` is specified (it then chooses the opposite position)
    * **errorAlign** *string(`left`|`right`)? = `left`*
    * **errorZ** *number?*: if unspecified, Giu chooses a suitable z-index algorithmically


### TextInput, PasswordInput, NumberInput, RangeInput, Textarea



*Note: out of the box, Textarea resizes automatically as needed. You can limit its maximum height by adding a `style` prop: e.g. `style={{ maxHeight: 100 }}`*

Props:

* **style** *object?*: merged with the `input`/`textarea` style
* **skipTheme** *boolean?*
* **vertical** *boolean?*: [only for `RangeInput`]
* *All other props are passed through to the `input` element*

### Checkbox



Props:

```js
type PublicProps = {
  id?: string,
  label?: any, // React components to be included in the checkbox's `label` element
  disabled?: boolean,
  styleLabel?: Object, // merged with the `label` style
  // all others are passed through to the `input` unchanged
};
```

### DateInput

Shown below are some examples of DateInput, one of Giu's most versatile components: date/time/date-time modes, with or without drop-down pickers, inline pickers, custom accent color, digital/analogue time picker, disabled style... Not shown: keyboard navigation, clipboard events.

![DateInput screenshots](https://raw.githubusercontent.com/guigrpa/giu/master/docs/DateInputs.png)

If you use [*moment*](https://github.com/moment/moment), your date picker and date/time formats will be automatically translated when you choose a different locale, e.g. `moment.locale('es')`:

![Translated date picker](https://raw.githubusercontent.com/guigrpa/giu/master/docs/DateInput-i18n.png)



Props:

* **type** *string(`native` | `onlyField` | `inlinePicker` | `dropDownPicker`)? =
  `dropDownPicker`*
* **checkIos** *boolean? = true*: whether Giu should check for iOS in order to
  simplify certain components (e.g. do not use analogue time picker)
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
* **lang** *string?*: current language (NB: just used to make sure the component is
  refreshed). Use it to inform Giu that you have changed `moment`'s language.
* **style** *object?*: merged with the `input` style
* **styleOuter** *object?*: when `type === 'inlinePicker'`,
  merged with the outermost `span` style
* **skipTheme** *boolean?*
* **accentColor** *string?*: CSS color descriptor (e.g. `darkgray`, `#ccffaa`...)

### Select

Shown below are some examples of Select and its features: `native` and custom (`inlinePicker`|`dropDownPicker`) versions, keyboard shortcuts, custom accent color, disabled style. Not shown: keyboard navigation, clipboard events, automatic scrolling.

![Select screenshots](https://raw.githubusercontent.com/guigrpa/giu/master/docs/Selects2.png)

*Recommendation: use `dropDownPicker` for performance, especially if you have hundreds/thousands of Selects with many options: `native` Selects attach all of their `option` subelements to the page, whereas custom Selects only do that when the dropdown is shown.*



Props:

* **type** *string(`native` | `inlinePicker` | `dropDownPicker`)? = `native`*
* **items** *array(object)*: each item has the following attributes:
  - **value** *any*: any value that can be converted to JSON. Values should be unique
  - **label** *string*: descriptive string that will be shown to the user
  - **keys** *array(string)?*: keyboard shortcuts for this option, e.g.
    `mod+a` (= `cmd+a` in OS X, `ctrl+a` in Windows), `alt+backspace`, `shift+up`...
    **Only supported in non-native Selects**
* **lang** *string?*: current language (NB: just used to make sure the component is refreshed)
* **required** *boolean?*: apart from its use for [validation](#input-validation),
  enabling this flag disables the addition of a `null` option to the `items` list
* **style** *object?*: merged with the outermost `div` style (if `type` is `inlinePicker`),
  or with the `input` style (if `type` is `native`)

You can also include a separator between `items` by including the special
`LIST_SEPARATOR` item (**only in non-native Selects**):

```js
import { Select, LIST_SEPARATOR } from 'giu';
<Select required items={[
  { value: 'apples', label: 'Apples', keys: 'alt+a' },
  { value: 'cherries', label: 'Cherries', keys: ['alt+h', 'alt+e'] },
  LIST_SEPARATOR,
  { value: 'peaches', label: 'Peaches', keys: 'alt+p' },
  { value: 'blueberries', label: 'Blueberries', keys: 'alt+b' },
]} />
```

Additional props for non-native Selects:

* **twoStageStyle** *boolean?*: when enabled, two different visual styles are applied
  to an item depending on whether it is just *hovered* or also *selected*. If disabled,
  a single style is used to highlight the selected or the hovered item
* **accentColor** *string?*: CSS color descriptor (e.g. `darkgray`, `#ccffaa`...)

### RadioGroup



Props:

* **items** *array(object)*: each item has the following attributes
  - **value** *any*: any value that can be converted to JSON. Values should be unique
  - **label** *any?*: React elements that will be shown as a label for
    the corresponding radio button
  - **labelExtra** *any?*: React elements that will be shown below the main label
* **lang** *string?*: current language (NB: just used to make sure the component is refreshed)

### ColorInput

Shown below are some examples of ColorInput and its features: inline and drop-down versions, RGB and HSV pickers, transparency slider, custom accent color, disabled style. Not shown: clipboard events.

![ColorInput screenshots](https://raw.githubusercontent.com/guigrpa/giu/master/docs/ColorInputs.png)



Props:

* **inlinePicker** *boolean?*: whether the complete color picker
  should be inlined (`true`) or appear as a dropdown when clicked
* **onCloseFloat** *function?*
* **accentColor** *string?*: CSS color descriptor (e.g. `darkgray`, `#ccffaa`...)

### FileInput



Props:

```js
type PublicProps = {
  children?: any, // React elements that will be shown inside the button(default: `Choose file…`)
  cmds?: Array<Command>,
  disabled?: boolean,
  style?: Object, // will be merged with the outermost `span` element
  skipTheme?: boolean,
  // all others are passed through unchanged
};
```

## DataTable

A full-featured table supporting filtering, single/multiple selection,
pagination, infinite scrolling, sorting, drag and drop, clipboard events,
localStorage, etc.

Following Giu's philosophy, DataTable allows you to choose whether you
want to control individual features yourself, or you're OK with the
default behaviour. In many cases, you can set initial props (e.g.
`sortBy`, `sortDescending`, `selectedIds`, `manuallyOrderedIds`)
and then leave Giu the gruntwork of managing all the state. In order
to indicate this, just don't modify any of those props yourself.
Alternatively, if you want to manage state yourself, use the provided
callbacks (`onChangeSort`, `onChangeSelection`, `onChangeManualOrder`)
and update your props accordingly.

DataTable improves performance by only rendering the rows that are
visible. Rows can have uniform and well-known heights
(at the simplest end of the spectrum), uniform but unknown,
and also dynamic: different for every row, and even changing
in time (as a result of passed-down props or their own intrinsic state).

```js
type PublicProps = {
  // Basic
  // -----
  itemsById?: Object, // Rows, keyed by id (default: {})
  cols: Array<DataTableColumn>, // Column configuration objects
  lang?: string, // Used to force-refresh when language changes

  // Set of rows to be shown (before filtering)
  // ------------------------------------------
  shownIds?: Array<string>, // Row ids to be shown (default: [], no rows)
  onChangeShownIds?: (shownIds: Array<string>) => void,
  alwaysRenderIds?: Array<string>, // Render these rows even when not visible (e.g. editing)
  commonCellProps?: Object, // Passed to all column `render` functions

  // Filtering
  // ---------
  filterValue?: string, // (default: '')
  neverFilterIds?: Array<string>, // shown no matter what

  // Sorting
  // -------
  headerClickForSorting?: boolean, // (default: true)
  onChangeSort?: (options: {
    sortBy: ?string,
    sortDescending: boolean,
  }) => void,
  sortBy?: ?string, // Column, identified by `attr`
  sortDescending?: boolean,
  customPositions?: { [id: string]: ?string }, // if position is null, it will be sent to the top

  // Manual sorting
  allowManualSorting?: boolean, // Add manual sort column (default: true)
  disableDragging?: boolean, // Keep the sort column (if any), but disable it (temporarily)
  manuallyOrderedIds?: Array<string>,
  onChangeManualOrder?: (
    manuallyOrderedIds: ?Array<string>,
    context: {
      draggedId?: string, // ID of the row that has been dragged
    }
  ) => void,
  manualSortColLabel?: string | (() => string), // Custom column label (default: 'Sort manually')

  // Selection
  // ---------
  selectedIds?: Array<string>,
  allowSelect?: boolean,
  multipleSelection?: boolean,
  onChangeSelection?: (selectedIds: Array<string>) => void,
  onClipboardAction?: (ev: SyntheticClipboardEvent, json: string) => void,
  onRowDoubleClick?: (ev: SyntheticMouseEvent, id: string) => void,

  // Fetching
  // --------
  // Set fetchMoreItems if you want DataTable to notify you when the last row is rendered
  // (note: disabled when the filterValue prop is not empty)
  fetchMoreItems?: (lastRowId: string) => void, // Called when the last row is rendered
  fetching?: boolean, // When set, the FetchRowComponent will be shown
  FetchRowComponent?: ReactClass<*>,

  // LocalStorage
  // ------------
  // Set collectionName if you want DataTable to persist some user prefs to localStorage:
  // sort criteria, manual order, selection...
  collectionName?: string,

  // Miscellaneous
  // -------------
  emptyIndicator?: any,

  // Styles
  // ------
  height?: number, // Body height (default: 200)
  width?: number, // (default: default div block behaviour)
  rowHeight?: number, // Auto-calculated if unspecified
  uniformRowHeight?: boolean, // Are rows of the same height (even if unknown a priori)? (default: false)
  showHeader?: boolean, // (default: true)
  accentColor?: string, // Used for selections
  style?: Object,
  styleHeader?: Object,
  styleRow?: Object,
  animated?: boolean,

  // For VirtualScroller specifically
  estimatedMinRowHeight?: number,
  numRowsInitialRender?: number,
  maxRowsToRenderInOneGo?: number,
};
```

**Column definitions:**

```js
export type DataTableColumn = {
  attr: string, // column identifier, also used to get rawValues by default

  // Label
  // -----
  // As a function, it will be called with the `commonCellProps`,
  // if defined, or otherwise with the `lang` property)
  label?: string | ((commonCellPropsOrLang: any) => string),
  labelLevel?: number, // useful for very narrow cols (default: 0)

  // Values
  // ------
  // Each cell has a "reference value", obtained through the `rawValue`
  // callback (if present) or the column's `attr` property.
  // The reference value is used for filtering, sorting, and copy events,
  // unless the corresponding callbacks are set.
  rawValue?: (item: Object) => any,
  filterValue?: (item: Object) => any,
  sortValue?: (item: Object) => any,

  // Rendering
  // ---------
  // By default, the reference value is rendered. Customize this by
  // specifying a `render` function.
  render?: (item: Object) => React$Element<any>,

  // Functionalities
  // ---------------
  sortable?: boolean, // (default: true)
  sortableDescending?: boolean, // (default: true)
  filterable?: boolean, // (default: true)

  // Appearance
  // ----------
  hidden?: boolean,
  minWidth?: number,
  flexGrow?: number,
  flexShrink?: number,
  style?: Object, // Mixed with each row/header cell's outer div
};
```

## DropDownMenu

![DropDownMenu screenshots](https://raw.githubusercontent.com/guigrpa/giu/master/docs/DropDownMenu.png)



Props:


```js
type PublicProps = {
  // Items: similar to the Select component but including an `onClick` callback
  items: Array<Choice>,

  // Other props
  lang?: string, // current language (used just for force-render)
  children?: any, // React elements that will be shown as the menu's title
  onClickItem?: (
    ev: SyntheticMouseEvent, // `click` event
    val: any, // the item's `value` (as specified in the `items` prop)
  ) => void,
  style?: Object, // will be merged with the menu title's `div` wrapper
  accentColor?: string, // CSS color descriptor (e.g. `darkgray`, `#ccffaa`...)

  // All other props are passed through to the Select input component
};
```

## Modals

![Modal screenshots](https://raw.githubusercontent.com/guigrpa/giu/master/docs/Modal.png)



**Include the `<Modals />` component at (or near)
the root level of your React tree**. No props are required.

**Note on iOS usage**: on iOS, don't use Modals with embedded
inputs (TextInput, DateInput and so on).
Due to [these bugs](https://dzone.com/articles/issues-position-fixed),
when the user focuses on the embedded input, the whole page scrolls to the top.

Here's an example on how you would open and close a modal:

```js
import { modalPush, modalPop, Button } from 'giu';
class ModalExample extends React.Component {
  render() {
    return <Button onClick={() => this.deleteItem()}>Delete item</Button>
  }

  deleteItem() {
    const children = 'Are you sure you want to delete this item?';
    const deleteItem = () => { alert('deleted!'); modalPop(); }
    const buttons = [
      { label: 'Close', onClick: modalPop, defaultButton: true },
      { label: 'Delete', onClick: deleteItem, style: { backgroundColor: 'red' } },
    ];
    modalPush({ children, buttons, onEsc: modalPop });
  }
}
```

API reference:

* **modalPush()**: creates a modal and pushes it on top of the stack:
  - **pars** *ModalPars* (see Modal section)
* **modalPop()**: removes the modal currently at the top of the stack

**ModalPars and ModalButton definitions:**

```js
export type ModalPars = {|
  id?: string,
  title?: string, // modal title displayed to the user
  children?: any, // body of the modal
  buttons?: Array<ModalButton>, // button objects (see below)

  // called when the backdrop
  // (semi-transparent layer highlighting the modal in fron of other
  // page contents) is clicked
  onClickBackdrop?: (ev: SyntheticMouseEvent) => void,

  onEsc?: (ev: SyntheticKeyboardEvent) => void, // called when ESC is pressed

  // merge with the modal's `div` style, e.g. to
  // fix a modal width or background color
  style?: Object,
  zIndex?: number,
|};

export type ModalButton = {|
  left?: boolean, // align button left instead of right (default: false)
  label?: any, // button text or other contents
  defaultButton?: boolean, // will be highlighted and automatically selected when RETURN is pressed
  onClick?: (ev: SyntheticEvent) => void, // `click` handler for the button
  style?: Object, // merged with the button's style
|};
```

## Notifications

![Notifications screenshots](https://raw.githubusercontent.com/guigrpa/giu/master/docs/Notification.png)



**Include the `<Notifications />` component at (or near)
the root level of your React tree**. No props are required.
Here's an example on how you would create a notification:

```js
import { notify, Button } from 'giu';
const NotifExample = () =>
  <Button onClick={() => notify({ msg: 'Idea!', icon: 'lightbulb-o' })}>
    Inspire me!
  </Button>;
```

API reference:

* **notify()**: creates a notification:
  - **pars** *NotificationPars*: notification parameters (see below):
  - **Returns** *string*: notification ID
* **notifRetain()**: marks a notification as retained
  (it will not be automatically deleted, even if it's `sticky`):
  - **id** *string*: ID of the notification to be marked as retained
* **notifDelete()**: deletes a notification:
  - **id** *string*: ID of the notification to be deleted
* **notifDeleteByName()**: deletes a notification:
  - **name** *string*: name of the notification to be deleted

**`NotificationPars` definition:**

```js
export type NotificationType = 'info' | 'success' | 'warn' | 'error';
export type NotificationPars = {|
  sticky?: boolean, // never delete this notification
  timeOut?: number, // time [ms] after which it's deleted [default: 4000]
  id?: string,
  name?: string, // a user-provided name for the notification
  type?: NotificationType, // default: `info`
  icon?: string, // default: `exclamation`
  iconSpin?: boolean,
  title?: string, // highlighted text at the top of the notification
  msg?: string, // notification text
  onClick?: (ev: SyntheticEvent) => void, // `click` handler
  style?: Object, // merged with the outermost `div` style
  noStylePosition?: boolean,
  noStyleShadow?: boolean,
|};
```

## Hint screens

Hint screens give tips on how to use your application, through
a combination of labels (icons, images, text) and dynamically-positioned
arrows. You can show hint screens, for example, when the user reaches a
certain part of your application or performs an action for the first time.

![Hint screen screenshots](https://raw.githubusercontent.com/guigrpa/giu/master/docs/Hints.png)



**Include the `<Hints />` component at (or near)
the root level of your React tree**. No props are required.
Here's an example on how you would define a hint screen and show it
afterwards:

```js
import { hintShow, Button } from 'giu';
class HintExample extends React.Component {
  componentWillMount() {
    hintDefine('hintExample', {
      elements: [
        {
          type: 'LABEL', x: 200, y: 50,
          children: <span>A label with an icon <Icon icon="ambulance" /></span>,
        },
        { type: 'ARROW', from: { x: 200, y: 50 }, to: { x: 50, y: 50 }, counterclockwise: true }
      ],
    });
  }

  render() {
    <Button onClick={() => hintShow('hintExample')}>Show hint</Button>
  }
}
```

The first time you click on the button, the hint screen will appear.
After that, the `hintExample` screen will be disabled (unless `hintReset()`
is called or the `force` argument of `hintShow()` is used, see below).
The list of disabled hint screens is stored in LocalStorage.

API reference:

* **hintDefine()**: defines a hint screen:
  - **id** *string*: ID of the hint to be created
  - **pars** *HintScreenPars* (see below)
* **hintDisableAll()**: disables all hints
* **hintReset()**: clears the list of disabled hints
* **hintShow()**: shows a hint
  - **id** *string*: ID of the hint to be shown
  - **force?** *boolean*: if not enabled, the hint will only be shown if
    hints are enabled (no previous call to `hintDisableAll()` and it has not
    already been shown)
* **hintHide()**: hides the currently shown hint, if any

```js
export type HintScreenPars = {|
  elements?: ElementsWrapper,
  closeLabel?: string, // label of the close button (default: 'Got it!')
  zIndex?: number,
|};
type ElementsWrapper = Array<Element> | (() => Array<Element>);
type Element = HintArrowPars | HintLabelPars;
```

```js
export type HintLabelPars = {|
  type: 'LABEL',
  x: number,
  y: number,
  align?: AlignType, // (default: 'left')
  children?: any, // React elements that comprise the label
  fontSize?: number, // will be initialised by the HintScreen
  style?: Object,
|};
type AlignType = 'left' | 'right' | 'center';
```

```js
export type HintArrowPars = {|
  type: 'ARROW',
  from: Point2, // coordinates, e.g. `{ x: 5, y: 10 }`
  to: Point2, // coordinates
  curveFactor?: number,
  arrowSize?: number,
  arrowAngle?: number,
  counterclockwise?: boolean,
|};
```


## Tiny little things

### Button



An inconspicuous-looking button-in-a-`span`.

```js
type Props = {
  plain?: boolean, // removes most button styles
  children?: any, // button contents (can include `Icon` components, etc.)
  onClick?: (ev: SyntheticMouseEvent) => void,
  disabled?: boolean,
  style?: Object, // merged with the `span` style
  skipTheme?: boolean,

  // Additional props with `mdl` theme
  colored?: boolean,
  primary?: boolean,
  accent?: boolean,
  fab?: boolean,

  // All other props are passed through to the `span` element
};
```

### Icon and Spinner



A wrapper for Font Awesome icons.

```js
type Props = {
  icon: string, // e.g. `ambulance`, `cogs`...
  size?: 'lg' | '2x' | '3x' | '4x' | '5x',
  fixedWidth?: boolean,
  spin?: boolean,
  disabled?: boolean,
  style?: Object, // merged with the `i` element style
  skipTheme?: boolean,
  // All other props are passed through to the `i` element
};
```

`Spinner` is a convenient shortcut for an `Icon` that, well, spins.

### LargeMessage



A simple `div` showing a centered message with a large font size.
Ideal for *No matches found*, *Choose one of the options above*,
that kind of thing. Props:

```js
type Props = {
  children?: any, // contents to be shown
  style?: Object, // merged with the outermost `div` style
  // All other props are passed through to the `div` element
};
```

### Progress



A wrapper for the native HTML `progress` element (with 100% width).
*All props are passed through to the `progress` element.
Remember that an indeterminate progress bar will be shown if you
don't specify the `value` prop (native HTML behaviour).*


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
(for `mouseenter` and `mouseleave`, respectively)
you can attach to any of your base component's DOM elements
(works for multiple elements).
If you attach these handlers to an element with an `id` attribute,
the provided `hovering`
prop will contain the ID of the hovered element (or `null`); otherwise,
just `true` (or `null`).

Specific props received from the parent (all other props are
passed through):

* **onHoverStart?** *HoverEventHandler (see below)*: relays the original event to
  the parent component.
* **onHoverStop?** *HoverEventHandler (see below)*: relays the original event to
  the parent component.

Limitations regarding Flow:

* This HOC accepts both functional and class-based React components.
* For the HOC result to be properly typed, however, the composed component
  must be a class-based React component and have `defaultProps` defined
  (even if empty, e.g. `static defaultProps = {};`).
* If you're passing a functional component, just add a FlowFixMe directive
  in a comment before the call to `hoverable()` so that Flow won't complain.

Additional props passed to the base component:

```js
export type HoverableProps = {
  // `id` element that is hovered (see description above), or `null` if none
  hovering: Hovering,

  // `onMouseEnter` event handler you can attach to your target DOM elements
  onHoverStart: HoverEventHandler,

  // `onMouseLeave` event handler you can attach to your target DOM elements
  onHoverStop: HoverEventHandler,
};
type Hovering = ?(string | number | boolean); // null when nothing is hovered
type HoverEventHandler = (ev: SyntheticEvent) => void;
```


## Helpers

You can find here a wide variety of helper functions, from the very simple (`cancelEvent()`, `flexContainer()`) to the relatively complex (`scrollIntoView()`). This is just an opinionated collection of hopefully useful bits and pieces for building React components.

### DOM node visibility helpers

**isVisible()**

Determines whether the provided node is *fully* visible
in the browser window.

* **node** *?Node*: DOM node; if unspecified, the function returns `false`
* **bcr?** *ClientRect*: bounding client rectangle for `node`; if not specified,
  `getBoundingClientRect()` will be called on `node`
* **Returns** *boolean*

**scrollIntoView()**

Scrolls the node's ancestors as needed in order to make a node fully visible
in the browser window (or at least most of it, if it is too large).
Implemented as a recursive algorithm that is first run
vertically and then horizontally.

* **node** *?Node*: DOM node
* **options?** *object = {}*: the following options are allowed:
  - **topAncestor?** *?Node*: stop the recursive algorithm at this
    ancestor (otherwise stops at the root level or when a `Modal`
    ancestor is reached)

### Style helpers

**flexContainer()**

Provides an inline style object for a Flex container.

* **flexDirection** *('row' | 'column') = 'row'*
* **style?** *Object*: custom style (merged with the Flex style)
* **Returns** *Object*: Flex container style

**flexItem()**

Provides an inline style object for a Flex item.

* **flex** *string|number*: value for the CSS `flex`/`-webkit-flex` attribute
* **style?** *Object*: custom style (merged with the Flex style)
* **Returns** *Object*: Flex item style

**boxWithShadow()**

Provides an inline style object for a slightly rounded shadowed box.

* **style?** *Object*: custom style (merged with the base style)
* **Returns** *Object*: inline style

**isDark() / isLight()**

Determines whether the provided color is perceived as dark or light.
Can be used to decide whether text on this background color should be light
or dark, respectively, for good readability.

* **color** *string|Object*: parameter describing the color (anything that
  can be processed by [tinycolor](https://github.com/bgrins/TinyColor))
* **Returns** *boolean*: whether the color is dark (light)

**darken() / lighten()**

Darkens or lightens a given color by a given percentage.

* **color** *string|Object*: parameter describing the color (anything that
  can be processed by [tinycolor](https://github.com/bgrins/TinyColor))
* **percentage?** *number = 10*: percentage by which the color will be modified
* **Returns** *string*: hex string for the new color, e.g. `#ffaadd`

**addStylesToPage()**

Creates a new `<style>` element containing the provided CSS styles and
attaches it to the page.

* **styles** *string*: CSS styles to be added to the page

### Miscellaneous helpers

**bindAll()**

Binds a list of object methods to the object with `Function#bind()`.
Especially useful for ES6-style React components.

* **self** *Object*: methods will be bound to this object
* **fnNames** *Array<string>*: list of method names

**cancelEvent()**

Calls `preventDefault()` and `stopPropagation()` on the provided event.

* **ev** *?SyntheticEvent*: event to be cancelled

**preventDefault()**

Calls `preventDefault()` on the provided event.

* **ev** *?SyntheticEvent*: event for which default behaviour is to be prevented

**stopPropagation()**

Calls `stopPropagation()` on the provided event.

* **ev** *?SyntheticEvent*: event for which default behaviour is to be prevented

**cancelBodyScrolling()**

`onWheel` event handler that can be attached to a scroller DOM node,
in order to prevent `wheel` events to cause document scrolling when
the scroller reaches the top/bottom of its contents.

* **ev** *SyntheticWheelEvent*: `wheel` event

**windowHeightWithoutScrollbar() / windowWidthWithoutScrollbar()**

Provides the inner height (width) of the window
excluding scrollbars (if any).

* **Returns** *number*: inner height (width) in pixels

**simplifyString()**

Generates a new version of a string with the following changes:
all lowercase, no diacritics, Unicode-normalized (NFKD). Useful
for (simplistic) sorting and filtering. A quick'n'dirty
collation helper.

* **str** *string*: string to be processed
* **Returns** *string*: simplified version of the input string

**getScrollbarWidth()**

Measures and returns the scrollbar width.

Measurements are taken lazily when first requested.
On window `resize`, it is measured again (zooming causes
the reported widths to change, and the `resize` event is a
reliable way to detect zooming).
Note that the returned value might be zero,
e.g. on OS X with overlaid scrollbars.

* **Returns** *?number*: scrollbar width in pixels


## [Changelog](https://github.com/guigrpa/giu/blob/master/CHANGELOG.md)


## License (MIT)

Copyright (c) [Guillermo Grau Panea](https://github.com/guigrpa) 2016-present

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
