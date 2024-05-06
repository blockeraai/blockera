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
import { Promotion } from '@blockera/components';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import RepeaterItemHeader from './components/header';
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';
import type {
	TBackgroundControlProps,
	TDefaultRepeaterItemValue,
} from './types';
import {
	cleanupRepeaterItem,
	getRepeaterActiveItemsCount,
} from '../repeater-control/utils';
import { LabelDescription } from './components/label-description';
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

		let clonedValue = { ...value };

		clonedValue = Object.fromEntries(
			Object.entries(clonedValue).map(([itemId, item]): Object => {
				if (item?.type !== 'image') {
					delete item.image;
					delete item['image-size'];
					delete item['image-size-width'];
					delete item['image-size-height'];
					delete item['image-position'];
					delete item['image-repeat'];
					delete item['image-attachment'];
				}

				if (item?.type !== 'mesh-gradient') {
					delete item['mesh-gradient'];
					delete item['mesh-gradient-colors'];
					delete item['mesh-gradient-attachment'];
				} else {
					item['mesh-gradient-colors'] = Object.fromEntries(
						Object.entries(item['mesh-gradient-colors']).map(
							([colorId, color]) => {
								return [colorId, cleanupRepeaterItem(color)];
							}
						)
					);
				}

				if (item?.type !== 'linear-gradient') {
					delete item['linear-gradient'];
					delete item['linear-gradient-angel'];
					delete item['linear-gradient-repeat'];
					delete item['linear-gradient-attachment'];
				}

				if (item?.type !== 'radial-gradient') {
					delete item['radial-gradient'];
					delete item['radial-gradient-position'];
					delete item['radial-gradient-size'];
					delete item['radial-gradient-repeat'];
					delete item['radial-gradient-attachment'];
				}

				return [itemId, cleanupRepeaterItem(item)];
			})
		);

		return clonedValue;
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
					<Promotion
						type={'popup'}
						isOpen={isOpen}
						onClose={onClose}
						buttonText="Shop Now"
						title="Special Offer!"
						shopPage={'https://blockeraai.com/shop'}
						description="Get 50% off on all products. Limited time offer."
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
