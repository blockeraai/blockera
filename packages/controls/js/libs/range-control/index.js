// @flow

/**
 * External dependencies
 */
import { RangeControl as WordPressRangeControl } from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { isString } from '@blockera/utils';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { useControlContext } from '../../context';
import type { TRangeControlProps, TValueCleanup } from './types';

export default function RangeControl({
	min,
	max,
	className,
	withInputField = true,
	initialPosition,
	//
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	columns,
	onChange,
	sideEffect = true,
	defaultValue,
	disabled,
	field = 'range',
}: TRangeControlProps): MixedElement {
	function valueCleanup(value: TValueCleanup) {
		if (typeof value === 'string') {
			const units = [
				'px',
				'%',
				'em',
				'rem',
				'ch',
				'vw',
				'vh',
				'ms',
				's',
				'dvw',
				'dvh',
				'deg',
				'rad',
				'grad',
			];
			const regexp = new RegExp(units.join('|'), 'gi');

			return Number(value.replace(regexp, ''));
		}

		return value;
	}

	let {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
		valueCleanup,
	});

	if (isString(value)) {
		value = valueCleanup(value);
	}

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelPopoverTitle,
		labelDescription,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
			<WordPressRangeControl
				min={min}
				max={max}
				initialPosition={initialPosition}
				value={value}
				onChange={(newValue) => {
					if (sideEffect) {
						setValue(newValue);

						return false;
					}

					if ('undefined' !== typeof onChange) onChange(newValue);
				}}
				className={controlClassNames(
					'range',
					className,
					disabled && 'is-disabled'
				)}
				withInputField={withInputField}
				__nextHasNoMarginBottom={false}
				data-test="range-control"
			/>
		</BaseControl>
	);
}
