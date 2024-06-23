// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { useControlContext } from '../../context';
import { InputControl, SelectControl, ColorControl } from '../index';
import type { BorderControlProps } from './types';

export default function BorderControl({
	linesDirection = 'horizontal',
	customMenuPosition,
	style, //
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	columns,
	defaultValue = {
		width: '0px',
		style: 'solid',
		color: '',
	},
	onChange,
	field = 'border',
	singularId,
	repeaterItem,
	className, // internal usage for stories
	__isWidthFocused,
	__isColorFocused,
	__isStyleFocused,
}: BorderControlProps): MixedElement {
	const {
		value,
		setValue,
		getId,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
		mergeInitialAndDefault: true,
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
			label={label}
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
			<div
				className={controlClassNames('border', className)}
				style={style}
				data-test="border-control-component"
			>
				<InputControl
					id={getId(id, 'width')}
					type="number"
					min={0}
					defaultValue={defaultValue ? defaultValue.width : '0'}
					units={[
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
					]}
					className={controlClassNames(
						'input',
						__isWidthFocused && 'is-focused'
					)}
					noBorder={true}
					onChange={(newValue) => {
						setValue({ ...value, width: newValue });
					}}
					data-test="border-control-width"
					placeholder="-"
				/>

				<ColorControl
					id={getId(id, 'color')}
					type="minimal"
					noBorder={true}
					onChange={(newValue) => {
						setValue({ ...value, color: newValue });
					}}
					className={__isColorFocused && 'is-focused'}
					data-test="border-control-color"
					defaultValue={defaultValue && defaultValue.color}
				/>

				<SelectControl
					id={getId(id, 'style')}
					className={__isStyleFocused ? 'is-focused' : ''}
					customMenuPosition={customMenuPosition}
					type="custom"
					customInputCenterContent={true}
					customHideInputCaret={true}
					customHideInputLabel={true}
					noBorder={true}
					options={[
						{
							label: '',
							icon:
								linesDirection === 'horizontal' ? (
									<Icon icon="border-style-horizontal-solid" />
								) : (
									<Icon icon="border-style-vertical-solid" />
								),
							value: 'solid',
							className: 'align-center',
						},
						{
							label: '',
							icon:
								linesDirection === 'horizontal' ? (
									<Icon icon="border-style-horizontal-dashed" />
								) : (
									<Icon icon="border-style-vertical-dashed" />
								),
							value: 'dashed',
							className: 'align-center',
						},
						{
							label: '',
							icon:
								linesDirection === 'horizontal' ? (
									<Icon icon="border-style-horizontal-dotted" />
								) : (
									<Icon icon="border-style-vertical-dotted" />
								),
							value: 'dotted',
							className: 'align-center',
						},
						{
							label: '',
							icon:
								linesDirection === 'horizontal' ? (
									<Icon icon="border-style-horizontal-double" />
								) : (
									<Icon icon="border-style-vertical-double" />
								),
							value: 'double',
							className: 'align-center',
						},
					]}
					onChange={(newValue) => {
						setValue({ ...value, style: newValue });
					}}
					defaultValue={defaultValue && defaultValue.style}
				/>
			</div>
		</BaseControl>
	);
}
