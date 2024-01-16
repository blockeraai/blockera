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
import BorderAndShadowExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';
import { include } from '@publisher/utils';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'publisherBorderAndShadow',
	targetBlock: 'core/paragraph',
	attributes,
	supports,
	edit({ attributes, setAttributes, ...props }) {
		// eslint-disable-next-line
		const { handleOnChangeAttributes } = useAttributes(
			attributes,
			setAttributes,
			{
				targetId: targetBlock,
			}
		);
		//	console.log('attr', attributes);
		return (
			<>
				<InspectorControls>
					<BaseExtension
						{...props}
						initialOpen={true}
						extensionId={'BorderAndShadow'}
						values={include(
							attributes,
							[
								'publisherBorder',
								'publisherOutline',
								'publisherBoxShadow',
								'publisherBorderRadius',
							],
							'publisher'
						)}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={{
							borderColor: attributes?.borderColor || '',
							border: attributes.style?.border || {},
						}}
						title={__('Border And Shadow', 'publisher-core')}
						icon={<BorderAndShadowExtensionIcon />}
					/>
				</InspectorControls>

				<ExtensionStyle
					extensions={['BorderAndShadow']}
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
	title: 'Extensions/BorderAndShadow',
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
					publisherBorder: {},
					publisherOutline: [],
					publisherBoxShadow: [],
					publisherBorderRadius: {},
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
