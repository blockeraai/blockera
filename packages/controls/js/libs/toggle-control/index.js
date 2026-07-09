// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { ToggleControl as WPToggleControl } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { TToggleControlProps } from './types/toggle-control-props';
import { useControlContext } from '../../context';
import { BaseControl } from '../index';

export default function ToggleControl({
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	defaultValue,
	field = 'toggle',
	columns,
	onChange,
	className,
	children,
	labelType = 'advanced',
	...props
}: TToggleControlProps): MixedElement {
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
		path: getControlPath(attribute, id),
		mode: 'self' === labelType ? 'none' : labelType,
	};

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
			<WPToggleControl
				label={columns ? '' : label}
				checked={value}
				onChange={setValue}
				className={controlClassNames('toggle', className)}
				{...props}
			/>
			{children}
		</BaseControl>
	);
}
