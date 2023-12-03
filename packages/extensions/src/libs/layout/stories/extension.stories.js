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
import LayoutExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'publisherLayoutExtension',
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
						values={{
							gap: attributes?.publisherGap || '',
							gapLock: attributes?.publisherGapLock,
							gapRows: attributes?.publisherGapRows || '',
							display: attributes?.publisherDisplay || '',
							flexWrap: attributes?.publisherFlexWrap || {},
							gapColumns: attributes?.publisherGapColumns || '',
							alignItems: attributes?.publisherAlignItems || '',
							flexDirection:
								attributes?.publisherFlexDirection || {},
							justifyContent:
								attributes?.publisherJustifyContent || '',
						}}
						extensionId={'Layout'}
						icon={<LayoutExtensionIcon />}
						storeName={'publisher-core/controls'}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('Layout', 'publisher-core')}
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
					publisherGapRows: '',
					publisherGap: '',
					publisherGapLock: true,
					publisherDisplay: '',
					publisherFlexWrap: { value: 'nowrap', reverse: false },
					publisherGapColumns: '',
					publisherAlignItems: '',
					publisherAlignContent: '',
					publisherFlexDirection: { value: 'row', reverse: false },
					publisherJustifyContent: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
