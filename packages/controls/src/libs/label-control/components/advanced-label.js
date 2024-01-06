// @flow

/**
 * External Dependencies
 */
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Publisher Dependencies
 */
import { useBlockContext } from '@publisher/extensions/src/hooks/context';
import { useAdvancedLabelProps } from '@publisher/hooks';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { Button, Flex, Popover } from '@publisher/components';
import { isEmpty, isFunction, isNull, isUndefined } from '@publisher/utils';

/**
 * Internal Dependencies
 */
import type { AdvancedLabelControlProps } from '../types';
import { SimpleLabelControl } from './simple-label';
import { StatesGraph } from './states-graph';
import HelpIcon from '../icons/help';
import EditsIcon from '../icons/edits';
import RevertIcon from '../icons/revert';

export const AdvancedLabelControl = ({
	path = null,
	label,
	value,
	className,
	ariaLabel,
	attribute,
	blockName,
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
		getAttributes,
		getCurrentState,
		isNormalState,
		blockStateId,
		breakpointId,
		switchBlockState,
	} = useBlockContext();

	const {
		isChanged,
		isChangedOnNormal,
		isChangedOnOtherStates,
		isChangedOnCurrentState,
	} = useAdvancedLabelProps({
		path,
		value,
		singularId,
		attribute,
		isRepeater,
		defaultValue,
		blockStateId,
		breakpointId,
		isNormalState: isNormalState(),
		currentState: getCurrentState(),
		blockAttributes: getAttributes(),
	});

	// Assume singularId is set and path include attribute so,
	// attribute is object has nested props therefore we can exclude attribute from recieved path,
	// so that we can prepare path to reset actions!
	if (-1 !== path.indexOf(attribute) && singularId) {
		path = path.replace(`${attribute}.`, '');
	}

	const isChangedValue =
		(isChanged && isChangedOnCurrentState) ||
		isChangedOnNormal ||
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
						'changed-in-other-state':
							!isChangedOnCurrentState && isChangedOnOtherStates,
						'changed-in-normal-state':
							(isNormalState() &&
								isChanged &&
								isChangedOnCurrentState) ||
							(!isNormalState() &&
								isChangedOnNormal &&
								!isChangedOnCurrentState),
						'changed-in-secondary-state':
							!isNormalState() &&
							isChanged &&
							isChangedOnCurrentState,
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
							<HelpIcon />
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
								<EditsIcon />
								{__('Customization', 'publisher-core')}
							</h3>

							<StatesGraph
								controlId={attribute}
								blockName={blockName}
								onClick={switchBlockState}
								defaultValue={defaultValue}
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
											text={__(
												'Reset All',
												'publisher-core'
											)}
											label={__(
												'Reset All Changes in All States',
												'publisher-core'
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

												//FIXME: please implements reset_all action!
												resetToDefault({
													path,
													isRepeater,
													repeaterItem,
													propId: singularId,
													action: 'RESET_All',
												});
											}}
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
															'publisher-core'
														)}
														<RevertIcon />
													</>
												}
												label={__(
													'Reset To Default Setting',
													'publisher-core'
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
														isRepeater,
														repeaterItem,
														propId: singularId,
														action: 'RESET_TO_DEFAULT',
													});
												}}
											/>
										)}

									{!isNormalState() && (
										<Button
											variant={'primary'}
											size="input"
											text={
												<>
													{__(
														'Reset',
														'publisher-core'
													)}
													<RevertIcon />
												</>
											}
											label={__(
												'Reset To Normal Setting',
												'publisher-core'
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
													isRepeater,
													repeaterItem,
													propId: singularId,
													action: 'RESET_TO_NORMAL',
													attributes: getAttributes(),
												});
											}}
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
									<HelpIcon />
									{__('Overview', 'publisher-core')}
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
