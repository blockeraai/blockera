// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { useControlContext } from '../../context';
import type { BorderControlProps } from './types';
import { setValueAddon, useValueAddon } from '../../';
import {
	InputControl,
	ColorControl,
	LabelControl,
	SelectControl,
	LabelControlContainer,
} from '../index';

export default function BorderControl({
	linesDirection = 'horizontal',
	customMenuPosition,
	style, //
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	labelProps: propsForLabelControl = {},
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
	controlAddonTypes,
	variableTypes,
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
	});

	const resolvedControlAddonTypes = controlAddonTypes ?? ['variable'];
	const resolvedVariableTypes = variableTypes ?? ['border'];

	const {
		valueAddonClassNames,
		isSetValueAddon,
		ValueAddonControl,
		ValueAddonPointer,
	} = useValueAddon({
		types: resolvedControlAddonTypes,
		value,
		setValue: (newValue: any): void =>
			setValueAddon(newValue, setValue, defaultValue),
		variableTypes: resolvedVariableTypes,
		onChange: setValue,
		size: 'extra-small',
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
		...propsForLabelControl,
	};

	if (isSetValueAddon()) {
		return (
			<BaseControl
				label=""
				columns={columns}
				controlName={field}
				className={`${className || ''} ${valueAddonClassNames}`}
			>
				<div
					className={controlClassNames('border', className)}
					style={style}
					data-test="border-control-component"
				>
					<div className={controlInnerClassNames('border-header')}>
						{label && (
							<LabelControlContainer
								style={{
									marginRight: 'auto',
								}}
							>
								<LabelControl {...labelProps} />
							</LabelControlContainer>
						)}
						{label ? (
							<ValueAddonControl />
						) : (
							<div
								style={{
									gridColumn: '1 / -1',
								}}
							>
								<ValueAddonControl />
							</div>
						)}
					</div>
				</div>
			</BaseControl>
		);
	}

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
					onChange={(newValue) => {
						setValue({ ...value, width: newValue });
					}}
					data-test="border-control-width"
					placeholder="0"
				/>
				<div className={controlClassNames('border-color-wrapper')}>
					<ColorControl
						id={getId(id, 'color')}
						type="minimal"
						onChange={(newValue) => {
							setValue({ ...value, color: newValue });
						}}
						className={controlClassNames(
							'border-color',
							__isColorFocused && 'is-focused',
							value.width && !value.color && 'empty-color-error'
						)}
						data-test="border-control-color"
						defaultValue={defaultValue && defaultValue.color}
						controlAddonTypes={['variable']}
						variableTypes={['color']}
					/>
				</div>
				<SelectControl
					id={getId(id, 'style')}
					className={__isStyleFocused ? 'is-focused' : ''}
					customMenuPosition={customMenuPosition}
					type="custom"
					customInputCenterContent={true}
					customHideInputCaret={true}
					customHideInputLabel={true}
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
				<ValueAddonPointer />
			</div>
		</BaseControl>
	);
}
