// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import {
	Grid,
	Button,
	InputControl,
	LabelControl,
	LabelControlContainer,
} from '../index';
import { getValueAddonRealValue } from '../../';
import { useControlContext } from '../../context';
import type { BorderRadiusControlProps, BorderRadiusValue } from './types';

export type * from './types';

export default function BorderRadiusControl({
	id,
	label = '',
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	defaultValue = {
		type: 'all',
		all: '',
		topLeft: '',
		topRight: '',
		bottomLeft: '',
		bottomRight: '',
	},
	onChange,
	//
	className,
}: BorderRadiusControlProps): MixedElement {
	const {
		value,
		setValue,
		controlInfo: { name: controlId },
		dispatch: { modifyControlValue },
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
		valueCleanup,
		mergeInitialAndDefault: true,
	});

	// value clean up for removing extra values to prevent saving extra data!
	function valueCleanup(value: BorderRadiusValue) {
		if (value.type === 'all') {
			delete value?.topLeft;
			delete value?.topRight;
			delete value?.bottomLeft;
			delete value?.bottomRight;

			if (value?.all === '') {
				return '';
			}
		}

		return value;
	}

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelPopoverTitle: labelPopoverTitle || __('Border Radius', 'blockera'),
		labelDescription,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	return (
		<div className={controlClassNames('border-radius', className)}>
			<div
				className={controlInnerClassNames('border-header')}
				style={{
					'--pb-all': getValueAddonRealValue(value.all),
				}}
			>
				{label && (
					<LabelControlContainer
						style={{
							marginRight: 'auto',
						}}
					>
						<LabelControl {...labelProps} />
					</LabelControlContainer>
				)}

				<Grid
					gridTemplateColumns="122px 30px"
					gap="8px"
					justifyItems="end"
					justifyContent="end"
				>
					{value.type === 'all' ? (
						<InputControl
							id="all"
							min={0}
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
							defaultValue={value.all || ''}
							placeholder="0"
							size="small"
							data-test="border-radius-input-all"
						/>
					) : (
						<span></span>
					)}

					<Button
						showTooltip={true}
						tooltipPosition="top"
						label={__('Custom Border Radius', 'blockera')}
						size="extra-small"
						style={{
							padding: '4px',
							width: 'var(--blockera-controls-input-height)',
							height: 'var(--blockera-controls-input-height)',
						}}
						className={
							value.type === 'custom'
								? 'is-toggle-btn is-toggled'
								: 'is-toggle-btn'
						}
						onClick={() => {
							// old type
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
						<Icon icon="border-radius" iconSize="14" />
					</Button>
				</Grid>
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
							min={0}
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-top-left'
							)}
							defaultValue={value.topLeft || ''}
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
							size="small"
						/>
						<InputControl
							id="topRight"
							min={0}
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-top-right'
							)}
							defaultValue={value.topRight || ''}
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
							size="small"
						/>
						<InputControl
							id="bottomLeft"
							min={0}
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-bottom-left'
							)}
							defaultValue={value.bottomLeft || ''}
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
							size="small"
						/>
						<InputControl
							id="bottomRight"
							min={0}
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-bottom-right'
							)}
							defaultValue={value.bottomRight || ''}
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
							size="small"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
