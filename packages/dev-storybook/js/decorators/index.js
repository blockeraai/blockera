/**
 * Decorators dependencies
 */
// import { WithRTL } from './with-rtl';
import { WithTheme } from './with-theme';
import { WithGlobalCSS } from './with-global-css';
import { WithMemoryRouter } from './with-memory-router';
import { WithMarginChecker } from './with-margin-checker';
import { StoryDataContext } from './with-story-data/context';
import { WithInspectorStyles } from './with-inspector-styles';
import { WithMaxWidthWrapper } from './with-max-width-wrapper';
import { PopoverContextData } from './with-popover-data/context';
import { WithBlockEditContextProvider } from './with-block-edit-context';
import { WithStoryContextProvider } from './with-story-data/with-story-data-decorator';
import { WithPopoverDataProvider } from './with-popover-data/with-popover-data-provider';

export default {
	StoryDataContext,
	PopoverContextData,
	WithInspectorStyles,
	WithPopoverDataProvider,
	WithStoryContextProvider,
	WithBlockEditContextProvider,
	SharedDecorators: [
		// WithRTL,
		WithTheme,
		WithGlobalCSS,
		WithMemoryRouter,
		WithMarginChecker,
		WithMaxWidthWrapper,
	],
};
