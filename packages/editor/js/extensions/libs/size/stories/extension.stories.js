/**
 * External dependencies
 */
import { useState } from '@wordpress/element';
import { select, useDispatch } from '@wordpress/data';

/**
 *  Storybook dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { SizeExtension } from '@blockera/editor';
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
	name: 'blockeraSizeExtension',
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
				<SizeExtension
					block={block}
					extensionConfig={config.sizeConfig}
					values={{
						blockeraWidth: attributes.blockeraWidth,
						blockeraMinWidth: attributes.blockeraMinWidth,
						blockeraMaxWidth: attributes.blockeraMaxWidth,
						blockeraHeight: attributes.blockeraHeight,
						blockeraMinHeight: attributes.blockeraMinHeight,
						blockeraMaxHeight: attributes.blockeraMaxHeight,
						blockeraOverflow: attributes.blockeraOverflow,
						blockeraRatio: attributes.blockeraRatio,
						blockeraFit: attributes.blockeraFit,
						blockeraFitPosition: attributes.blockeraFitPosition,
					}}
					attributes={{
						blockeraWidth: attributes.blockeraWidth,
						blockeraMinWidth: attributes.blockeraMinWidth,
						blockeraMaxWidth: attributes.blockeraMaxWidth,
						blockeraHeight: attributes.blockeraHeight,
						blockeraMinHeight: attributes.blockeraMinHeight,
						blockeraMaxHeight: attributes.blockeraMaxHeight,
						blockeraOverflow: attributes.blockeraOverflow,
						blockeraRatio: attributes.blockeraRatio,
						blockeraFit: attributes.blockeraFit,
						blockeraFitPosition: attributes.blockeraFitPosition,
					}}
					extensionProps={{
						blockeraWidth: {},
						blockeraHeight: {},
						blockeraMinWidth: {},
						blockeraMinHeight: {},
						blockeraMaxWidth: {},
						blockeraMaxHeight: {},
						blockeraOverflow: {},
						blockeraRatio: {},
						blockeraFit: {},
						blockeraFitPosition: {},
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
