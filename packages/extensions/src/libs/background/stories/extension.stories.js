/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher Storybook dependencies
 */
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { BaseExtension } from '@publisher/extensions';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@publisher/storybook/block-api';
import { Playground } from '@publisher/storybook/components';
import { supports } from '../supports';
import { attributes } from '../attributes';
import BackgroundExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

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
	decorators: [...SharedDecorators],
};
