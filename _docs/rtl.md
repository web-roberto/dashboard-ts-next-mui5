---
title: RTL
---

# RTL

Text direction is extremely important for cultures where "right-to-left" writing is used. The app
has this functionality implemented.

## How it works

The wrapper component, `RTL`, is necessary to be above the app content in the tree. The component
changes the document direction, and appends a `stylis` plugin which converts all component styles to
mirror the margins and paddings.

```jsx
// src/pages/_app.js
const App = (props) => {
  const { Component, pageProps } = props;
    
  return (
    <RTL direction="rtl">
      <Component {...pageProps} />
    </RTL>
  );
};
```

`direction` prop can be `"ltr"` or `"rtl"`. When using `"ltr"` the component simply renders the
children, without affecting the styling.

## Removing RTL support

If you do not need to support RTL, you can remove it by following the next steps.

1. Remove `RTL` component from `src/components`.
2. Remove `RTL` component import and usage from `App` component.
2. Uninstall the `@emotion/cache` and`stylis-plugin-rtl` dependencies.
