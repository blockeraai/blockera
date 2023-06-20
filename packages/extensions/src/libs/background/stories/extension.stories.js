/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BaseExtension } from '@publisher/extensions';
import { decorators } from '../../../../../../.storybook/preview';
import {
	blocksInitializer,
	createBlockEditorContent,
	Playground,
} from '@publisher/core-storybook';
import { attributes } from '../attributes';
import { supports } from '../supports';
import BackgroundExtensionIcon from '../icons/extension-icon';

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

export const Default = {
	args: {
		blocks: [wrapperBlock],
		blocContextValue: {
			publisherBackground: [],
			publisherBackgroundColor: '',
			publisherBackgroundClip: '',
		},
	},
	decorators: [...decorators],
};
