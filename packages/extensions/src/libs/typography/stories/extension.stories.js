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
import { BaseExtension, ExtensionStyle } from '@publisher/extensions';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@publisher/storybook/block-api';
import { Playground } from '@publisher/storybook/components';
import { supports } from '../supports';
import { attributes } from '../attributes';
import TypographyExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'publisherTypographyExtension',
	targetBlock: 'core/paragraph',
	attributes,
	supports,
	edit({ attributes, setAttributes, ...props }) {
		// eslint-disable-next-line
		const { handleOnChangeAttributes } = useAttributes(
			attributes,
			setAttributes
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
								attributes.publisherFontSize,
							typography: attributes.style?.typography || {},
						}}
						values={{
							fontSize: attributes?.publisherFontSize || '',
							textAlign: attributes?.publisherTextAlign || '',
							fontStyle: attributes?.publisherFontStyle || '',
							direction: attributes?.publisherDirection || '',
							fontColor: attributes?.publisherFontColor || '',
							wordBreak: attributes?.publisherWordBreak || '',
							textIndent: attributes?.publisherTextIndent || '',
							textShadow: attributes?.publisherTextShadow || '',
							lineHeight: attributes?.publisherLineHeight || '',
							wordSpacing: attributes?.publisherWordSpacing || '',
							textColumns: attributes?.publisherTextColumns || '',
							textTransform:
								attributes?.publisherTextTransform || '',
							letterSpacing:
								attributes?.publisherLetterSpacing || '',
							textDecoration:
								attributes?.publisherTextDecoration || '',
							textOrientation:
								attributes?.publisherTextOrientation || '',
							textStroke: attributes?.publisherTextStroke || '',
						}}
						extensionId={'Typography'}
						icon={<TypographyExtensionIcon />}
						storeName={'publisher-core/controls/repeater'}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('Typography', 'publisher-core')}
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
