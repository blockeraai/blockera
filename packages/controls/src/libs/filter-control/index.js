// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';
/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import RepeaterItemHeader from './components/header';
import RepeaterControl from '../repeater-control';
import Fields from './components/fields';
import { isArray } from '@publisher/utils';
import type { TFilterControlProps, TValueCleanUp } from './types';
export default function FilterControl({
	id,
	defaultRepeaterItemValue,
	popoverLabel,
	className,
	...props
}: TFilterControlProps): MixedElement {
	function valueCleanup(value: TValueCleanUp) {
		if (!isArray(value)) {
			return value;
		}

		return value.map((item) => {
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
		});
	}

	return (
		<RepeaterControl
			id={id}
			className={controlClassNames('filter', className)}
			popoverLabel={popoverLabel}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			{...props}
			valueCleanup={valueCleanup}
		/>
	);
}

FilterControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.array,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Default value of each repeater item
	 */
	defaultRepeaterItemValue: (PropTypes.shape({
		type: PropTypes.oneOf([
			'blur',
			'drop-shadow',
			'brightness',
			'contrast',
			'hue-rotate',
			'saturate',
			'grayscale',
			'invert',
			'sepia',
		]),
		blur: PropTypes.string,
		brightness: PropTypes.string,
		contrast: PropTypes.string,
		'hue-rotate': PropTypes.string,
		saturate: PropTypes.string,
		grayscale: PropTypes.string,
		invert: PropTypes.string,
		sepia: PropTypes.string,
		'drop-shadow-x': PropTypes.string,
		'drop-shadow-y': PropTypes.string,
		'drop-shadow-blur': PropTypes.string,
		'drop-shadow-color': PropTypes.string,
		isVisible: PropTypes.bool,
	}): any),
	/**
	 * Label for popover
	 */
	popoverLabel: PropTypes.string,
};

FilterControl.defaultProps = {
	defaultValue: ([]: any),
	defaultRepeaterItemValue: {
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
	popoverLabel: (__('Filter Effect', 'publisher-core'): any),
};
