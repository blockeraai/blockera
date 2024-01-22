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
import MouseExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'publisherMouseExtension',
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
							cursor: attributes?.publisherCursor || '',
							userSelect: attributes?.publisherUserSelect || '',
							pointerEvents:
								attributes?.publisherPointerEvents || '',
						}}
						extensionId={'Mouse'}
						icon={<MouseExtensionIcon />}
						storeName={'publisher-core/controls'}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('Mouse', 'publisher-core')}
					/>
				</InspectorControls>

				<ExtensionStyle
					extensions={['Mouse']}
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
	title: 'Extensions/Mouse',
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
					publisherCursor: '',
					publisherUserSelect: '',
					publisherPointerEvents: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
