# BlockBase Component

## Overview

`BlockBase` is the core wrapper component for WordPress block editor blocks in the Blockera plugin. It provides a comprehensive foundation for block editing functionality, including state management, style handling, block features integration, inner blocks support, and inspector controls.

## Purpose

The `BlockBase` component serves as the central orchestrator for block editing operations, providing:

- **State Management**: Manages block attributes, states, and variations
- **Style Engine Integration**: Handles block styles, CSS generation, and custom CSS
- **Block Features**: Integrates general and custom block features
- **Inner Blocks Support**: Manages nested block structures and states
- **Inspector Controls**: Provides UI controls for block configuration
- **Error Handling**: Implements error boundaries for graceful error recovery
- **Performance Optimization**: Uses memoization and debouncing for attribute updates

## Component Signature

```typescript
export const BlockBase: ComponentType<any> = (
  _props: Object
): Element<any> | null
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | The block type name (e.g., 'core/paragraph') |
| `clientId` | `string` | Unique identifier for the block instance |
| `attributes` | `Object` | Current block attributes from WordPress |
| `setAttributes` | `Function` | WordPress callback to update block attributes |
| `children` | `ReactNode` | The block's edit component children |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `additional` | `Object` | `{}` | Additional block configuration (see Additional Object below) |
| `defaultAttributes` | `Object` | `{}` | Default attributes for the block |
| `originDefaultAttributes` | `Object` | `{}` | Original default attributes before modifications |
| `insideBlockInspector` | `boolean` | `true` | Whether the block is rendered inside the inspector panel |
| `...props` | `Object` | - | Additional props passed to child components |

### Additional Object Structure

```typescript
{
  activeTab?: string;                    // Active tab in inspector ('style', 'content', etc.)
  blockFeatures?: Object;                 // Custom block features to merge with general features
  availableBlockStates?: Object;          // Available block states (hover, focus, etc.)
  blockeraInnerBlocks?: Object;           // Inner blocks configuration
  edit?: ComponentType;                   // Custom edit component
}
```

## Key Features

### 1. State Management

The component manages multiple layers of state:

- **Local State**: React state for attributes (`state`), notices, tabs, and active status
- **WordPress Data Stores**: Integrates with `blockera/extensions`, `core/blocks`, and `core/block-editor` stores
- **Ref-based Tracking**: Uses `attributesRef` to track attribute changes without causing re-renders

### 2. Attribute Synchronization

Implements a debounced synchronization mechanism:

- Local state updates immediately for responsive UI
- Changes are debounced (100ms) before syncing to WordPress
- Handles style changes in local state when `insideBlockInspector` is false
- Uses shallow equality checks to prevent unnecessary updates

### 3. Block States

Supports multiple block states:

- **Master States**: Normal, hover, focus, active states for the main block
- **Inner Block States**: Separate states for nested blocks
- **Breakpoint States**: Responsive states based on device type
- **State Bootstrap**: Automatically bootstraps state definitions on mount

### 4. Block Variations

- Detects and manages block variations (transform variations)
- Tracks active block variation
- Provides variation information to child components

### 5. Style Engine

- Generates block-specific CSS selectors
- Handles custom CSS with proper selector scoping
- Integrates with the style engine for dynamic styles
- Cleans up unused styles automatically

### 6. Block Features

- Merges general block features with custom features
- Provides inline styles for block features
- Renders contextual toolbar components
- Supports feature-specific functionality

### 7. Inner Blocks Support

- Detects and manages inner blocks
- Handles virtual blocks (non-rendered blocks)
- Supports nested block states
- Provides inner block information to child components

### 8. Error Boundaries

- Wraps style rendering in an error boundary
- Provides fallback UI when errors occur
- Reports errors with context information

## Hooks Used

### WordPress Data Hooks

- `useSelect`: Retrieves data from WordPress stores
  - `blockera/extensions`: Block extension data, current block, states
  - `core/blocks`: Block type information, variations
  - `core/block-editor`: Block attributes
  - `blockera/editor`: Device type information

- `dispatch`: Dispatches actions to WordPress stores
  - `blockera/extensions`: Updates current block, states

### Custom Hooks

- `useAttributes`: Manages attribute changes and validation
- `useInnerBlocksInfo`: Provides inner blocks information
- `useCalculateCurrentAttributes`: Calculates current attributes based on state
- `useBlockFeatures`: Integrates block features functionality
- `useCleanupStyles`: Cleans up unused styles
- `useGlobalStylesPanelContext`: Accesses global styles panel context

### React Hooks

- `useState`: Local component state
- `useRef`: Reference tracking for attributes
- `useMemo`: Memoized computed values
- `useCallback`: Memoized callbacks
- `useEffect`: Side effects and synchronization

## Component Structure

```
BlockBase
├── BlockEditContextProvider (provides context to children)
│   ├── InspectorControls (when insideBlockInspector === true)
│   │   ├── SideEffect
│   │   └── SlotFillProvider
│   │       ├── BlockPartials
│   │       └── BlockFillPartials
│   │
│   ├── SlotFillProvider (when insideBlockInspector === false)
│   │   ├── BlockPartials
│   │   └── BlockFillPartials
│   │
│   └── ErrorBoundary (when insideBlockInspector === true)
│       ├── StylesWrapper
│       │   └── BlockStyle (via Fill)
│       ├── ContextualToolbarComponents
│       ├── BlockFeaturesInlineStyles
│       └── children (block edit component)
```

## Rendering Logic

### Conditional Rendering

The component conditionally renders based on `insideBlockInspector`:

1. **When `insideBlockInspector === true`**:
   - Renders `InspectorControls` with block configuration UI
   - Renders style wrapper with error boundary
   - Renders contextual toolbar components
   - Renders block features inline styles
   - Renders block children

2. **When `insideBlockInspector === false`**:
   - Renders `SlotFillProvider` for partials
   - Does not render inspector controls or style wrapper
   - Used for blocks rendered outside the inspector panel

### State-Based Rendering

- Block states determine which attributes are active
- Breakpoint determines responsive behavior
- Inner block state affects nested block rendering
- Block variations affect available options

## Key Functions

### `masterIsNormalState()`

Determines if the master block is in normal state at base breakpoint.

```typescript
const masterIsNormalState = useCallback(
  (): boolean =>
    'normal' === currentState && isBaseBreakpoint(getDeviceType()),
  [currentState, getDeviceType]
);
```

### `isNormalState()`

Determines if the current block (master or inner) is in normal state.

```typescript
const isNormalState = useCallback((): boolean => {
  if (isInnerBlock(currentBlock)) {
    return (
      'normal' === currentInnerBlockState &&
      isBaseBreakpoint(getDeviceType())
    );
  }
  return masterIsNormalState();
}, [currentBlock, currentInnerBlockState, getDeviceType, masterIsNormalState]);
```

### `setAttributes(value)`

Updates local state and ref for attributes.

```typescript
const setAttributes = (value: any) => {
  attributesRef.current = value;
  setState(value);
};
```

### `getAttributes(key?)`

Retrieves attributes, optionally filtered by key.

```typescript
const getAttributes = (key: string = ''): any => {
  if (key && sanitizedAttributes[key]) {
    return sanitizedAttributes[key];
  }
  return sanitizedAttributes;
};
```

### `updateBlockEditorSettings(key, value)`

Updates block editor settings (current block, state, style variation).

```typescript
const updateBlockEditorSettings: UpdateBlockEditorSettings = useCallback(
  (key: string, value: any): void => {
    switch (key) {
      case 'current-block':
        setCurrentBlock(value);
        break;
      case 'current-state':
        if (isInnerBlock(currentBlock)) {
          return setInnerBlockState(value);
        }
        setCurrentState(value);
        break;
      case 'current-block-style-variation':
        setCurrentBlockStyleVariation(value);
        break;
    }
  },
  [currentBlock, setCurrentBlock, setCurrentState, setInnerBlockState, setCurrentBlockStyleVariation]
);
```

## Data Flow

### Attribute Flow

1. **Initial Load**: `blockAttributes` → `state` → `attributes` → `sanitizedAttributes`
2. **User Changes**: User input → `setAttributes` → `state` → debounced sync → `setBlockAttributes`
3. **External Changes**: `blockAttributes` prop change → `useEffect` → `setAttributes` → `state` update
4. **Style Changes**: When `insideBlockInspector === false`, changes sync to local state via `handleOnChangeStyleInLocalState`

### State Flow

1. **Block Selection**: User selects block → `setCurrentBlock` → `currentBlock` updates
2. **State Change**: User changes state → `updateBlockEditorSettings('current-state')` → store update → `currentState` updates
3. **Breakpoint Change**: User changes device → `getDeviceType()` → responsive behavior

## Performance Optimizations

### Memoization

- **`args`**: Memoized arguments object for compatibility checks
- **`attributes`**: Memoized compatible attributes
- **`sanitizedAttributes`**: Memoized sanitized attributes
- **`availableInnerStates`**: Memoized inner block states
- **`masterIsNormalState`**: Memoized callback
- **`isNormalState`**: Memoized callback
- **`updateBlockEditorSettings`**: Memoized callback

### Debouncing

- Attribute updates are debounced by 100ms to prevent excessive WordPress store updates
- Style changes are debounced when outside inspector

### Shallow Equality Checks

- Uses `isShallowEqual` to prevent unnecessary re-renders and updates
- Compares `blockAttributes` with `state` before syncing

## Context Provided

The component wraps children in `BlockEditContextProvider`, providing:

- Block metadata (name, clientId)
- Attribute management functions
- Current state information
- Breakpoint information
- Inner blocks information
- Block variation information
- Tab management
- Editor settings update function
- Block component reference

## Error Handling

### Error Boundary

The component wraps style rendering in an `ErrorBoundary`:

- Catches errors during style generation
- Renders `ErrorBoundaryFallback` component
- Provides error context and reporting
- Falls back to `BlockStyle` component

### Error States

- `notice`: Stores error notices
- `isReportingErrorCompleted`: Tracks error reporting status

## Block Props Passed to Children

The component passes comprehensive block props to child components (matching WordPress block edit function props):

```typescript
{
  name: string;
  activeBlockVariation: string;
  clientId: string;
  supports: Object;
  className: string;
  attributes: Object;              // sanitizedAttributes
  setAttributes: Function;
  defaultAttributes: Object;
  currentAttributes: Object;       // calculated for current state
  currentTab: string;
  currentBlock: string;
  currentState: string;
  setCurrentTab: Function;
  currentBreakpoint: string;
  blockeraInnerBlocks: Object;
  currentInnerBlockState: string;
  handleOnChangeAttributes: Function;
  additional: Object;
  currentStateAttributes: Object;
  ...props                         // additional props from parent
}
```

## Usage Example

```jsx
import { BlockBase } from '@blockera/editor/extensions/components';

function MyBlockEdit({ attributes, setAttributes, clientId, ...props }) {
  return (
    <BlockBase
      name="my-plugin/my-block"
      clientId={clientId}
      attributes={attributes}
      setAttributes={setAttributes}
      defaultAttributes={defaultAttributes}
      additional={{
        activeTab: 'style',
        blockFeatures: customBlockFeatures,
        availableBlockStates: customStates,
      }}
      insideBlockInspector={true}
      {...props}
    >
      <div className="my-block-edit">
        {/* Block edit UI */}
      </div>
    </BlockBase>
  );
}
```

## Related Components

- **BlockEditContextProvider**: Provides block editing context
- **BlockPartials**: Renders block partials via SlotFill
- **BlockFillPartials**: Renders fillable block partials
- **BlockStyle**: Generates and applies block styles
- **StylesWrapper**: Wraps style generation with error handling
- **SideEffect**: Handles side effects for block variations

## Dependencies

### External

- `react-error-boundary`: Error boundary component
- `@wordpress/components`: SlotFillProvider, Fill, InspectorControls
- `@wordpress/data`: State management (useSelect, dispatch)
- `@wordpress/block-editor`: InspectorControls
- `@wordpress/element`: React hooks
- `@wordpress/is-shallow-equal`: Shallow equality checking

### Internal

- `@blockera/features-core`: Block features system
- `@blockera/utils`: Utility functions (cloneObject, mergeObject)
- `@blockera/blocks-core`: General block features
- Style engine components and hooks
- Block extension hooks and utilities

## Notes

- The component uses Flow type annotations (`@flow`)
- Some code is commented out (StrictMode, BlockPortals) for future use
- The component handles both master blocks and inner blocks
- Supports virtual blocks (non-rendered blocks)
- Integrates with WordPress block variations system
- Custom CSS selector replacement ensures proper scoping

## Future Considerations

- StrictMode wrapper (currently commented)
- Block portals for advanced rendering (currently commented)
- Additional performance optimizations
- Enhanced error recovery mechanisms
