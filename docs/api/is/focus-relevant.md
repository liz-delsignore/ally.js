---
layout: doc-api.html
tags: argument-list
---

# ally.is.focusRelevant

Determines if an element has any relevance to focus management.


## Description

This module is a pre-filter for [`ally.is.focusable`](focusable.md), [`ally.is.tabbable`](tabbable.md), [`ally.is.onlyTabbable`](only-tabbable.md) and [`ally.get.focusRedirectTarget`](../get/focus-redirect-target.md). Elements may be considered focus-relevant, even though they do not in fact be focusable, tabbable, only-tabbable or redirect focus given their current conditions. But any element that is focusable, tabbable, only-tabbable or redirects focus *is* focus-relevant.

Consult the data tables [what browsers consider focusable](../../data-tables/focusable.md) and [what ally.js fails to consider focusable](../../data-tables/focusable.is.md) to learn how HTML elements behave.


## Usage

```js
var element = document.getElementById('victim');
var isFocusRelevant = ally.is.focusRelevant(element);
```

### Arguments

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| element | [`HTMLElement`](https://developer.mozilla.org/en/docs/Web/API/HTMLElement) | *required* | The Element to test. |

The underlying rules can also be accessed in the [`options` argument style](../concepts.md#Single-options-argument) by calling `ally.is.focusRelevant.rules(options)`:

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| context | [`<selector>`](../concepts.md#Selector) | *required* | The element to examine. The first element of a collection is used. |
| except | [`<focus identification exception>`](../concepts.md#Focus-identification-exceptions) | `{}` | The Element to test. |

### Returns

Boolean, `true` if the element is focus relevant.

### Throws

[`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) if `element` argument is not of type `HTMLElement`.


## Examples


## Changes

* Since `v1.1.0` the `<embed>` and `<keygen>` elements are considered focus-relevant, but *not* focusable.
* Since `v1.1.0` the `element.prototype.matches` polyfill is re-applied to allow elements from other documents (e.g. from an iframe).
* Since `v1.1.0` the `<object>` element properly distinguishes between SVG and SWF content.
* Since `v1.1.0` elements using Flexbox layout are properly identified in IE10 and IE11.
* Since `v1.1.0` the ShadowDOM hosts are considered focus-relevant, but *not* focusable.
* Since `v1.1.0` scrollable containers are properly identified in Internet Explorer.
* Since `v1.1.0` all `<area>` elements are considered focus-relevant.
* Since `v1.1.0` every element that is either focusable, keyboard focusable, only tabbable or redirects focus is considered focus-relevant.
* Since `v1.1.0` exceptions can be passed to `ally.is.focusRelevant.rules(options)`.
* Since `v1.1.0` IE9 properly resolves SVG links (`<a xlink:href="…">`).


## Notes

* **NOTE:** The `<body>` element may mistakenly considered focusable, because it is the default activeElement if no other element has focus - but it is not focusable, unless made so by adding the `tabindex` attribute.
* **NOTE:** Because the `<keygen>` element is poorly supported, practically never used and has seen [intent to deprecate](https://groups.google.com/a/chromium.org/forum/m/#!msg/blink-dev/pX5NbX0Xack/kmHsyMGJZAMJ), ally considers all `<keygen>` elements focus-relevant but *not* focusable.
* **NOTE:** Because the behavior of the `<embed>` element depends on the content type and browser plugin, ally considers all `<embed>` elements focus-relevant but *not* focusable.
* **NOTE:** Internet Explorer 9 supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language) (which was dropped in IE10 in favor of SVG), which allows linking using the `href` attribute. Ally.js does *not* understand VML because it does not exist in modern browsers anymore.
* **WARNING:** Firefox and Internet Explorer cannot focus `SVGElement`s by script, thus no SVG element is considered focusable, see [Gecko 1116966](https://bugzilla.mozilla.org/show_bug.cgi?id=1116966)
* **WARNING:** WebKit and Blink make any `SVGElement` focusable that has a `focus` event listener attached, see [Blink 445798](https://code.google.com/p/chromium/issues/detail?id=445798), [WebKit 140024](https://bugs.webkit.org/show_bug.cgi?id=140024)


## Related resources

* [`ally.is.focusable`](focusable.md) tests focus-relevant elements if they're also visible and not disabled
* [`ally.is.tabbable`](tabbable.md) tests elements if they're keyboard focusable
* [`ally.is.validTabindex`](valid-tabindex.md) is used to verify the element's `tabindex` value is valid
* [`ally.query.focusable`](../query/focusable.md) finds focusable elements in the DOM

* [What Browsers Consider Focusable](../../data-tables/focusable.md)
* [What ally.js fails to consider focusable](../../data-tables/focusable.is.md)


## Contributing

* [module source](https://github.com/medialize/ally.js/blob/master/src/is/focus-relevant.js)
* [document source](https://github.com/medialize/ally.js/blob/master/docs/api/is/focus-relevant.md)
* [unit test](https://github.com/medialize/ally.js/blob/master/test/unit/is.focus-relevant.test.js)

