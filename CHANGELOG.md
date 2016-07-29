# Changelog

*[M]: major change; [m]: minor change*

## 0.7.1 (July 29, 2016)

* [m] Modal: allow customising button style.

## 0.7.0 (July 28, 2016)

* [M] Bump deps, including React (to 15.2.x)
* [m] ColorInput: initial values can be in any format supported by [tinycolor2](https://github.com/bgrins/TinyColor). Note that v1.4.1 of this library is aligned to CSS 4 color specification RRGGBBAA (previously AARRGGBB). In any case, the values provided by this input are in the browser-ready `rgba(r, g, b, a)` format
* [m] Input HOC: allow simultaneously setting a new value prop and reverting to it
* **Bugfix**: Prevent bubbling `click` events from blurring components within Modals.
* **Bugfix**: Fix ColorInput's vertical positioning when inline.

## 0.6.0 (June 8, 2016)

* [M] **Add iOS support**, with some limitations, most notably:
    - When the user focuses on an input *inside a Modal*, the browser scrolls to the top of the page. This is a known issue with Mobile Safari that appeared years ago (!!).
    - The `FOCUS` and `BLUR` commands on Inputs do not work correctly in Mobile Safari. Apparently `focus()` can only be called from within a `click` event handler, but I couldn't find the way to trigger the `click` handler programmatically.
    - *Any suggestion on how to solve these issues is welcome!*
* [M] DateInput: when the `lang` prop is used, the component changes its internal value whenever `lang` changes, to reflect the new applicable format.
* LargeMessage: allow style customisation.
* Bugfixes:
    - SelectCustom: fix bug where keyboard shortcuts were unregistered when props changed.
    - SelectCustom: fix value provided to the `onClickItem` handler.
    - ListPicker: don't highlight the Select's current value when hovering a separator.
    - HOCs: fix `displayName`.

## 0.5.0 (May. 25, 2016)

* [M] **Add SSR support**:
    - Prevent access to `document` or `window` at the server side, at least in unsafe parts (not event handlers, module initialisation, etc.)
    - Initialise Textarea input's height to a very low value, so that it does not render in SSR very large and then shrink in the browser

## 0.4.2 (May. 25, 2016)

* **Bugfix**: Reposition floats for inputs in modals.

## 0.4.1 (May. 22, 2016)

* **Bugfix**: Execute `FOCUS` and `BLUR` commands asynchronously, so that owner of Input component doesn't find a `null` ref in a `focus`/`blur` handler.
* **Bugfix**: Correct validation error colors (compare against last validated value).
* **Bugfix**: Correct repositioning of error message floats when anchor resizes.
* **Bugfix**: Correct pass/stop behaviour for ESC/RETURN keys within modals.
* Add `stopPropagation()` helper function.

## 0.4.0 (May. 22, 2016)

* **Breaking**: Hints: merge `arrows` and `labels` props into a single `elements` prop.
* **Bugfix**: Hints: upon `hintShow()`, only add a hint screen to the disabled list if not already there.

## 0.3.1 (May. 21, 2016)

* Style override for both SelectNative and SelectCustom is now called the same: `style`.
* Documentation tweaks.

## 0.3.0 (May. 20, 2016)

* First public release.
