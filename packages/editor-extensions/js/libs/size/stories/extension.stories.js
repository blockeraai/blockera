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
import SizeExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraSizeExtension',
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
							width: attributes?.blockeraWidth || '',
							height: attributes?.blockeraHeight || '',
							overflow: attributes?.blockeraOverflow || '',
						}}
						{...{
							minWidth: attributes?.blockeraMinWidth || '',
							maxWidth: attributes?.blockeraMaxWidth || '',
							minHeight: attributes?.blockeraMinHeight || '',
							maxHeight: attributes?.blockeraMaxHeight || '',
							ratio: attributes?.blockeraRatio || {
								value: '',
								width: '',
								height: '',
							},
							fit: attributes?.blockeraFit || '',
							fitPosition: attributes?.blockeraFitPosition || {
								top: '',
								left: '',
							},
						}}
						extensionId={'Size'}
						icon={<SizeExtensionIcon />}
						storeName={'blockera-core/controls/repeater'}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('Size', 'blockera')}
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
					blockeraWidth: '',
					blockeraMinWidth: '',
					blockeraMaxWidth: '',
					blockeraMinHeight: '',
					blockeraMaxHeight: '',
					blockeraHeight: '',
					blockeraOverflow: '',
					blockeraRatio: {
						value: '',
						width: '',
						height: '',
					},
					blockeraFit: '',
					blockeraFitPosition: {
						top: '',
						left: '',
					},
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
