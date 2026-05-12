# colinormsby.github.io

Personal portfolio and research pages for Colin Ormsby.

## Adding a new HTML page

Every new `.html` file must include the GA4 tracking snippet in its `<head>`.
Copy it from `_ga.html` or paste it directly:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-F01KF3XMZK"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-F01KF3XMZK');
</script>
```

Place it as the **first child of `<head>`**, before any other tags.

## Pages

| File | Description |
|------|-------------|
| `index.html` | Main portfolio / landing page |
