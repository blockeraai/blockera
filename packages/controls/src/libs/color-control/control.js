// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { ColorIndicator, Button } from '@publisher/components';
import { useValueAddon } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import { BaseControl, ColorPickerControl } from '../index';
import { useControlContext } from '../../context';
import type { ColorControlProps } from './types';

export default function ColorControl({
	type = 'normal',
	noBorder,
	contentAlign = 'left',
	//
	id,
	label,
	labelDescription,
	labelPopoverTitle,
	columns,
	defaultValue,
	onChange = () => {},
	field = 'color',
	singularId,
	repeaterItem,
	//
	className = '',
	style,
	//
	controlAddonTypes,
	variableTypes,
	dynamicValueTypes,
	size = 'normal',
	//
	...props
}: ColorControlProps): MixedElement {
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

	const [isOpen, setOpen] = useState(false);

	const {
		valueAddonClassNames,
		isSetValueAddon,
		ValueAddonControl,
		ValueAddonPointer,
	} = useValueAddon({
		types: controlAddonTypes,
		value,
		setValue: (newValue: any): void => {
			setValue({
				value,
				valueAddon: newValue,
			});
		},
		variableTypes,
		dynamicValueTypes,
		onChange: setValue,
		size,
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
						'color',
						noBorder && 'no-border',
						className,
						valueAddonClassNames
					)}
				>
					<ValueAddonControl />
				</div>
			</BaseControl>
		);
	}

	let buttonLabel: MixedElement;

	if (type === 'normal') {
		buttonLabel = value ? (
			<span className="color-label" data-cy="color-label">
				{value}
			</span>
		) : (
			<span className="color-label" data-cy="color-label">
				{__('None', 'publisher-core')}
			</span>
		);
	}

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className + ' ' + valueAddonClassNames}
			{...labelProps}
		>
			<Button
				size="input"
				className={controlClassNames(
					'color',
					'color-type-' + type,
					'control-size' + size,
					value ? 'is-not-empty' : 'is-empty',
					className + ' ' + valueAddonClassNames
				)}
				noBorder={noBorder || type === 'minimal'}
				isFocus={isOpen}
				contentAlign={type === 'minimal' ? 'center' : contentAlign}
				onClick={() => setOpen(!isOpen)}
				style={{
					...style,
					'--publisher-controls-primary-color': value,
				}}
				data-cy="color-btn"
				{...props}
			>
				<ColorIndicator
					type="color"
					value={value}
					data-cy="color-indicator"
				/>

				{buttonLabel}
			</Button>

			{isOpen && (
				<ColorPickerControl
					id={id}
					isPopover={true}
					isOpen={isOpen}
					onClose={() => setOpen(false)}
					onChange={setValue}
					value={value}
					{...props}
				/>
			)}

			<ValueAddonPointer />
		</BaseControl>
	);
}
