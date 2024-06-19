/**
 * External dependencies
 */
import { useState } from '@wordpress/element';
import { select, useDispatch } from '@wordpress/data';

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
import { BackgroundExtension } from '../../';
import { attributes as defaultAttributes, supports } from '../../shared';
import { useAttributes } from '../../../../hooks';
import { BlockStyle } from '../../../../style-engine';
import { STORE_NAME } from '../../base/store/constants';
import * as config from '../../base/config';
import { WithPlaygroundStyles } from '../../../../../../../.storybook/decorators/with-playground-styles';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraBackgroundExtension',
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
				<BackgroundExtension
					block={block}
					setSettings={handleOnChangeSettings}
					extensionConfig={config.backgroundConfig}
					extensionProps={{
						blockeraBackground: {},
						blockeraBackgroundColor: {},
						blockeraBackgroundClip: {},
					}}
					values={{
						blockeraBackground: attributes?.blockeraBackground,
						blockeraBackgroundColor:
							attributes?.blockeraBackgroundColor,
						blockeraBackgroundClip:
							attributes?.blockeraBackgroundClip,
					}}
					handleOnChangeAttributes={handleOnChangeAttributes}
					attributes={{
						blockeraBackground: attributes.blockeraBackground,
						blockeraBackgroundColor:
							attributes.blockeraBackgroundColor,
						blockeraBackgroundClip:
							attributes.blockeraBackgroundClip,
					}}
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
