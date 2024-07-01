// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { SearchControl as WPSearchControl } from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { TSearchControlProps } from './types';
import { BaseControl } from '../index';
import { useControlContext } from '../../context';

export default function SearchControl({
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	columns,
	defaultValue = '',
	onChange,
	field = 'search',
	placeholder = __('Search…', 'blockera'),
	//
	className,
	...props
}: TSearchControlProps): MixedElement {
	const {
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

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
			<WPSearchControl
				value={typeof value === 'object' ? '' : value}
				onChange={setValue}
				placeholder={placeholder}
				className={controlClassNames('search', className)}
				{...props}
			/>
		</BaseControl>
	);
}
