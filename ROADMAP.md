# Roadmap

* Use plain old CSS stylesheets (customisable!), instead of element CSS:
    * Clean up examples, using CSS
        * Review MDL
        * Also fix index.js

        * Fix manual sorting in "CustomSortPaginateExample"
        * Fix ghost image while dragging, with custom CSS. Also figure out about "sortableHandle"'s need to have inline styles. Try bumping sortable-hoc
    * Check Flow errors
    * Remove flexContainer, flexItem if possible
    * [ ] Check DataTable behaviour on iOS, especially dragging

* **Bugs**
    * `[Intervention] Unable to preventDefault inside passive event listener due to target being treated as passive. See <URL>` while mouse-wheeling in a Custom Select
    * Main docs: inline textareas: misaligned
    * Android Select: when item is selected, it retains focus
* Main docs:
    * Explain that analogue picker is not supported on iOS
    * Update accent color explanation
    * Talk about the theme
* Make analogue picker impossible also on Android
* **More tests on Android**
* [ ] Think: how do we revert all fields in a datatable record? (try to update the example page `datatable.js`)
* Use Portals?
* Use Hooks?
* [ ] Update Font Awesome (later)

* [ ] Add copy&paste to RangePicker
* [ ] _Bug_ ListPicker on Windows incorrectly aligns (vertically) items and shortcuts (it _is_ correct in the main doc page)

Long-term:

* [ ] Combo input (free-text, typeahead, list)
* [ ] ListPicker: if not focused, it should not scrollintoview! But don't use fFocused (draws a border). Add a new `fParentFocused` and use it for this purpose. Dropdownmenus should stop scrolling also if keyboard shortcuts are used
* [ ] Focus delegation?
* [ ] Multi-selection ListPicker
* [ ] Drag and drop
