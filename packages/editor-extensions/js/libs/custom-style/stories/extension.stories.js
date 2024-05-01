/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/storybook/decorators';

/**
 * Internal dependencies
 */
import { BaseExtension, ExtensionStyle } from '@blockera/editor-extensions';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/storybook/block-api';
import { Playground } from '@blockera/storybook/components';
import { supports } from '../supports';
import { attributes } from '../attributes';
import AdvancedExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
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
					<BaseExtension
						initialOpen={true}
						extensionId={'Advanced'}
						attributes={attributes?.blockeraAttributes || []}
						properties={attributes?.blockeraCSSProperties || []}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('Advanced', 'blockera')}
						storeName={'blockera-core/controls/repeater'}
						icon={<AdvancedExtensionIcon />}
					/>
				</InspectorControls>

				<ExtensionStyle
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
