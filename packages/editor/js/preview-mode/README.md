# Blockera Preview Mode

This feature adds an in-editor preview capability to the WordPress block editor, allowing users to preview their content in an iframe overlay without leaving the editor.

## Features

- **In-editor preview**: Preview content in an iframe overlay instead of opening a new tab
- **Device-responsive**: Automatically follows WordPress device preview sizing (Desktop/Tablet/Mobile)
- **Toggle behavior**: Click the preview button again to close the overlay
- **ESC to close**: Press Escape key to close the overlay
- **Ctrl/Cmd + Click**: Opens preview in a new tab (preserves native behavior)
- **Navigation blocking**: Clicking links inside the preview does not navigate away
- **Loading state**: Shows a spinner while the preview loads

## Architecture

### File Structure

```
preview-mode/
├── index.tsx                # Plugin registration + main component
├── components/
│   ├── PreviewButton.tsx    # Header button with portal mounting
│   └── PreviewOverlay.tsx   # Iframe overlay with device sizing
├── hooks/
│   └── useBreakpoint.ts     # Hook for breakpoint detection
├── styles.css               # Scoped CSS styles
└── README.md                # This documentation
```

### Preview URL Sourcing

Preview URL functionality is provided by the shared `useCurrentEntity` hook (from `hooks/` module):

1. **Selector**: `getEditedPostPreviewLink()` from `core/editor` store
2. **Action**: `__unstableSaveForPreview()` to save and get fresh preview URL
3. **Admin bar hidden**: Appends `?blockera-hide-admin-bar=1` to the URL

```js
// From hooks/useEntity.ts (via useCurrentEntity)
const { getPreviewUrl, isSaveable, isViewable, hasValidViewUrl } = useCurrentEntity();
const url = await getPreviewUrl();
```

### Admin Bar Hiding (PHP)

The admin bar is hidden using WordPress's `show_admin_bar` filter in `Blockera_Preview_Button` class:

- **Query arg**: `blockera-hide-admin-bar=1`
- **Filter**: `show_admin_bar` returns `false` when arg is present
- **Fallback CSS**: Inline styles as backup to ensure admin bar is hidden
- **Body class**: Adds `blockera-preview-iframe` class for additional styling hooks

### Overlay Mounting

The overlay is mounted using React Portal into the editor skeleton:

- **Mount target**: `.interface-interface-skeleton__editor`
- **Position**: `position: absolute; top: 64px; left: 0; right: 0; bottom: 0;`
- **Z-index**: `100000` (above all editor UI)
- **Padding**: `50px` around the iframe container

```js
// From PreviewOverlay.js
createPortal(
  <div className="blockera-preview-overlay">...</div>,
  document.querySelector('.interface-interface-skeleton__editor')
);
```

### Device Sizing

The iframe follows WordPress's device preview system:

| Device  | Width  | Height |
|---------|--------|--------|
| Desktop | 100%   | 100%   |
| Tablet  | 780px  | 1024px |
| Mobile  | 360px  | 768px  |

Device type is read from the `core/editor` store using `getDeviceType()` selector.

### Navigation Blocking

When the iframe loads, a capturing click handler is attached to prevent navigation:

```js
iframeDoc.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (link && link.href) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);
```

Scrolling still works because only link clicks are blocked.

## Button Placement

The preview button is inserted in the editor header settings area using the SlotFill pattern:

- **Target container**: `.editor-header__settings` (with fallbacks)
- **Insertion method**: Uses `Fill` component to render in shared `.blockera-elements-editor-header-settings` container
- **Order**: Renders with `order={2}` (after zoom control)

## Usage

The feature is automatically active in both:
- **Post Editor** (`wp-admin/post.php`)
- **Site Editor** (`wp-admin/site-editor.php`)

### User Interactions

| Action | Result |
|--------|--------|
| Click preview button | Opens preview overlay |
| Click preview button again | Closes overlay (toggle) |
| Press ESC | Closes overlay |
| Ctrl/Cmd + Click | Opens preview in new tab |
| Click link in preview | Blocked (no navigation) |
| Scroll in preview | Works normally |

## Dependencies

- `@wordpress/element` - React utilities
- `@wordpress/components` - UI components (Button, Spinner, Tooltip)
- `@wordpress/data` - Data store access
- `@wordpress/editor` - Editor store selectors/actions
- `@wordpress/core-data` - Core data store
- `@wordpress/i18n` - Internationalization
- `@wordpress/icons` - Icon components
- `@wordpress/plugins` - Plugin registration

