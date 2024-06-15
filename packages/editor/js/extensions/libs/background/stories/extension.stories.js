/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 *  Storybook dependencies
 */
import { Playground } from '@blockera/dev-storybook/js/components';
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/dev-storybook/js/block-api';
import { BaseExtension, ExtensionStyle } from '../../';
import { supports } from '../supports';
import { attributes } from '../attributes';
// FIXME: please fix this import!
// import BackgroundExtensionIcon from '../icons/extension-icon';
import { WithPlaygroundStyles } from '../../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../shared/use-attributes';
import { InspectorControls } from '@wordpress/block-editor';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraBackgroundExtension',
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
							background:
								attributes?.blockeraBackground || undefined,
							backgroundColor:
								attributes?.blockeraBackgroundColor || '',
							backgroundClip:
								attributes?.blockeraBackgroundClip || 'none',
						}}
						extensionId={'Background'}
						icon={<BackgroundExtensionIcon />}
						storeName={'blockera-core/controls/repeater'}
						handleOnChangeAttributes={handleOnChangeAttributes}
						title={__('Background', 'blockera')}
					/>
				</InspectorControls>

				<ExtensionStyle
					extensions={['Background']}
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
	title: 'Extensions/Background',
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
					blockeraBackground: [],
					blockeraBackgroundColor: '',
					blockeraBackgroundClip: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
