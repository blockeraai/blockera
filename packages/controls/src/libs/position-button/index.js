// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { AlignmentMatrixControl, BaseControl } from '@publisher/controls';
import { Popover, Button } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { renderPositionIcon } from './utils';
import { useControlContext } from '../../context';
import type { TPositionButtonProps } from './types';

export default function PositionButtonControl({
	label,
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	buttonLabel,
	popoverTitle = __('Setting', 'publisher-core'),
	alignmentMatrixLabel = __('Position', 'publisher-core'),
	id,
	onChange,
	defaultValue = {
		top: '',
		left: '',
	},
	columns,
	field,
	className,
	...props
}: TPositionButtonProps): MixedElement {
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

	const [isPopoverActive, setIsPopoverActive] = useState(false);

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
			<Button
				label={buttonLabel}
				onClick={() => {
					setIsPopoverActive(!isPopoverActive);
				}}
				showTooltip={true}
				tooltipPosition="top"
				style={{
					padding: '5px',
					width: '30px',
					height: '30px',
					color:
						!value?.top ||
						!value?.left ||
						(defaultValue?.top === value?.top &&
							defaultValue?.left === value?.left)
							? 'var(--publisher-controls-color)'
							: 'var(--publisher-controls-primary-color)',
				}}
				className={isPopoverActive && 'is-focus'}
				{...props}
				data-test="position-button"
			>
				{renderPositionIcon({ ...value, defaultValue })}
			</Button>
			{isPopoverActive && (
				<Popover
					title={popoverTitle}
					offset={121}
					placement="left"
					className={controlInnerClassNames('position-popover')}
					onClose={() => {
						setIsPopoverActive(false);
					}}
				>
					<AlignmentMatrixControl
						label={alignmentMatrixLabel}
						columns={
							alignmentMatrixLabel ? 'columns-2' : 'columns-1'
						}
						inputFields={true}
						onChange={setValue}
						defaultValue={defaultValue}
					/>
				</Popover>
			)}
		</BaseControl>
	);
}
