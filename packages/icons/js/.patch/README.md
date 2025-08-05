# Icon Library Missing Icons Utility

This utility helps identify icons that are exported from icon libraries but missing from their corresponding search data files.

## Functions

### `getMissingIcons(libraryId: string): Array<string>`

Gets missing icons for a specific library.

**Parameters:**
- `libraryId` - The library ID (e.g., 'wp', 'blockera', 'cursor', 'social')

**Returns:**
- Array of missing icon names that need to be added to search data

**Example:**
```javascript
import { getMissingIcons } from './.patch/icons';

const missingIcons = getMissingIcons('wp');
console.log(missingIcons); // ['icon-name-1', 'icon-name-2']
```

### `getAllMissingIcons(): { [string]: Array<string> }`

Gets missing icons for all libraries.

**Returns:**
- Object with library IDs as keys and arrays of missing icon names as values

**Example:**
```javascript
import { getAllMissingIcons } from './.patch/icons';

const allMissing = getAllMissingIcons();
console.log(allMissing);
// {
//   wp: ['icon-1', 'icon-2'],
//   blockera: ['icon-3'],
//   cursor: [],
//   social: ['icon-4']
// }
```

### `getMissingIconsDetails(libraryId: string): Array<Object>`

Gets detailed information about missing icons including their original component names and suggested search data.

**Parameters:**
- `libraryId` - The library ID

**Returns:**
- Array of objects with icon information:
  - `iconName`: The kebab-case icon name
  - `originalComponentName`: The original React component name
  - `suggestedSearchData`: Suggested search data entry

**Example:**
```javascript
import { getMissingIconsDetails } from './.patch/icons';

const details = getMissingIconsDetails('social');
console.log(details);
// [
//   {
//     iconName: 'word-press',
//     originalComponentName: 'WordPress',
//     suggestedSearchData: {
//       iconName: 'word-press',
//       title: 'WordPress',
//       library: 'social',
//       tags: []
//     }
//   }
// ]
```

### `generateSearchDataTemplate(libraryId: string): string`

Generates a JSON template for missing icons that can be added to search data.

**Parameters:**
- `libraryId` - The library ID

**Returns:**
- JSON string with suggested search data entries

**Example:**
```javascript
import { generateSearchDataTemplate } from './.patch/icons';

const template = generateSearchDataTemplate('social');
console.log(template);
// [
//   {
//     "iconName": "word-press",
//     "title": "WordPress",
//     "library": "social",
//     "tags": [
//       // Add relevant tags here
//     ]
//   }
// ]
```

### `logMissingIcons(libraryId?: string): void`

Logs missing icons information to console.

**Parameters:**
- `libraryId` - The library ID (optional, if not provided logs all libraries)

**Example:**
```javascript
import { logMissingIcons } from './.patch/icons';

// Log missing icons for specific library
logMissingIcons('wp');

// Log missing icons for all libraries
logMissingIcons();
```

## Usage Examples

### Check a specific library
```javascript
import { getMissingIcons, logMissingIcons } from './.patch/icons';

// Get missing icons for WordPress library
const missingIcons = getMissingIcons('wp');
console.log(`WordPress has ${missingIcons.length} missing icons`);

// Log detailed information
logMissingIcons('wp');
```

### Check all libraries
```javascript
import { getAllMissingIcons, logMissingIcons } from './.patch/icons';

// Get all missing icons
const allMissing = getAllMissingIcons();

// Log summary for all libraries
logMissingIcons();
```

### Generate search data templates
```javascript
import { generateSearchDataTemplate } from './.patch/icons';

// Generate template for missing icons
const template = generateSearchDataTemplate('social');
console.log('Add this to search-data.json:');
console.log(template);
```

## How it works

1. **Imports all libraries**: Each library's icons and search data are imported
2. **Compares exports with search data**: Finds icons that are exported but not in search data
3. **Handles naming conventions**: Accounts for the kebab-case conversion done by `getIconKebabId`
4. **Provides detailed information**: Includes original component names and suggested search data

## Adding missing icons

When you find missing icons:

1. Use `getMissingIconsDetails()` to get detailed information
2. Use `generateSearchDataTemplate()` to get a JSON template
3. Add the missing entries to the appropriate `search-data.json` file
4. Fill in appropriate tags for each icon
5. Run the test again to verify the fix

## Supported Libraries

- `wp` - WordPress icons
- `blockera` - Blockera branding icons
- `cursor` - Cursor icons
- `social` - Social media icons 