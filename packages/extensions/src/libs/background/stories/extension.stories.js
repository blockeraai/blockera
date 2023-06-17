/**
 * Internal dependencies
 */
import { BackgroundExtension } from '../extension';
import { BlockEditContext } from '@publisher/extensions';
import { useState, useEffect } from '@wordpress/element';
import { decorators } from '../../../../../../.storybook/preview';
import * as config from '../../base/config';
import styles from '../../../../../../.storybook/playground-styles/style.lazy.scss';

const _value = {
	publisherBackground: [],
	publisherBackgroundColor: '',
	publisherBackgroundClip: '',
};

const WithBackgroundExtensionStyles = (props) => {
	// Ensures that the CSS intended for the playground (especially the style resets)
	// are only loaded for the playground and don't leak into other stories.
	useEffect(() => {
		styles.use();

		return styles.unuse;
	});

	return BackgroundExtension(props);
};

export default {
	title: 'Extensions/Background',
	component: WithBackgroundExtensionStyles,
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
		config,
		className: 'publisher-background-extension',
	},
	decorators: [WithMockBlockEditContext, ...decorators],
};
