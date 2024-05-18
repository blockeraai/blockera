/**
 * WordPress dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';

/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionAttributes,
} from '@blockera/editor';
import BlockStates from '../';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/dev-storybook/js/block-api';
import { Playground } from '@blockera/dev-storybook/js/components';
import { WithPlaygroundStyles } from '../../../../../../../.storybook/decorators/with-playground-styles';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraBlockStateExtension',
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
					blockeraBackground: [],
					blockeraBackgroundColor: '',
					blockeraBackgroundClip: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
