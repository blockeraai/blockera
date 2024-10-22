// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { isObject } from '@blockera/utils';
import {
	controlClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { PromotionPopover } from '../';
import Fields from './components/fields';
import RepeaterControl from '../repeater-control';
import RepeaterItemHeader from './components/header';
import type { TransformControlProps } from './types';
import { cleanupRepeaterItem } from '../repeater-control/utils';
import { LabelDescription } from './components/label-description';
import { getRepeaterActiveItemsCount } from '../repeater-control/helpers';

export default function TransformControl({
	defaultRepeaterItemValue = {
		type: 'move',
		'move-x': '0px',
		'move-y': '0px',
		'move-z': '0px',
		scale: '100%',
		'rotate-x': '0deg',
		'rotate-y': '0deg',
		'rotate-z': '0deg',
		'skew-x': '0deg',
		'skew-y': '0deg',
		isVisible: true,
	},
	popoverTitle,
	label,
	labelDescription,
	className,
	...props
}: TransformControlProps): MixedElement {
	function valueCleanup(value: any | Object): any | Object {
		if (!isObject(value)) {
			return value;
		}

		let clonedValue = { ...value };

		clonedValue = Object.fromEntries(
			Object.entries(clonedValue).map(([itemId, item]): Object => {
				if (item?.type !== 'move') {
					delete item['move-x'];
					delete item['move-y'];
					delete item['move-z'];
				}

				if (item?.type !== 'scale') {
					delete item.scale;
				}

				if (item?.type !== 'rotate') {
					delete item['rotate-x'];
					delete item['rotate-y'];
					delete item['rotate-z'];
				}

				if (item?.type !== 'skew') {
					delete item['skew-x'];
					delete item['skew-y'];
				}

				return [itemId, cleanupRepeaterItem(item)];
			})
		);

		return clonedValue;
	}

	return (
		<RepeaterControl
			className={controlClassNames('transform', className)}
			popoverClassName={componentInnerClassNames(
				'popover-transform-control'
			)}
			popoverTitle={popoverTitle || __('2D & 3D Transforms', 'blockera')}
			label={label || __('2D & 3D Transforms', 'blockera')}
			labelDescription={labelDescription || <LabelDescription />}
			addNewButtonLabel={__('Add New Transform', 'blockera')}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			valueCleanup={valueCleanup}
			id={'transform'}
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
						heading={__('Multiple 2D & 3D Transforms', 'blockera')}
						featuresList={[
							__('Multiple transforms', 'blockera'),
							__('Advanced transform effects', 'blockera'),
							__('Advanced features', 'blockera'),
							__('Premium blocks', 'blockera'),
						]}
						isOpen={isOpen}
						onClose={onClose}
					/>
				);
			}}
			{...props}
		/>
	);
}
