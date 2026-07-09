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
import { EffectsExtension } from '@blockera/editor';
import {
	blocksInitializer,
	createBlockEditorContent,
} from '@blockera/dev-storybook/js/block-api';
import { Playground } from '@blockera/dev-storybook/js/components';
import { supports, attributes } from '../../shared';
import { WithPlaygroundStyles } from '../../../../../../../.storybook/decorators/with-playground-styles';
import { useAttributes } from '../../../../hooks';
import { BlockStyle } from '../../../../style-engine';
import * as config from '../../base/config';
import { STORE_NAME } from '../../base/store/constants';

const { SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

blocksInitializer({
	name: 'blockeraEffectsExtension',
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
				<EffectsExtension
					block={block}
					extensionConfig={config.effectsConfig}
					extensionProps={{
						blockeraOpacity: {},
						blockeraTransform: {},
						blockeraTransformSelfPerspective: {},
						blockeraTransformSelfOrigin: {},
						blockeraBackfaceVisibility: {},
						blockeraTransformChildPerspective: {},
						blockeraTransformChildOrigin: {},
						blockeraTransition: {},
						blockeraFilter: {},
						blockeraBackdropFilter: {},
						blockeraBlendMode: {},
					}}
					values={{
						blockeraOpacity: attributes.blockeraOpacity,
						blockeraTransform: attributes.blockeraTransform,
						blockeraBackfaceVisibility:
							attributes.blockeraBackfaceVisibility,
						blockeraTransformSelfPerspective:
							attributes.blockeraTransformSelfPerspective,
						blockeraTransformSelfOrigin:
							attributes.blockeraTransformSelfOrigin,
						blockeraTransformChildOrigin:
							attributes.blockeraTransformChildOrigin,
						blockeraTransformChildPerspective:
							attributes.blockeraTransformChildPerspective,
						blockeraTransition: attributes.blockeraTransition,
						blockeraFilter: attributes.blockeraFilter,
						blockeraBackdropFilter:
							attributes.blockeraBackdropFilter,
						blockeraBlendMode: attributes.blockeraBlendMode,
					}}
					attributes={{
						blockeraOpacity: attributes.blockeraOpacity,
						blockeraTransform: attributes.blockeraTransform,
						blockeraBackfaceVisibility:
							attributes.blockeraBackfaceVisibility,
						blockeraTransformSelfPerspective:
							attributes.blockeraTransformSelfPerspective,
						blockeraTransformSelfOrigin:
							attributes.blockeraTransformSelfOrigin,
						blockeraTransformChildOrigin:
							attributes.blockeraTransformChildOrigin,
						blockeraTransformChildPerspective:
							attributes.blockeraTransformChildPerspective,
						blockeraTransition: attributes.blockeraTransition,
						blockeraFilter: attributes.blockeraFilter,
						blockeraBackdropFilter:
							attributes.blockeraBackdropFilter,
						blockeraBlendMode: attributes.blockeraBlendMode,
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
