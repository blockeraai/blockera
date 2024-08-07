/**
 * Internal dependencies
 */
import blockEditorLtr from './block-editor-ltr.lazy.scss';
import blockEditorRtl from './block-editor-rtl.lazy.scss';
import blockLibraryLtr from './block-library-ltr.lazy.scss';
import blockLibraryRtl from './block-library-rtl.lazy.scss';
import componentsLtr from './components-ltr.lazy.scss';
import componentsRtl from './components-rtl.lazy.scss';
import formatLibraryLtr from './format-library-ltr.lazy.scss';
import formatLibraryRtl from './format-library-rtl.lazy.scss';
import editSiteLtr from './edit-site-ltr.lazy.scss';
import editSiteRtl from './edit-site-rtl.lazy.scss';

/**
 * Stylesheets to lazy load when the story's context.componentId matches the
 * componentIdMatcher regex.
 *
 * To prevent problematically overscoped styles in a package stylesheet
 * from leaking into stories for other packages, we should explicitly declare
 * stylesheet dependencies for each story group.
 */
const CONFIG = [
	{
		componentIdMatcher: /^playground-/,
		ltr: [componentsLtr, blockEditorLtr, blockLibraryLtr, formatLibraryLtr],
		rtl: [componentsRtl, blockEditorRtl, blockLibraryRtl, formatLibraryRtl],
	},
	{
		componentIdMatcher: /^blockeditor-/,
		ltr: [componentsLtr, blockEditorLtr],
		rtl: [componentsRtl, blockEditorRtl],
	},
	{
		componentIdMatcher: /^editsite-/,
		ltr: [componentsLtr, editSiteLtr],
		rtl: [componentsRtl, editSiteRtl],
	},
	{
		componentIdMatcher: /^components-/,
		ltr: [componentsLtr],
		rtl: [componentsRtl],
	},
];

export default CONFIG;
