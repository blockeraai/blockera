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
import { BaseExtension, ExtensionStyle } from '@blockera/editor-extensions';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/dev-storybook/js/block-api';
import { Playground } from '@blockera/dev-storybook/js/components';
import { supports } from '../supports';
import { attributes } from '../attributes';
import LayoutExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraLayoutExtension',
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
							gap: attributes?.blockeraGap || '',
							display: attributes?.blockeraDisplay || '',
							flexWrap: attributes?.blockeraFlexWrap || {},
							alignItems: attributes?.blockeraAlignItems || '',
							flexDirection:
								attributes?.blockeraFlexDirection || {},
							justifyContent:
								attributes?.blockeraJustifyContent || '',
						}}
						extensionId={'Layout'}
						icon={<LayoutExtensionIcon />}
						storeName={'blockera-core/controls'}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('Layout', 'blockera')}
					/>
				</InspectorControls>

				<ExtensionStyle
					extensions={['Layout']}
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
	title: 'Extensions/Layout',
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
					blockeraGap: '',
					blockeraDisplay: '',
					blockeraFlexWrap: { value: 'nowrap', reverse: false },
					blockeraAlignItems: '',
					blockeraAlignContent: '',
					blockeraFlexDirection: { value: 'row', reverse: false },
					blockeraJustifyContent: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
