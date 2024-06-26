// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { isObject } from '@blockera/utils';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { PromotionPopover } from '../';
import RepeaterItemHeader from './components/header';
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';
import type {
	TBackgroundControlProps,
	TDefaultRepeaterItemValue,
} from './types';
import { cleanupRepeaterItem } from '../repeater-control/utils';
import { LabelDescription } from './components/label-description';
import { getRepeaterActiveItemsCount } from '../repeater-control/helpers';
import { default as generateMeshGradient } from './components/mesh-gradient/mesh-generator';

/**
 * Providing mesh gradient colors details.
 *
 * @param {Object} object the data holder
 * @param {boolean} forceUpdate the force update flag.
 * @return {{}} retrieved object includes mesh gradient details
 */
export function meshGradientProvider(
	object: TDefaultRepeaterItemValue,
	forceUpdate: boolean = false
): TDefaultRepeaterItemValue {
	if (
		object['mesh-gradient'] &&
		Object.values(object['mesh-gradient-colors']).length &&
		!forceUpdate
	) {
		return object;
	}

	const meshGradient = generateMeshGradient(
		Object.values(object['mesh-gradient-colors'])?.length
			? Object.values(object['mesh-gradient-colors']).length
			: 4
	);

	return {
		...object,
		'mesh-gradient': meshGradient.gradient,
		'mesh-gradient-colors': meshGradient.colors,
	};
}

export default function BackgroundControl({
	defaultValue = {},
	defaultRepeaterItemValue = meshGradientProvider({
		type: 'image',
		image: '',
		'image-size': 'custom',
		'image-size-width': 'auto',
		'image-size-height': 'auto',
		'image-position': {
			top: '50%',
			left: '50%',
		},
		'image-repeat': 'repeat',
		'image-attachment': 'scroll',
		'linear-gradient': 'linear-gradient(90deg,#009efa 10%,#e52e00 90%)',
		'linear-gradient-angel': '90',
		'linear-gradient-repeat': 'no-repeat',
		'linear-gradient-attachment': 'scroll',
		'radial-gradient':
			'radial-gradient(rgb(0,159,251) 0%,rgb(229,46,0) 100%)',
		'radial-gradient-position': {
			top: '50%',
			left: '50%',
		},
		'radial-gradient-size': 'farthest-corner',
		'radial-gradient-repeat': 'no-repeat',
		'radial-gradient-attachment': 'scroll',
		'mesh-gradient': '',
		// $FlowFixMe
		'mesh-gradient-colors': {},
		'mesh-gradient-attachment': 'scroll',
		isVisible: true,
	}),
	popoverTitle = __('Background', 'blockera'),
	label,
	labelPopoverTitle,
	labelDescription,
	className = '',
	...props
}: TBackgroundControlProps): MixedElement {
	function valueCleanup(value: any | Object): any | Object {
		if (!isObject(value)) {
			return value;
		}

		const cleanedValue: { [string]: Object } = {};

		for (const [itemId, item] of Object.entries(value)) {
			const cleanedItem: Object = cleanupRepeaterItem({ ...item });

			if (item?.type !== 'image') {
				delete cleanedItem.image;
				delete cleanedItem['image-size'];
				delete cleanedItem['image-size-width'];
				delete cleanedItem['image-size-height'];
				delete cleanedItem['image-position'];
				delete cleanedItem['image-repeat'];
				delete cleanedItem['image-attachment'];
			}

			if (item?.type !== 'mesh-gradient') {
				delete cleanedItem['mesh-gradient'];
				delete cleanedItem['mesh-gradient-colors'];
				delete cleanedItem['mesh-gradient-attachment'];
			} else if (cleanedItem['mesh-gradient-colors']) {
				const cleanedMeshGradientColors: { [string]: any } = {};
				for (const [colorId, color] of Object.entries(
					cleanedItem['mesh-gradient-colors']
				)) {
					cleanedMeshGradientColors[colorId] =
						cleanupRepeaterItem(color);
				}
				cleanedItem['mesh-gradient-colors'] = cleanedMeshGradientColors;
			}

			if (item?.type !== 'linear-gradient') {
				delete cleanedItem['linear-gradient'];
				delete cleanedItem['linear-gradient-angel'];
				delete cleanedItem['linear-gradient-repeat'];
				delete cleanedItem['linear-gradient-attachment'];
			}

			if (item?.type !== 'radial-gradient') {
				delete cleanedItem['radial-gradient'];
				delete cleanedItem['radial-gradient-position'];
				delete cleanedItem['radial-gradient-size'];
				delete cleanedItem['radial-gradient-repeat'];
				delete cleanedItem['radial-gradient-attachment'];
			}

			cleanedValue[itemId] = cleanedItem;
		}

		return cleanedValue;
	}

	return (
		<RepeaterControl
			id={'background'}
			PromoComponent={({
				items,
				onClose = () => {},
				isOpen = false,
			}): MixedElement | null => {
				if (getRepeaterActiveItemsCount(items) < 1) {
					return null;
				}

				return (
					<PromotionPopover
						heading={__('Multiple Backgrounds', 'blockera')}
						featuresList={[
							__('Multiple backgrounds', 'blockera'),
							__('All background types', 'blockera'),
							__('Advanced mesh gradient', 'blockera'),
							__('Advanced background settings', 'blockera'),
						]}
						isOpen={isOpen}
						onClose={onClose}
					/>
				);
			}}
			defaultValue={defaultValue}
			className={controlClassNames('background', className)}
			popoverTitle={popoverTitle}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			popoverClassName={controlClassNames('background-popover')}
			addNewButtonLabel={__('Add New Background', 'blockera')}
			label={label || __('Background', 'blockera')}
			labelPopoverTitle={
				labelPopoverTitle || __('Block Background', 'blockera')
			}
			labelDescription={labelDescription || <LabelDescription />}
			{...props}
			valueCleanup={valueCleanup}
		/>
	);
}

export { getBackgroundItemBGProperty } from './utils';
