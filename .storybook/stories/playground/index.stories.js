/**
 * Internal dependencies
 */
import { Playground } from "@publisher/core-storybook";

/**
 * Plugin dependencies
 */
import { sharedDefault } from "../../../../../src/blocks";

export default {
	title: "Playground/Block Editor",
	component: Playground,
};

export const SharedStory = sharedDefault;
