/**
 * External dependencies
 */
import { select, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { BorderAndShadowExtension } from '@blockera/editor';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/dev-storybook/js/block-api';
import { Playground } from '@blockera/dev-storybook/js/components';
import { supports, attributes } from '../../shared';
import { WithPlaygroundStyles } from '../../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../../../hooks';
import { BlockStyle } from '../../../../style-engine';
import { STORE_NAME } from '../../base/store/constants';
import * as config from '../../base/config';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraBorderAndShadow',
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

		return (
			<>
				<BorderAndShadowExtension
					block={block}
					extensionConfig={config.borderAndShadowConfig}
					extensionProps={{
						blockeraBorder: {},
						blockeraBorderRadius: {},
						blockeraBoxShadow: {},
						blockeraOutline: {},
					}}
					values={{
						blockeraBorder: attributes.blockeraBorder,
						blockeraBorderRadius: attributes.blockeraBorderRadius,
						blockeraOutline: attributes.blockeraOutline,
						blockeraBoxShadow: attributes.blockeraBoxShadow,
					}}
					attributes={{
						blockeraBorder: attributes.blockeraBorder,
						blockeraBorderRadius: attributes.blockeraBorderRadius,
						blockeraOutline: attributes.blockeraOutline,
						blockeraBoxShadow: attributes.blockeraBoxShadow,
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
