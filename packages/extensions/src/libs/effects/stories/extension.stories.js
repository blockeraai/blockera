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
import EffectsExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraEffectsExtension',
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
							blockeraFilter: [],
							blockeraOpacity: '',
							blockeraTransform: [],
							blockeraBlendMode: '',
							blockeraTransition: [],
							blockeraBackdropFilter: [],
							blockeraBackfaceVisibility: '',
							blockeraTransformSelfOrigin: {},
							blockeraTransformChildOrigin: {},
							blockeraTransformSelfPerspective: '',
							blockeraTransformChildPerspective: '',
							divider: [],
						}}
						extensionId={'Effects'}
						icon={<EffectsExtensionIcon />}
						storeName={'blockera-core/controls/repeater'}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('Effects', 'blockera')}
					/>
				</InspectorControls>

				<ExtensionStyle
					extensions={['Effects']}
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
	title: 'Extensions/Effects',
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
					blockeraFilter: [],
					blockeraOpacity: '',
					blockeraTransform: [],
					blockeraBlendMode: '',
					blockeraTransition: [],
					blockeraBackdropFilter: [],
					blockeraDivider: [],
					blockeraBackfaceVisibility: '',
					blockeraTransformSelfOrigin: {},
					blockeraTransformChildOrigin: {},
					blockeraTransformSelfPerspective: '',
					blockeraTransformChildPerspective: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
