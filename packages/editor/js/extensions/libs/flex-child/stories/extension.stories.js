/**
 * External dependencies
 */
import { useDispatch, select } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { FlexChildExtension } from '@blockera/editor';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/dev-storybook/js/block-api';
import { Playground } from '@blockera/dev-storybook/js/components';
import { supports, attributes } from '../../shared';
import { WithPlaygroundStyles } from '../../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../../../hooks';
import * as config from '../../base/config';
import { STORE_NAME } from '../../base/store/constants';
import { BlockStyle } from '../../../../style-engine';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraFlexChildExtension',
	targetBlock: 'core/paragraph',
	attributes,
	supports,
	edit({ attributes, setAttributes, ...props }) {
		// eslint-disable-next-line
		const { handleOnChangeAttributes } = useAttributes(setAttributes, {
			blockId: name,
			innerBlocks: {},
			blockeraInnerBlocks: {},
			getAttributes: () => attributes,
			isNormalState: () => true,
			masterIsNormalState: () => true,
		});
		const block = {
			blockName: name,
			clientId: props.clientId,
			currentState: 'normal',
			currentBreakpoint: 'laptop',
			currentBlock: 'core/paragraph',
			currentInnerBlockState: 'normal',
		};
		const { updateExtension } = useDispatch(STORE_NAME);
		const { getExtensions } = select(STORE_NAME);

		const supports = getExtensions();
		const [settings, setSettings] = useState(supports);

		const handleOnChangeSettings = (
			newSettings: Object,
			key: string
		): void => {
			setSettings({
				...settings,
				[key]: {
					...settings[key],
					...newSettings,
				},
			});

			updateExtension(key, newSettings);
		};

		const parentClientIds = select('core/block-editor').getBlockParents(
			props.clientId
		);

		const directParentBlock = select('core/block-editor').getBlock(
			parentClientIds[parentClientIds.length - 1]
		);

		return (
			<>
				<FlexChildExtension
					block={block}
					extensionConfig={config.flexChildConfig}
					values={{
						blockeraFlexChildSizing:
							attributes.blockeraFlexChildSizing,
						blockeraFlexChildGrow: attributes.blockeraFlexChildGrow,
						blockeraFlexChildShrink:
							attributes.blockeraFlexChildShrink,
						blockeraFlexChildBasis:
							attributes.blockeraFlexChildBasis,
						blockeraFlexChildOrder:
							attributes.blockeraFlexChildOrder,
						blockeraFlexChildOrderCustom:
							attributes.blockeraFlexChildOrderCustom,
						blockeraFlexDirection:
							directParentBlock?.attributes?.blockeraFlexLayout
								?.direction,
					}}
					attributes={{
						blockeraFlexChildSizing:
							attributes.blockeraFlexChildSizing,
						blockeraFlexChildGrow: attributes.blockeraFlexChildGrow,
						blockeraFlexChildShrink:
							attributes.blockeraFlexChildShrink,
						blockeraFlexChildBasis:
							attributes.blockeraFlexChildBasis,
						blockeraFlexChildAlign:
							attributes.blockeraFlexChildAlign,
						blockeraFlexChildOrder:
							attributes.blockeraFlexChildOrder,
						blockeraFlexChildOrderCustom:
							attributes.blockeraFlexChildOrderCustom,
					}}
					extensionProps={{
						blockeraFlexChildSizing: {},
						blockeraFlexChildGrow: {},
						blockeraFlexChildShrink: {},
						blockeraFlexChildBasis: {},
						blockeraFlexChildAlign: {},
						blockeraFlexChildOrder: {},
						blockeraFlexChildOrderCustom: {},
					}}
					handleOnChangeAttributes={handleOnChangeAttributes}
					setSettings={handleOnChangeSettings}
				/>

				<BlockStyle
					{...{
						attributes,
						blockName: props.name,
						clientId: props.clientId,
						supports: props.supports,
						activeDeviceType: 'laptop',
						currentAttributes: attributes,
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
	title: 'Extensions/FlexChild',
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
					flexChildGrow: '',
					flexDirection: '',
					flexChildAlign: '',
					flexChildBasis: '',
					flexChildOrder: '',
					flexChildSizing: '',
					flexChildShrink: '',
					flexChildOrderCustom: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
