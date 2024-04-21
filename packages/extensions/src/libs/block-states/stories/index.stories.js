/**
 * WordPress dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';

/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/storybook/decorators';

/**
 * Internal dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionAttributes,
} from '@blockera/extensions';
import BlockStates from '../';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/storybook/block-api';
import { Playground } from '@blockera/storybook/components';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';

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
