/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { sharedBlockExtensionAttributes } from '@blockera/editor';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/dev-storybook/js/block-api';
import { Playground } from '@blockera/dev-storybook/js/components';
import { BlockStyle } from '../../../../style-engine';
import StatesManager from '../components/states-manager';
import { useAttributes } from '../../../../hooks';
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
		// eslint-disable-next-line
		const { handleOnChangeAttributes } = useAttributes(setAttributes, {
			blockId: name,
			innerBlocks: {},
			blockeraInnerBlocks: {},
			getAttributes: () => attributes,
			isNormalState: () => true,
			masterIsNormalState: () => true,
		});

		return (
			<>
				<StatesManager
					states={attributes.blockeraBlockStates}
					availableStates={undefined}
					onChange={handleOnChangeAttributes}
					block={{
						clientId: props.clientId,
						supports: props.supports,
						setAttributes,
						blockName: props.name,
					}}
					{...{
						currentBlock: 'master',
						currentState: 'normal',
						currentBreakpoint: 'laptop',
						currentInnerBlockState: 'normal',
					}}
				/>

				<BlockStyle
					{...{
						attributes,
						blockName: props.name,
						clientId: props.clientId,
						supports: props.supports,
						activeDeviceType: 'laptop',
						currentAttributes: attributes,
					}}
				/>
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
