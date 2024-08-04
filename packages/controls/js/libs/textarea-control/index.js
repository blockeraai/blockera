// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../context';
import { BaseControl } from './../index';
import type { TTextAreaItem } from './types';

export default function TextAreaControl({
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	columns,
	defaultValue = '',
	onChange,
	field = 'textarea',
	className,
	disabled = false,
	height = 55,
	...props
}: TTextAreaItem): MixedElement {
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

	function onKeyUp(e: Object): void {
		e.target.style.height = `${Math.max(
			e.target.scrollHeight,
			height + 10
		)}px`;
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
			<textarea
				value={value}
				disabled={disabled}
				className={controlClassNames('textarea', className)}
				style={{ height: height + 10 + 'px' }}
				{...props}
				onChange={(e) => setValue(e.target.value)}
				onKeyUp={onKeyUp}
				{...props}
			/>
		</BaseControl>
	);
}
