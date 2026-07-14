// @flow
/**
 * External dependencies
 */
import { useState } from '@wordpress/element';
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { prepare } from '@blockera/data-editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { BoxSpacingControlProps, BoxSpacingLock } from './types';
import { formatBoxSpacingSidesForChangesetPreview } from './box-spacing-changeset-preview';
import {
	boxSpacingControlDefaultValue,
	boxSpacingValueCleanup,
	getSmartLock,
} from './utils';
import Grid from '../grid';
import { Button } from '../button';
import { LabelControl, LabelControlContainer } from '../label-control';
import InputControl from '../input-control';
import BaseControl from '../base-control';
import { useControlContext } from '../../context';
import { isValid } from '../../value-addons';

export default function BoxSpacingControl({
	className,
	//
	// marginDisable = 'none',
	// paddingDisable = 'none',
	//
	id,
	labelProps: propsForLabelControl = {},
	repeaterItem,
	defaultValue = boxSpacingControlDefaultValue,
	onChange = () => {},
}: BoxSpacingControlProps): MixedElement {
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
		valueCleanup: boxSpacingValueCleanup,
		mergeInitialAndDefault: true,
	});

	const [marginLock, setMarginLock]: [BoxSpacingLock, (string) => void] =
		useState(getSmartLock(value, 'margin'));

	const [paddingLock, setPaddingLock]: [BoxSpacingLock, (string) => void] =
		useState(getSmartLock(value, 'padding'));

	const paddingLabelProps = {
		attribute,
		blockName,
		label: __('Padding', 'blockera'),
		labelDescription: (
			<p>
				{__(
					"Define the spacing between the block's content and its border, ensuring control over layout and aesthetics.",
					'blockera'
				)}
			</p>
		),
		repeaterItem,
		resetToDefault,
		mode: 'advanced',
		singularId: 'padding',
		value: value?.padding,
		defaultValue: defaultValue?.padding,
		path: getControlPath(attribute, 'padding'),
		...propsForLabelControl,
		changesetGraphPreviewRender:
			propsForLabelControl.changesetGraphPreviewRender ??
			formatBoxSpacingSidesForChangesetPreview,
	};

	const marginLabelProps = {
		attribute,
		blockName,
		label: __('Margin', 'blockera'),
		labelDescription: (
			<>
				<p>
					{__(
						'Use margin to create separation between blocks, optimizing layout and enhancing visual balance.',
						'blockera'
					)}
				</p>
				<p>
					{__(
						"It's beneficial for improving layout and boosting visual harmony, especially in adaptive, responsive designs.",
						'blockera'
					)}
				</p>
			</>
		),
		repeaterItem,
		resetToDefault,
		mode: 'advanced',
		singularId: 'margin',
		value: value?.margin,
		defaultValue: defaultValue?.margin,
		path: getControlPath(attribute, 'margin'),
		...propsForLabelControl,
		changesetGraphPreviewRender:
			propsForLabelControl.changesetGraphPreviewRender ??
			formatBoxSpacingSidesForChangesetPreview,
	};

	return (
		<>
			<BaseControl
				label=""
				columns={'columns-1'}
				controlName="box-spacing-padding"
			>
				<div className={controlClassNames('box-spacing', className)}>
					<div className={controlInnerClassNames('spacing-header')}>
						<LabelControlContainer
							style={{
								marginRight: 'auto',
							}}
						>
							<LabelControl {...paddingLabelProps} />
						</LabelControlContainer>

						<Grid gridTemplateColumns="1fr 30px" gap="8px">
							<Grid gridTemplateColumns="1fr 1fr" gap="8px">
								{(paddingLock === 'simple' ||
									paddingLock === 'none') && (
									<>
										<InputControl
											className={controlInnerClassNames(
												'spacing-edge-top-bottom',
												'spacing-padding-top-bottom',
												'control-first label-center small-gap'
											)}
											data-test="padding-top-bottom"
											columns="columns-1"
											label={
												<Icon
													icon="padding-vertical"
													iconSize="18"
												/>
											}
											labelPopoverTitle={__(
												'Top & Bottom Padding',
												'blockera'
											)}
											labelDescription={
												<p>
													{__(
														'It enables you to set a padding space that applies to both the top and bottom edges of the block.',
														'blockera'
													)}
												</p>
											}
											labelProps={{
												changesetGraphPreview: {
													type: 'string',
												},
												controlFieldId:
													'padding-top-bottom',
											}}
											id="padding.top"
											unitType={'padding'}
											range={false}
											min={0}
											//
											defaultValue={prepare(
												'padding.top',
												defaultValue
											)}
											onChange={(newValue) => {
												setValue({
													...value,
													padding: {
														...value.padding,
														top: newValue,
														bottom: newValue,
													},
												});
											}}
											size="small"
											controlAddonTypes={['variable']}
											variableTypes={['spacing']}
										/>

										<InputControl
											className={controlInnerClassNames(
												'spacing-edge-left-right',
												'spacing-padding-left-right',
												'control-first label-center small-gap'
											)}
											data-test="padding-left-right"
											columns="columns-1"
											unitType={'padding'}
											label={
												<Icon
													icon="padding-horizontal"
													iconSize="18"
												/>
											}
											labelPopoverTitle={__(
												'Left & Right Padding',
												'blockera'
											)}
											labelDescription={
												<p>
													{__(
														'It enables you to set a padding space that applies to both the left and right edges of the block.',
														'blockera'
													)}
												</p>
											}
											labelProps={{
												changesetGraphPreview: {
													type: 'string',
												},
												controlFieldId:
													'padding-left-right',
											}}
											id="padding.left"
											defaultValue={prepare(
												'padding.left',
												defaultValue
											)}
											onChange={(newValue) => {
												setValue({
													...value,
													padding: {
														...value.padding,
														left: newValue,
														right: newValue,
													},
												});
											}}
											size="small"
											controlAddonTypes={['variable']}
											variableTypes={['spacing']}
										/>
									</>
								)}
							</Grid>

							<Button
								showTooltip={true}
								tooltipPosition="top"
								label={__(
									'Custom Padding for Edges',
									'blockera'
								)}
								data-test="padding-lock"
								size="extra-small"
								style={{
									padding: '4px',
									width: 'var(--blockera-controls-input-height)',
									height: 'var(--blockera-controls-input-height)',
								}}
								className={
									paddingLock !== 'simple'
										? 'is-toggle-btn is-toggled'
										: 'is-toggle-btn'
								}
								onClick={() => {
									if (paddingLock === 'simple') {
										setPaddingLock('expanded');
									} else {
										setPaddingLock('simple');
									}

									//
									// Top or Bottom valid value
									//
									let validTPValue = '';

									if (
										isValid(value.padding.top) ||
										value.padding.top !== ''
									) {
										validTPValue = value.padding.top;
									} else if (
										isValid(value.padding.bottom) ||
										value.padding.bottom !== ''
									) {
										validTPValue = value.padding.bottom;
									}

									//
									// Left or Right valid value
									//
									let validLRValue = '';

									if (
										isValid(value.padding.left) ||
										value.padding.left !== ''
									) {
										validLRValue = value.padding.left;
									} else if (
										isValid(value.padding.right) ||
										value.padding.right !== ''
									) {
										validLRValue = value.padding.right;
									}

									setValue({
										...value,
										padding: {
											left: validLRValue,
											right: validLRValue,
											top: validTPValue,
											bottom: validTPValue,
										},
									});
								}}
							>
								{paddingLock === 'simple' ? (
									<Icon icon="lock" iconSize="24" />
								) : (
									<Icon icon="unlock" iconSize="24" />
								)}
							</Button>
						</Grid>
					</div>

					{paddingLock === 'expanded' && (
						<div
							className={controlInnerClassNames('spacing-edges')}
						>
							<InputControl
								className={controlInnerClassNames(
									'spacing-edge-top',
									'spacing-padding-top'
								)}
								data-test="padding-top"
								id="padding.top"
								unitType={'padding'}
								range={false}
								min={0}
								//
								defaultValue={prepare(
									'padding.top',
									defaultValue
								)}
								onChange={(newValue) => {
									setValue({
										...value,
										padding: {
											...value.padding,
											top: newValue,
										},
									});
								}}
								size="small"
								controlAddonTypes={['variable']}
								variableTypes={['spacing']}
							/>

							<InputControl
								className={controlInnerClassNames(
									'spacing-edge-right',
									'spacing-padding-right'
								)}
								data-test="padding-right"
								id="padding.right"
								unitType={'padding'}
								range={false}
								min={0}
								//
								defaultValue={prepare(
									'padding.right',
									defaultValue
								)}
								onChange={(newValue) => {
									setValue({
										...value,
										padding: {
											...value.padding,
											right: newValue,
										},
									});
								}}
								size="small"
								controlAddonTypes={['variable']}
								variableTypes={['spacing']}
							/>

							<InputControl
								className={controlInnerClassNames(
									'spacing-edge-bottom',
									'spacing-padding-bottom'
								)}
								data-test="padding-bottom"
								id="padding.bottom"
								unitType={'padding'}
								range={false}
								min={0}
								//
								defaultValue={prepare(
									'padding.bottom',
									defaultValue
								)}
								onChange={(newValue) => {
									setValue({
										...value,
										padding: {
											...value.padding,
											bottom: newValue,
										},
									});
								}}
								size="small"
								controlAddonTypes={['variable']}
								variableTypes={['spacing']}
							/>

							<InputControl
								className={controlInnerClassNames(
									'spacing-edge-left',
									'spacing-padding-left'
								)}
								data-test="padding-left"
								id="padding.left"
								unitType={'padding'}
								range={false}
								min={0}
								//
								defaultValue={prepare(
									'padding.left',
									defaultValue
								)}
								onChange={(newValue) => {
									setValue({
										...value,
										padding: {
											...value.padding,
											left: newValue,
										},
									});
								}}
								size="small"
								controlAddonTypes={['variable']}
								variableTypes={['spacing']}
							/>

							<div
								className={controlInnerClassNames(
									'spacing-edges-preview'
								)}
							></div>
						</div>
					)}
				</div>
			</BaseControl>

			<BaseControl
				label=""
				columns={'columns-1'}
				controlName="box-spacing-margin"
			>
				<div className={controlClassNames('box-spacing', className)}>
					<div className={controlInnerClassNames('spacing-header')}>
						<LabelControlContainer
							style={{
								marginRight: 'auto',
							}}
						>
							<LabelControl {...marginLabelProps} />
						</LabelControlContainer>

						<Grid gridTemplateColumns="1fr 30px" gap="8px">
							<Grid gridTemplateColumns="1fr 1fr" gap="8px">
								{(marginLock === 'simple' ||
									marginLock === 'none') && (
									<>
										<InputControl
											className={controlInnerClassNames(
												'spacing-edge-top-bottom',
												'spacing-margin-top-bottom',
												'control-first label-center small-gap'
											)}
											data-test="margin-top-bottom"
											columns="columns-1"
											unitType={'margin'}
											label={
												<Icon
													icon="margin-vertical"
													iconSize="18"
												/>
											}
											labelPopoverTitle={__(
												'Top & Bottom Margin',
												'blockera'
											)}
											labelDescription={
												<p>
													{__(
														'It enables you to set a margin space that applies to both the top and bottom edges of the block.',
														'blockera'
													)}
												</p>
											}
											labelProps={{
												changesetGraphPreview: {
													type: 'string',
												},
												controlFieldId:
													'margin-top-bottom',
											}}
											id="margin.top"
											defaultValue={prepare(
												'margin.top',
												defaultValue
											)}
											onChange={(newValue) => {
												setValue({
													...value,
													margin: {
														...value.margin,
														top: newValue,
														bottom: newValue,
													},
												});
											}}
											size="small"
											controlAddonTypes={['variable']}
											variableTypes={['spacing']}
										/>

										<InputControl
											className={controlInnerClassNames(
												'spacing-edge-left-right',
												'spacing-margin-left-right',
												'control-first label-center small-gap'
											)}
											data-test="margin-left-right"
											columns="columns-1"
											unitType={'margin'}
											label={
												<Icon
													icon="margin-horizontal"
													iconSize="18"
												/>
											}
											labelPopoverTitle={__(
												'Left & Right Margin',
												'blockera'
											)}
											labelDescription={
												<p>
													{__(
														'It enables you to set a margin space that applies to both the left and right edges of the block.',
														'blockera'
													)}
												</p>
											}
											labelProps={{
												changesetGraphPreview: {
													type: 'string',
												},
												controlFieldId:
													'margin-left-right',
											}}
											id="margin.left"
											defaultValue={prepare(
												'margin.left',
												defaultValue
											)}
											onChange={(newValue) => {
												setValue({
													...value,
													margin: {
														...value.margin,
														left: newValue,
														right: newValue,
													},
												});
											}}
											size="small"
											controlAddonTypes={['variable']}
											variableTypes={['spacing']}
										/>
									</>
								)}
							</Grid>

							<Button
								showTooltip={true}
								tooltipPosition="top"
								label={__(
									'Custom Margin for Edges',
									'blockera'
								)}
								data-test="margin-lock"
								size="extra-small"
								style={{
									padding: '4px',
									width: 'var(--blockera-controls-input-height)',
									height: 'var(--blockera-controls-input-height)',
								}}
								className={
									marginLock !== 'simple'
										? 'is-toggle-btn is-toggled'
										: 'is-toggle-btn'
								}
								onClick={() => {
									if (marginLock === 'simple') {
										setMarginLock('expanded');
									} else {
										setMarginLock('simple');
									}

									//
									// Top or Bottom valid value
									//
									let validTPValue = '';

									if (
										isValid(value.margin.top) ||
										value.margin.top !== ''
									) {
										validTPValue = value.margin.top;
									} else if (
										isValid(value.margin.bottom) ||
										value.margin.bottom !== ''
									) {
										validTPValue = value.margin.bottom;
									}

									//
									// Left or Right valid value
									//
									let validLRValue = '';

									if (
										isValid(value.margin.left) ||
										value.margin.left !== ''
									) {
										validLRValue = value.margin.left;
									} else if (
										isValid(value.margin.right) ||
										value.margin.right !== ''
									) {
										validLRValue = value.margin.right;
									}

									setValue({
										...value,
										margin: {
											left: validLRValue,
											right: validLRValue,
											top: validTPValue,
											bottom: validTPValue,
										},
									});
								}}
							>
								{marginLock === 'simple' ? (
									<Icon icon="lock" iconSize="24" />
								) : (
									<Icon icon="unlock" iconSize="24" />
								)}
							</Button>
						</Grid>
					</div>

					{marginLock === 'expanded' && (
						<div
							className={controlInnerClassNames('spacing-edges')}
						>
							<InputControl
								className={controlInnerClassNames(
									'spacing-edge-top',
									'spacing-margin-top'
								)}
								data-test="margin-top"
								id="margin.top"
								unitType={'margin'}
								defaultValue={prepare(
									'margin.top',
									defaultValue
								)}
								onChange={(newValue) => {
									setValue({
										...value,
										margin: {
											...value.margin,
											top: newValue,
										},
									});
								}}
								size="small"
								controlAddonTypes={['variable']}
								variableTypes={['spacing']}
							/>

							<InputControl
								className={controlInnerClassNames(
									'spacing-edge-right',
									'spacing-margin-right'
								)}
								data-test="margin-right"
								id="margin.right"
								unitType={'margin'}
								defaultValue={prepare(
									'margin.right',
									defaultValue
								)}
								onChange={(newValue) => {
									setValue({
										...value,
										margin: {
											...value.margin,
											right: newValue,
										},
									});
								}}
								size="small"
								controlAddonTypes={['variable']}
								variableTypes={['spacing']}
							/>

							<InputControl
								className={controlInnerClassNames(
									'spacing-edge-bottom',
									'spacing-margin-bottom'
								)}
								data-test="margin-bottom"
								id="margin.bottom"
								unitType={'margin'}
								defaultValue={prepare(
									'margin.bottom',
									defaultValue
								)}
								onChange={(newValue) => {
									setValue({
										...value,
										margin: {
											...value.margin,
											bottom: newValue,
										},
									});
								}}
								size="small"
								controlAddonTypes={['variable']}
								variableTypes={['spacing']}
							/>

							<InputControl
								className={controlInnerClassNames(
									'spacing-edge-left',
									'spacing-margin-left'
								)}
								data-test="margin-left"
								id="margin.left"
								unitType={'margin'}
								defaultValue={prepare(
									'margin.left',
									defaultValue
								)}
								onChange={(newValue) => {
									setValue({
										...value,
										margin: {
											...value.margin,
											left: newValue,
										},
									});
								}}
								size="small"
								controlAddonTypes={['variable']}
								variableTypes={['spacing']}
							/>

							<div
								className={controlInnerClassNames(
									'spacing-edges-preview'
								)}
							></div>
						</div>
					)}
				</div>
			</BaseControl>
		</>
	);
}
