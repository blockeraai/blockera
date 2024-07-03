// @flow

/**
 * External Dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { useState, useContext } from '@wordpress/element';

/**
 * Blockera Dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { isEmpty, isFunction, isNull, isUndefined } from '@blockera/utils';
import {
	Button,
	Flex,
	Popover,
	RepeaterContext,
	SimpleLabelControl,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal Dependencies
 */
import { useBlockContext } from '../../extensions';
import { useAdvancedLabelProps } from '../../hooks';
import type { AdvancedLabelControlProps } from './types';
import { StatesGraph } from './states-graph';

export const EditorAdvancedLabelControl = ({
	path = null,
	label,
	value,
	className,
	ariaLabel,
	attribute = '',
	blockName = '',
	isRepeater,
	singularId,
	labelDescription,
	defaultValue,
	labelPopoverTitle,
	repeaterItem,
	resetToDefault,
	onClick,
	...props
}: AdvancedLabelControlProps): MixedElement => {
	const [isOpenModal, setOpenModal] = useState(false);

	const {
		getAttributes = () => {},
		isNormalState = () => true,
		switchBlockState,
		currentState,
		currentInnerBlockState,
	} = useBlockContext();
	const { getSelectedBlock } = select('core/block-editor') || {};
	const { attributes } = getSelectedBlock() || {};

	const { onChange, valueCleanup } = useContext(RepeaterContext) || {};

	const {
		isChanged,
		isInnerBlock,
		isChangedOnOtherStates,
		isChangedOnLaptopNormal,
		isChangedOnCurrentState,
		isChangedOnCurrentBreakpointNormal,
	} = useAdvancedLabelProps(
		{
			path,
			value,
			singularId,
			attribute,
			isRepeater,
			defaultValue,
			isNormalState: isNormalState(),
			blockAttributes: getAttributes(),
		},
		200
	);

	// Assume singularId is set and path include attribute so,
	// attribute is object has nested props therefore we can exclude attribute from recieved path,
	// so that we can prepare path to reset actions!
	if (path && -1 !== path.indexOf(attribute) && singularId) {
		path = path.replace(`${attribute}.`, '');
	}

	const isChangedValue =
		(isChanged && isChangedOnCurrentState) ||
		isChangedOnLaptopNormal ||
		isChangedOnOtherStates;

	return (
		<>
			{label && (
				<SimpleLabelControl
					label={label}
					ariaLabel={ariaLabel}
					labelDescription={labelDescription}
					advancedIsOpen={isOpenModal}
					className={controlClassNames('label', className, {
						'changed-in-inner-normal-state':
							(isInnerBlock &&
								(isNormalState() ||
									'normal' === currentInnerBlockState) &&
								isChanged &&
								isChangedOnCurrentState) ||
							(isInnerBlock &&
								(!isNormalState() ||
									'normal' !== currentInnerBlockState) &&
								isChangedOnLaptopNormal &&
								!isChangedOnCurrentState),
						'changed-in-other-state':
							!isChangedOnCurrentState && isChangedOnOtherStates,
						'changed-in-normal-state':
							((isNormalState() || 'normal' === currentState) &&
								isChanged &&
								isChangedOnCurrentState) ||
							(!isNormalState() &&
								(isChangedOnLaptopNormal ||
									isChangedOnCurrentBreakpointNormal) &&
								!isChangedOnCurrentState) ||
							(!isNormalState() &&
								(isChangedOnLaptopNormal ||
									isChangedOnCurrentBreakpointNormal) &&
								!isChanged &&
								isChangedOnCurrentState),
						'changed-in-secondary-state':
							(isInnerBlock &&
								'normal' !== currentInnerBlockState &&
								isChanged &&
								isChangedOnCurrentState) ||
							(!isNormalState() &&
								'normal' !== currentState &&
								isChanged &&
								isChangedOnCurrentState),
						'is-open': isOpenModal,
					})}
					{...props}
					onClick={
						onClick
							? onClick
							: () => {
									if (isOpenModal) {
										setOpenModal(false);
									} else {
										setOpenModal(true);
									}
							  }
					}
					style={{
						cursor: 'pointer',
					}}
				/>
			)}

			{isOpenModal && (
				<Popover
					offset={35}
					title={
						<>
							<Icon icon="question-circle" iconSize="24" />
							{labelPopoverTitle !== ''
								? labelPopoverTitle
								: label}
						</>
					}
					onClose={() => setOpenModal(false)}
					placement={'left-start'}
					className={controlInnerClassNames('label-popover')}
				>
					{isChangedValue && (
						<div
							className={controlInnerClassNames(
								'label-section',
								'label-changes'
							)}
						>
							<h3
								className={controlInnerClassNames(
									'label-section-title'
								)}
							>
								<Icon icon="pen-circle" iconSize="20" />
								{__('Customization', 'blockera')}
							</h3>

							<StatesGraph
								controlId={attribute}
								blockName={blockName}
								onClick={switchBlockState}
								defaultValue={defaultValue}
								path={path}
								isRepeaterItem={!isUndefined(repeaterItem)}
							/>

							{isFunction(resetToDefault) && (
								<Flex
									direction={'row'}
									justifyContent={'space-between'}
									style={{
										marginTop: '15px',
									}}
								>
									{isChangedValue && (
										<Button
											variant={'tertiary'}
											size="input"
											text={__('Reset All', 'blockera')}
											label={__(
												'Reset All Changes in All States',
												'blockera'
											)}
											onClick={() => {
												if (
													!resetToDefault ||
													!isFunction(resetToDefault)
												) {
													return;
												}

												setOpenModal(!isOpenModal);

												if (
													(isNull(path) ||
														isEmpty(path) ||
														isUndefined(path)) &&
													!isRepeater
												) {
													return resetToDefault();
												}

												resetToDefault({
													path,
													onChange,
													attribute,
													isRepeater,
													attributes,
													valueCleanup,
													repeaterItem,
													propId: singularId,
													action: 'RESET_ALL',
												});
											}}
											data-test="reset-all-button"
										/>
									)}

									{isNormalState() &&
										isChangedOnCurrentState && (
											<Button
												variant={'primary'}
												size="input"
												text={
													<>
														{__(
															'Reset',
															'blockera'
														)}
														<Icon
															icon="undo"
															iconSize="20"
														/>
													</>
												}
												label={__(
													'Reset To Default Setting',
													'blockera'
												)}
												onClick={() => {
													if (
														!resetToDefault ||
														!isFunction(
															resetToDefault
														)
													) {
														return;
													}

													setOpenModal(!isOpenModal);

													if (
														(isNull(path) ||
															isEmpty(path) ||
															isUndefined(
																path
															)) &&
														!isRepeater
													) {
														return resetToDefault();
													}

													resetToDefault({
														path,
														onChange,
														isRepeater,
														attributes,
														repeaterItem,
														valueCleanup,
														propId: singularId,
														action: 'RESET_TO_DEFAULT',
													});
												}}
												data-test="reset-button"
											/>
										)}

									{!isNormalState() && (
										<Button
											variant={'primary'}
											size="input"
											text={
												<>
													{__('Reset', 'blockera')}
													<Icon
														icon="undo"
														iconSize="20"
													/>
												</>
											}
											label={__(
												'Reset To Normal Setting',
												'blockera'
											)}
											onClick={() => {
												if (
													!resetToDefault ||
													!isFunction(resetToDefault)
												) {
													return;
												}

												setOpenModal(!isOpenModal);

												if (
													!isFunction(resetToDefault)
												) {
													return;
												}

												if (
													(isNull(path) ||
														isEmpty(path) ||
														isUndefined(path)) &&
													!isRepeater
												) {
													return resetToDefault();
												}

												resetToDefault({
													path,
													onChange,
													isRepeater,
													attributes,
													repeaterItem,
													valueCleanup,
													propId: singularId,
													action: 'RESET_TO_NORMAL',
												});
											}}
											data-test="reset-button"
										/>
									)}
								</Flex>
							)}
						</div>
					)}

					{labelDescription && (
						<div
							className={controlInnerClassNames(
								'label-section',
								'label-desc'
							)}
						>
							{isChangedValue && (
								<h3
									className={controlInnerClassNames(
										'label-section-title'
									)}
								>
									<Icon
										icon="question-circle"
										iconSize="20"
									/>
									{__('Overview', 'blockera')}
								</h3>
							)}

							{'string' !== typeof labelDescription &&
							'function' === typeof labelDescription
								? labelDescription()
								: labelDescription}
						</div>
					)}
				</Popover>
			)}
		</>
	);
};
