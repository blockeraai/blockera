// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';
import PropTypes from 'prop-types';
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
	buttonLabel,
	popoverLabel,
	alignmentMatrixLabel,
	id,
	onChange,
	defaultValue,
	columns,
	field,
	className,
	...props
}: TPositionButtonProps): MixedElement {
	const { value, setValue } = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	const [isPopoverActive, setIsPopoverActive] = useState(false);

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
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
							: 'var(--publisher-controls-border-color-focus)',
				}}
				{...props}
				data-test="position-button"
			>
				{renderPositionIcon({ ...value, defaultValue })}
			</Button>
			{isPopoverActive && (
				<Popover
					title={popoverLabel}
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

PositionButtonControl.propTypes = {
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
	 * Label for Button tooltip
	 */
	buttonLabel: PropTypes.string,
	/**
	 * Label for popover
	 */
	popoverLabel: PropTypes.string,
	/**
	 * Label for field alignment-matrix. If you pass empty value the field will not be added and simple control will be rendered
	 *
	 * @default ""
	 */
	alignmentMatrixLabel: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: (PropTypes.shape({
		top: PropTypes.string,
		left: PropTypes.string,
	}): any),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
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
};

PositionButtonControl.defaultProps = {
	popoverLabel: (__('Setting', 'publisher-core'): any),
	defaultValue: {
		top: '',
		left: '',
	},
};
