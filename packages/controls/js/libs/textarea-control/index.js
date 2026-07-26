// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useLayoutEffect, useRef } from '@wordpress/element';

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

const AUTO_MIN_HEIGHT = 30;

function adjustAutoHeight(element: ?HTMLTextAreaElement): void {
	if (!element) {
		return;
	}

	// Reset first so scrollHeight reflects content when shrinking.
	element.style.height = 'auto';
	element.style.height = `${Math.max(element.scrollHeight, AUTO_MIN_HEIGHT)}px`;
}

export default function TextAreaControl({
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	labelProps: propsForLabelControl = {},
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

	const isAutoHeight = height === 'auto';
	const textareaRef = useRef<?HTMLTextAreaElement>(null);

	useLayoutEffect(() => {
		if (!isAutoHeight) {
			return;
		}

		adjustAutoHeight(textareaRef.current);
	}, [isAutoHeight, value]);

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
		...propsForLabelControl,
	};

	const textareaStyle =
		height === 'auto'
			? {
					height: AUTO_MIN_HEIGHT,
					minHeight: AUTO_MIN_HEIGHT,
					overflow: 'hidden',
				}
			: {
					height: height + 10 + 'px',
				};

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
			<textarea
				ref={textareaRef}
				value={value}
				disabled={disabled}
				className={controlClassNames('textarea', className)}
				style={textareaStyle}
				{...props}
				// One row so empty scrollHeight can settle at the 30px min (browser default is 2).
				rows={height === 'auto' ? 1 : props.rows}
				onChange={(e) => {
					setValue(e.target.value);

					if (height === 'auto') {
						adjustAutoHeight(e.target);
					}
				}}
			/>
		</BaseControl>
	);
}
