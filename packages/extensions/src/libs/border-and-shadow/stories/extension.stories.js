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
import { BaseExtension, ExtensionStyle } from '@blockera/extensions';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/storybook/block-api';
import { Playground } from '@blockera/storybook/components';
import { supports } from '../supports';
import { attributes } from '../attributes';
import BorderAndShadowExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';
import { include } from '@blockera/utils';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraBorderAndShadow',
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
								'blockeraBorder',
								'blockeraOutline',
								'blockeraBoxShadow',
								'blockeraBorderRadius',
							],
							'blockera'
						)}
						handleOnChangeAttributes={handleOnChangeAttributes}
						defaultValue={{
							borderColor: attributes?.borderColor || '',
							border: attributes.style?.border || {},
						}}
						title={__('Border And Shadow', 'blockera')}
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
					blockeraBorder: {},
					blockeraOutline: [],
					blockeraBoxShadow: [],
					blockeraBorderRadius: {},
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
