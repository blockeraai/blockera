/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

const StoryDataContext = createContext({
	storyValue: '',
	setStoryValue: () => {},
});

export { StoryDataContext };
