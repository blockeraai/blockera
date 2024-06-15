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
import { BaseExtension, ExtensionStyle } from '@blockera/editor';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/dev-storybook/js/block-api';
import { Playground } from '@blockera/dev-storybook/js/components';
import { supports } from '../supports';
import { attributes } from '../attributes';
// FIXME: please fix this import!
// import FlexChildExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraFlexChildExtension',
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
						{...{ ...props, attributes, setAttributes }}
						initialOpen={true}
						values={{
							flexChildGrow:
								attributes?.blockeraFlexChildGrow || '',
							flexChildAlign:
								attributes?.blockeraFlexChildAlign || '',
							flexChildBasis:
								attributes?.blockeraFlexChildBasis || '',
							flexChildOrder:
								attributes?.blockeraFlexChildOrder || '',
							flexChildSizing:
								attributes?.blockeraFlexChildSizing || '',
							flexChildShrink:
								attributes?.blockeraFlexChildShrink || '',
							flexChildOrderCustom:
								attributes?.blockeraFlexChildOrderCustom || '',
						}}
						extensionId={'FlexChild'}
						// icon={<FlexChildExtensionIcon />}
						storeName={'blockera-core/controls'}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('FlexChild', 'blockera')}
					/>
				</InspectorControls>

				<ExtensionStyle
					extensions={['FlexChild']}
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
	title: 'Extensions/FlexChild',
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
					flexChildGrow: '',
					flexDirection: '',
					flexChildAlign: '',
					flexChildBasis: '',
					flexChildOrder: '',
					flexChildSizing: '',
					flexChildShrink: '',
					flexChildOrderCustom: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
