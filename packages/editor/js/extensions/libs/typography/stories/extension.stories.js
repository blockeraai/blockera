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
import { TypographyExtension } from '@blockera/editor';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/dev-storybook/js/block-api';
import { Playground } from '@blockera/dev-storybook/js/components';
import { supports, attributes } from '../../shared';
import { WithPlaygroundStyles } from '../../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../../../hooks';
import { STORE_NAME } from '../../base/store/constants';
import * as config from '../../base/config';
import { BlockStyle } from '../../../../style-engine';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraTypographyExtension',
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
				<TypographyExtension
					block={block}
					extensionConfig={config.typographyConfig}
					extensionProps={{
						blockeraFontColor: {},
						blockeraFontSize: {},
						blockeraLineHeight: {},
						blockeraTextAlign: {},
						blockeraTextDecoration: {},
						blockeraFontStyle: {},
						blockeraTextTransform: {},
						blockeraDirection: {},
						blockeraTextShadow: {},
						blockeraLetterSpacing: {},
						blockeraWordSpacing: {},
						blockeraTextIndent: {},
						blockeraTextOrientation: {},
						blockeraTextColumns: {},
						blockeraTextStroke: {},
						blockeraWordBreak: {},
					}}
					values={{
						blockeraFontColor: attributes?.blockeraFontColor,
						blockeraFontSize: attributes?.blockeraFontSize,
						blockeraLineHeight: attributes?.blockeraLineHeight,
						blockeraTextAlign: attributes?.blockeraTextAlign,
						blockeraTextDecoration:
							attributes?.blockeraTextDecoration,
						blockeraFontStyle: attributes?.blockeraFontStyle,
						blockeraTextTransform:
							attributes?.blockeraTextTransform,
						blockeraDirection: attributes?.blockeraDirection,
						blockeraTextShadow: attributes?.blockeraTextShadow,
						blockeraLetterSpacing:
							attributes?.blockeraLetterSpacing,
						blockeraWordSpacing: attributes?.blockeraWordSpacing,
						blockeraTextIndent: attributes?.blockeraTextIndent,
						blockeraTextOrientation:
							attributes?.blockeraTextOrientation,
						blockeraTextColumns: attributes?.blockeraTextColumns,
						blockeraTextStroke: attributes?.blockeraTextStroke,
						blockeraWordBreak: attributes?.blockeraWordBreak,
					}}
					attributes={{
						blockeraFontColor: attributes?.blockeraFontColor,
						blockeraFontSize: attributes?.blockeraFontSize,
						blockeraLineHeight: attributes?.blockeraLineHeight,
						blockeraTextAlign: attributes?.blockeraTextAlign,
						blockeraTextDecoration:
							attributes?.blockeraTextDecoration,
						blockeraFontStyle: attributes?.blockeraFontStyle,
						blockeraTextTransform:
							attributes?.blockeraTextTransform,
						blockeraDirection: attributes?.blockeraDirection,
						blockeraTextShadow: attributes?.blockeraTextShadow,
						blockeraLetterSpacing:
							attributes?.blockeraLetterSpacing,
						blockeraWordSpacing: attributes?.blockeraWordSpacing,
						blockeraTextIndent: attributes?.blockeraTextIndent,
						blockeraTextOrientation:
							attributes?.blockeraTextOrientation,
						blockeraTextColumns: attributes?.blockeraTextColumns,
						blockeraTextStroke: attributes?.blockeraTextStroke,
						blockeraWordBreak: attributes?.blockeraWordBreak,
					}}
					display={attributes?.blockeraDisplay}
					backgroundClip={attributes?.blockeraBackgroundClip}
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
	title: 'Extensions/Typography',
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
					fontSize: '',
					textAlign: '',
					fontStyle: '',
					direction: '',
					fontColor: '',
					wordBreak: '',
					textIndent: '',
					textShadow: '',
					lineHeight: '',
					wordSpacing: '',
					textColumns: '',
					textTransform: '',
					letterSpacing: '',
					textDecoration: '',
					textOrientation: '',
					textColumnsGap: '',
					textStrokeWidth: '',
					textStrokeColor: '',
					textColumnsDividerWidth: '',
					textColumnsDividerStyle: '',
					textColumnsDividerColor: '',
				},
			},
		],
	},
	decorators: [...SharedDecorators],
};
