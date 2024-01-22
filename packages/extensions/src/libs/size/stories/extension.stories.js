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
import SizeExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'publisherSizeExtension',
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
							width: attributes?.publisherWidth || '',
							height: attributes?.publisherHeight || '',
							overflow: attributes?.publisherOverflow || '',
						}}
						{...{
							minWidth: attributes?.publisherMinWidth || '',
							maxWidth: attributes?.publisherMaxWidth || '',
							minHeight: attributes?.publisherMinHeight || '',
							maxHeight: attributes?.publisherMaxHeight || '',
							ratio: attributes?.publisherRatio || {
								value: '',
								width: '',
								height: '',
							},
							fit: attributes?.publisherFit || '',
							fitPosition: attributes?.publisherFitPosition || {
								top: '',
								left: '',
							},
						}}
						extensionId={'Size'}
						icon={<SizeExtensionIcon />}
						storeName={'publisher-core/controls/repeater'}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('Size', 'publisher-core')}
					/>
				</InspectorControls>

				<ExtensionStyle
					extensions={['Size']}
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
	title: 'Extensions/Size',
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
					publisherWidth: '',
					publisherMinWidth: '',
					publisherMaxWidth: '',
					publisherMinHeight: '',
					publisherMaxHeight: '',
					publisherHeight: '',
					publisherOverflow: '',
					publisherRatio: {
						value: '',
						width: '',
						height: '',
					},
					publisherFit: '',
					publisherFitPosition: {
						top: '',
						left: '',
					},
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
