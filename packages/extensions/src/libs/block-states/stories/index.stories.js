/**
 * WordPress dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Publisher Storybook dependencies
 */
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionAttributes,
} from '@publisher/extensions';
import BlockStates from '../';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@publisher/storybook/block-api';
import { Playground } from '@publisher/storybook/components';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'publisherBlockStateExtension',
	targetBlock: 'core/paragraph',
	attributes: {
		...sharedBlockExtensionAttributes,
	},
	supports: {},
	edit({ attributes, setAttributes, ...props }) {
		return (
			<>
				<InspectorControls>
					<BlockStates
						attributes={attributes}
						supports={props.supports}
						clientId={props.clientId}
						blockName={props.blockName}
						setAttributes={setAttributes}
						Extension={SharedBlockExtension}
					/>
				</InspectorControls>
			</>
		);
	},
});

const wrapperBlock = createBlockEditorContent({
	blockName: 'core/paragraph',
	attributes: {
		content: 'This is test text.',
	},
});

export default {
	title: 'Extensions/BlockState',
	component: Playground,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		blocks: [
			{
				...wrapperBlock,
				attributes: {
					...(wrapperBlock?.attributes || {}),
					publisherBackground: [],
					publisherBackgroundColor: '',
					publisherBackgroundClip: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
