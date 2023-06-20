/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BaseExtension, BlockEditContext } from '@publisher/extensions';
import { useState } from '@wordpress/element';
import { decorators } from '../../../../../../.storybook/preview';
import styles from '../../../../../../.storybook/playground-styles/style.lazy.scss';
import {
	blocksInitializer,
	createBlockEditorContent,
	Playground,
} from '@publisher/core-storybook';
import { attributes } from '../attributes';
import { supports } from '../supports';
import BackgroundExtensionIcon from '../icons/extension-icon';

const _value = {
	publisherBackground: [],
	publisherBackgroundColor: '',
	publisherBackgroundClip: '',
};

blocksInitializer({
	name: 'publisherBackgroundExtension',
	targetBlock: 'core/button',
	attributes,
	supports,
	edit(props) {
		return (
			<>
				<BaseExtension
					{...props}
					initialOpen={true}
					extensionId={'Background'}
					title={__('Background', 'publisher-core')}
					icon=<BackgroundExtensionIcon />
				/>
			</>
		);
	},
});

const wrapperBlock = createBlockEditorContent('core/buttons', 'core/button', {
	text: 'Get In Touch',
	style: {
		border: {
			radius: '50px',
		},
	},
});

export default {
	title: 'Extensions/Background',
	component: Playground,
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
		blocks: [wrapperBlock],
		styles,
	},
	decorators: [WithMockBlockEditContext, ...decorators],
};
