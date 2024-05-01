/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

export const StoryDataContext = createContext({
	storyValue: '',
	setStoryValue: () => {},
});
