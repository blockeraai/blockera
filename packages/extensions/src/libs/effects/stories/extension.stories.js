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
import EffectsExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'publisherEffectsExtension',
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
							publisherFilter: [],
							publisherOpacity: '',
							publisherTransform: [],
							publisherBlendMode: '',
							publisherTransition: [],
							publisherBackdropFilter: [],
							publisherBackfaceVisibility: '',
							publisherTransformSelfOrigin: {},
							publisherTransformChildOrigin: {},
							publisherTransformSelfPerspective: '',
							publisherTransformChildPerspective: '',
							divider: [],
						}}
						extensionId={'Effects'}
						icon={<EffectsExtensionIcon />}
						storeName={'publisher-core/controls/repeater'}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('Effects', 'publisher-core')}
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
					publisherFilter: [],
					publisherOpacity: '',
					publisherTransform: [],
					publisherBlendMode: '',
					publisherTransition: [],
					publisherBackdropFilter: [],
					publisherDivider: [],
					publisherBackfaceVisibility: '',
					publisherTransformSelfOrigin: {},
					publisherTransformChildOrigin: {},
					publisherTransformSelfPerspective: '',
					publisherTransformChildPerspective: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
