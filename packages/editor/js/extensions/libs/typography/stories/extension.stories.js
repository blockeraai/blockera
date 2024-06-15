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
// import TypographyExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraTypographyExtension',
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
						defaultValue={{
							fontSize:
								attributes.fontSize ||
								attributes.blockeraFontSize,
							typography: attributes.style?.typography || {},
						}}
						values={{
							fontSize: attributes?.blockeraFontSize || '',
							textAlign: attributes?.blockeraTextAlign || '',
							fontStyle: attributes?.blockeraFontStyle || '',
							direction: attributes?.blockeraDirection || '',
							fontColor: attributes?.blockeraFontColor || '',
							wordBreak: attributes?.blockeraWordBreak || '',
							textIndent: attributes?.blockeraTextIndent || '',
							textShadow: attributes?.blockeraTextShadow || '',
							lineHeight: attributes?.blockeraLineHeight || '',
							wordSpacing: attributes?.blockeraWordSpacing || '',
							textColumns: attributes?.blockeraTextColumns || '',
							textTransform:
								attributes?.blockeraTextTransform || '',
							letterSpacing:
								attributes?.blockeraLetterSpacing || '',
							textDecoration:
								attributes?.blockeraTextDecoration || '',
							textOrientation:
								attributes?.blockeraTextOrientation || '',
							textStroke: attributes?.blockeraTextStroke || '',
						}}
						extensionId={'Typography'}
						// icon={<TypographyExtensionIcon />}
						storeName={'blockera-core/controls/repeater'}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('Typography', 'blockera')}
					/>
				</InspectorControls>

				<ExtensionStyle
					extensions={['Typography']}
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
	title: 'Extensions/Typography',
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
					fontSize: '',
					textAlign: '',
					fontStyle: '',
					direction: '',
					fontColor: '',
					wordBreak: '',
					textIndent: '',
					textShadow: '',
					lineHeight: '',
					wordSpacing: '',
					textColumns: '',
					textTransform: '',
					letterSpacing: '',
					textDecoration: '',
					textOrientation: '',
					textColumnsGap: '',
					textStrokeWidth: '',
					textStrokeColor: '',
					textColumnsDividerWidth: '',
					textColumnsDividerStyle: '',
					textColumnsDividerColor: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
