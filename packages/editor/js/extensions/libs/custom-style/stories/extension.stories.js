/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { CustomStyleExtension, CustomStyleStyles } from '@blockera/editor';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/dev-storybook/js/block-api';
import { Playground } from '@blockera/dev-storybook/js/components';
import { supports } from '../supports';
import { attributes } from '../attributes';
// FIXME: please fix this import!
// import AdvancedExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraAdvancedExtension',
	targetBlock: 'core/paragraph',
	attributes,
	supports,
	edit({ attributes, setAttributes, ...props }) {
		// eslint-disable-next-line
		const { handleOnChangeAttributes } = useAttributes(
			attributes,
			setAttributes,
			{
				blockId: targetBlock,
			}
		);

		return (
			<>
				<InspectorControls>
					<CustomStyleExtension
						initialOpen={true}
						extensionId={'Advanced'}
						attributes={attributes?.blockeraAttributes || []}
						properties={attributes?.blockeraCSSProperties || []}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('Advanced', 'blockera')}
						storeName={'blockera/controls/repeater'}
						// icon={<AdvancedExtensionIcon />}
					/>
				</InspectorControls>

				<CustomStyleStyles
					extensions={['Advanced']}
					{...{
						...props,
						attributes,
						setAttributes,
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
	title: 'Extensions/Advanced',
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
					blockeraAttributes: [],
					blockeraCSSProperties: [],
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
