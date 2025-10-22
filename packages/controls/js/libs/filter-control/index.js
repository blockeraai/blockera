// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
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
import type { FilterControlProps } from './types';
import RepeaterItemHeader from './components/header';
import { cleanupRepeater } from '../repeater-control/utils';
import { getRepeaterActiveItemsCount } from '../repeater-control/helpers';
import { FilterLabelDescription } from './components/filter-label-description';

export default function FilterControl({
	id = 'filter',
	defaultRepeaterItemValue = {
		type: 'blur',
		blur: '3px',
		brightness: '200%',
		contrast: '200%',
		'hue-rotate': '45deg',
		saturate: '200%',
		grayscale: '100%',
		invert: '100%',
		sepia: '100%',
		'drop-shadow-x': '10px',
		'drop-shadow-y': '10px',
		'drop-shadow-blur': '10px',
		'drop-shadow-color': '',
		isVisible: true,
	},
	popoverTitle,
	label,
	labelPopoverTitle,
	labelDescription,
	className,
	defaultValue = [],
	PromoComponent = ({
		items,
		onClose = () => {},
		isOpen = false,
	}): MixedElement | null => {
		if (getRepeaterActiveItemsCount(items) < 1) {
			return null;
		}

		return (
			<PromotionPopover
				heading={__('Multiple Filters', 'blockera')}
				featuresList={[
					__('Multiple filters', 'blockera'),
					__('Advanced filter effects', 'blockera'),
					__('Advanced features', 'blockera'),
					__('Premium blocks', 'blockera'),
				]}
				isOpen={isOpen}
				onClose={onClose}
			/>
		);
	},
	...props
}: FilterControlProps): MixedElement {
	function valueCleanup(item: Object) {
		if (item?.type !== 'blur') {
			delete item.blur;
		}

		if (item?.type !== 'brightness') {
			delete item.brightness;
		}

		if (item?.type !== 'contrast') {
			delete item.contrast;
		}

		if (item?.type !== 'hue-rotate') {
			delete item['hue-rotate'];
		}

		if (item?.type !== 'saturate') {
			delete item.saturate;
		}

		if (item?.type !== 'grayscale') {
			delete item.grayscale;
		}

		if (item?.type !== 'invert') {
			delete item.invert;
		}

		if (item?.type !== 'sepia') {
			delete item.sepia;
		}

		if (item?.type !== 'drop-shadow') {
			delete item['drop-shadow-x'];
			delete item['drop-shadow-y'];
			delete item['drop-shadow-blur'];
			delete item['drop-shadow-color'];
		}

		// internal usage
		delete item.isOpen;

		return item;
	}

	return (
		<RepeaterControl
			id={id}
			className={controlClassNames('filter', className)}
			popoverTitle={popoverTitle || __('Filter Effects', 'blockera')}
			popoverClassName={componentInnerClassNames(
				'popover-filter-control'
			)}
			label={label || __('Filters', 'blockera')}
			labelPopoverTitle={
				labelPopoverTitle || __('Filter Effects', 'blockera')
			}
			labelDescription={
				labelDescription || (
					<FilterLabelDescription
						labelDescription={
							<>
								<p>
									{__(
										'The Filter applies on-the-fly image adjustments and graphical effects to block and its content.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'It is widely used for image manipulation, creating hover effects, or enhancing the aesthetics of web elements.',
										'blockera'
									)}
								</p>
							</>
						}
					/>
				)
			}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			defaultValue={defaultValue}
			PromoComponent={PromoComponent}
			{...props}
			valueCleanup={(value: Object): Object =>
				cleanupRepeater(value, { callback: valueCleanup })
			}
		/>
	);
}
