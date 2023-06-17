/**
 * Internal dependencies
 */
import { BackgroundField } from '../field';
import { BlockEditContext, extensionConfig } from '@publisher/extensions';
import { useState, useEffect } from '@wordpress/element';
import { decorators } from '../../../../../../.storybook/preview';
import styles from '../../../../../../.storybook/playground-styles/style.lazy.scss';

const _value = {
	publisherBackground: [],
	publisherBackgroundColor: '',
	publisherBackgroundClip: '',
};

const WithBackgroundFieldStyles = (props) => {
	// Ensures that the CSS intended for the playground (especially the style resets)
	// are only loaded for the playground and don't leak into other stories.
	useEffect(() => {
		styles.use();

		return styles.unuse;
	});

	return BackgroundField(props);
};

export default {
	title: 'Fields/Background',
	component: WithBackgroundFieldStyles,
	tags: ['autodocs'],
};

const WithMockBlockEditContext = (story) => {
	const [value, setValue] = useState(_value);

	return (
		<BlockEditContext.Provider
			value={{
				attributes: value,
				setAttributes: setValue,
			}}
		>
			{story()}
		</BlockEditContext.Provider>
	);
};

export const Default = {
	args: {
		config: extensionConfig,
		attribute: 'publisherBackground',
		label: 'Background Field',
		className: 'publisher-background-field',
	},
	decorators: [WithMockBlockEditContext, ...decorators],
};
