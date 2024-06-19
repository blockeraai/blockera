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
import { LayoutExtension } from '@blockera/editor';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/dev-storybook/js/block-api';
import { Playground } from '@blockera/dev-storybook/js/components';
import { attributes, supports } from '../../shared';
import { WithPlaygroundStyles } from '../../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../../../hooks';
import { STORE_NAME } from '../../base/store/constants';
import * as config from '../../base/config';
import { BlockStyle } from '../../../../style-engine';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraLayoutExtension',
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
				<LayoutExtension
					block={block}
					extensionConfig={config.layoutConfig}
					extensionProps={{
						blockeraDisplay: {},
						blockeraFlexLayout: {},
						blockeraGap: {},
						blockeraFlexWrap: {},
						blockeraAlignContent: {},
					}}
					values={{
						blockeraDisplay: attributes.blockeraDisplay,
						blockeraFlexLayout: attributes.blockeraFlexLayout,
						blockeraGap: attributes.blockeraGap,
						blockeraFlexWrap: attributes.blockeraFlexWrap,
						blockeraAlignContent: attributes.blockeraAlignContent,
					}}
					attributes={{
						blockeraDisplay: attributes.blockeraDisplay,
						blockeraFlexLayout: attributes.blockeraFlexLayout,
						blockeraGap: attributes.blockeraGap,
						blockeraFlexWrap: attributes.blockeraFlexWrap,
						blockeraAlignContent: attributes.blockeraAlignContent,
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
					blockeraGap: '',
					blockeraDisplay: '',
					blockeraFlexWrap: { value: 'nowrap', reverse: false },
					blockeraAlignItems: '',
					blockeraAlignContent: '',
					blockeraFlexDirection: { value: 'row', reverse: false },
					blockeraJustifyContent: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
