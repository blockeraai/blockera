// @flow
/**
 * External dependencies
 */
import { GradientPicker as WPGradientPicker } from '@wordpress/components';
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { BaseControl } from '../index';
import { useControlContext } from '../../context';
import { setValueAddon, useValueAddon } from '../../';
import type { GradientBarControlProps } from './types';

export default function GradientBarControl({
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	columns,
	defaultValue = '',
	onChange,
	field = 'gradient-bar',
	height = 30,
	//
	className = '',
	//
	controlAddonTypes,
	variableTypes,
}: GradientBarControlProps): MixedElement {
	const {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		defaultValue,
		onChange,
	});

	const {
		valueAddonClassNames,
		isSetValueAddon,
		ValueAddonControl,
		ValueAddonPointer,
	} = useValueAddon({
		types: controlAddonTypes,
		value,
		setValue: (newValue: any): void =>
			setValueAddon(newValue, setValue, defaultValue),
		variableTypes,
		onChange: setValue,
	});

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

	if (isSetValueAddon()) {
		return (
			<BaseControl
				columns={columns}
				controlName={field}
				className={className}
				{...labelProps}
			>
				<div
					className={controlClassNames(
						'gradient-bar',
						className,
						valueAddonClassNames
					)}
				>
					<ValueAddonControl
						style={{
							height: height + 'px',
							padding: '0 max(min(' + height + 'px, 15px), 15px)',
						}}
					/>
				</div>
			</BaseControl>
		);
	}

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className + ' ' + valueAddonClassNames}
			{...labelProps}
		>
			<div
				data-cy="gradient-bar-control"
				className={controlClassNames(
					'gradient-bar',
					className,
					valueAddonClassNames
				)}
				style={{ '--gradient-bar-height': height + 'px' }}
			>
				<WPGradientPicker
					value={value}
					gradients={[]}
					clearable={false}
					onChange={setValue}
				/>
				<ValueAddonPointer />
			</div>
		</BaseControl>
	);
}

GradientBarControl.propTypes = {
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
	/**
	 * Label for field. If you pass empty value the field will not be added and simple control will be rendered
	 *
	 * @default ""
	 */
	label: PropTypes.string,
	/**
	 * Field id for passing into child Field component
	 *
	 * @default "toggle-select"
	 */
	field: PropTypes.string,
	/**
	 * Columns setting for Field grid.
	 *
	 * @default "columns-2"
	 */
	columns: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
};
