// @flow

/**
 * External dependencies
 */
import { GradientPicker as WPGradientPicker } from '@wordpress/components';
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
