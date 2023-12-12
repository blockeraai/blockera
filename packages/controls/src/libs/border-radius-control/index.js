// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';
/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { getValueAddonRealValue } from '@publisher/hooks';
import { Button } from '@publisher/components';

/**
 * Internal dependencies
 */
import { InputControl, LabelControl } from '../index';
import { default as CustomIcon } from './icons/custom';
import { useControlContext } from '../../context';
import type { TBorderRadiusControlProps, TValue } from './types/control-type';

export default function BorderRadiusControl({
	id,
	label,
	defaultValue,
	onChange,
	//
	className,
}: TBorderRadiusControlProps): MixedElement {
	const {
		value,
		setValue,
		controlInfo: { name: controlId },
		dispatch: { modifyControlValue },
	} = useControlContext({
		id,
		onChange,
		defaultValue,
		valueCleanup,
		mergeInitialAndDefault: true,
	});

	// value clean up for removing extra values to prevent saving extra data!
	function valueCleanup(value: TValue) {
		if (value.type === 'all') {
			delete value?.topLeft;
			delete value?.topRight;
			delete value?.bottomLeft;
			delete value?.bottomRight;
		}

		return value;
	}

	return (
		<div className={controlClassNames('border-radius', className)}>
			<div
				className={controlInnerClassNames('border-header')}
				style={{
					'--pb-all': getValueAddonRealValue(value.all),
				}}
			>
				{label && (
					<div className={controlInnerClassNames('label')}>
						<LabelControl label={label} />
					</div>
				)}

				{value.type === 'all' && (
					<InputControl
						id="all"
						min="0"
						type="css"
						unitType="essential"
						onChange={(newValue) => {
							setValue({ ...value, all: newValue });
							modifyControlValue({
								controlId,
								value: {
									...value,
									all: newValue,
								},
							});
						}}
						defaultValue={value.all}
						placeholder="0"
						smallWidth={true}
						data-test="border-radius-input-all"
					/>
				)}
				<Button
					showTooltip={true}
					tooltipPosition="top"
					label={__('Custom Border Radius', 'publisher-core')}
					size="extra-small"
					style={{
						color:
							value.type === 'custom'
								? 'var(--publisher-controls-primary-color)'
								: 'var(--publisher-controls-color)',
						padding: '5px',
						width: '30px',
						height: '30px',
					}}
					onClick={() => {
						if (value.type === 'all') {
							setValue({
								...value,
								type: 'custom',
								topLeft: value.all,
								topRight: value.all,
								bottomLeft: value.all,
								bottomRight: value.all,
							});
							modifyControlValue({
								controlId,
								value: {
									...value,
									type: 'custom',
									topLeft: value.all,
									topRight: value.all,
									bottomLeft: value.all,
									bottomRight: value.all,
								},
							});
						} else {
							setValue({
								...value,
								type: 'all',
							});
							modifyControlValue({
								controlId,
								value: {
									...value,
									type: 'all',
								},
							});
						}
					}}
				>
					<CustomIcon />
				</Button>
			</div>

			{value.type === 'custom' && (
				<div className={controlInnerClassNames('border-corners')}>
					<div
						className={controlInnerClassNames(
							'border-corners-preview'
						)}
						style={{
							'--pb-top-left': getValueAddonRealValue(
								value.topLeft
							),
							'--pb-top-right': getValueAddonRealValue(
								value.topRight
							),
							'--pb-bottom-left': getValueAddonRealValue(
								value.bottomLeft
							),
							'--pb-bottom-right': getValueAddonRealValue(
								value.bottomRight
							),
						}}
					>
						<InputControl
							id="topLeft"
							min="0"
							type="css"
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-top-left'
							)}
							noBorder={true}
							value={value.topLeft}
							defaultValue={value.topLeft || '0'}
							placeholder="0"
							onChange={(newValue) => {
								setValue({
									...value,
									topLeft: newValue,
								});
								modifyControlValue({
									controlId,
									value: {
										...value,
										topLeft: newValue,
									},
								});
							}}
							smallWidth={true}
						/>
						<InputControl
							id="topRight"
							min="0"
							type="css"
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-top-right'
							)}
							noBorder={true}
							value={value.topRight}
							defaultValue={value.topRight || '0'}
							placeholder="0"
							onChange={(newValue) => {
								setValue({
									...value,
									topRight: newValue,
								});
								modifyControlValue({
									controlId,
									value: {
										...value,
										topRight: newValue,
									},
								});
							}}
							smallWidth={true}
						/>
						<InputControl
							id="bottomLeft"
							min="0"
							type="css"
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-bottom-left'
							)}
							noBorder={true}
							value={value.bottomLeft}
							defaultValue={value.bottomLeft || '0'}
							placeholder="0"
							onChange={(newValue) => {
								setValue({
									...value,
									bottomLeft: newValue,
								});
								modifyControlValue({
									controlId,
									value: {
										...value,
										bottomLeft: newValue,
									},
								});
							}}
							smallWidth={true}
						/>
						<InputControl
							id="bottomRight"
							min="0"
							type="css"
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-bottom-right'
							)}
							noBorder={true}
							value={value.bottomRight}
							defaultValue={value.bottomRight || '0'}
							placeholder="0"
							onChange={(newValue) => {
								setValue({
									...value,
									bottomRight: newValue,
								});
								modifyControlValue({
									controlId,
									value: {
										...value,
										bottomRight: newValue,
									},
								});
							}}
							smallWidth={true}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

BorderRadiusControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	// $FlowFixMe
	defaultValue: PropTypes.shape({
		type: PropTypes.oneOf(['all', 'custom']),
		all: PropTypes.string,
		topLeft: PropTypes.string,
		topRight: PropTypes.string,
		bottomLeft: PropTypes.string,
		bottomRight: PropTypes.string,
	}),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
	/**
	 * Label of control
	 */
	label: PropTypes.string,
};

BorderRadiusControl.defaultProps = {
	label: '',
	defaultValue: {
		type: 'all',
		all: '0px',
		topLeft: '0px',
		topRight: '0px',
		bottomLeft: '0px',
		bottomRight: '0px',
	},
};
