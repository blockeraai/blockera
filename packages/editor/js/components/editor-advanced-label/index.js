// @flow

/**
 * External Dependencies
 */
import { __, _n } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { useState, useContext } from '@wordpress/element';

/**
 * Blockera Dependencies
 */
import {
	classNames,
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
import { StatesGraph } from './states-graph';
import { useBlockContext } from '../../extensions';
import type { AdvancedLabelControlProps } from './types';
import { sanitizeBlockAttributes } from '../../extensions/hooks/utils';
import { useAdvancedLabelProps } from '../../hooks/use-advanced-label-props';
import { countStatesGraphChangesetRows, getStatesGraph } from './helpers';

export const EditorAdvancedLabelControl = ({
	path = null,
	label,
	value,
	getAttributesRef,
	inGlobalStylesPanel = false,
	className,
	ariaLabel,
	attribute = '',
	blockName = '',
	isRepeater,
	singularId,
	controlFieldId,
	labelDescription,
	defaultValue,
	labelPopoverTitle,
	repeaterItem,
	resetToDefault,
	onClick,
	offset = 35,
	iconPosition = 'end',
	changesetGraphPreview,
	changesetGraphPreviewRender,
	...props
}: AdvancedLabelControlProps): MixedElement => {
	const [isOpenModal, setOpenModal] = useState(false);

	const {
		getAttributes = () => {},
		currentBlock,
		isNormalState = () => true,
		switchBlockState,
		currentState,
		currentInnerBlockState,
	} = useBlockContext();
	const { getSelectedBlock } = select('core/block-editor') || {};
	let { attributes } = !inGlobalStylesPanel
		? getSelectedBlock() || {}
		: {
				attributes:
					'function' === typeof getAttributesRef
						? getAttributesRef()
						: {},
			};
	attributes = sanitizeBlockAttributes(attributes);

	const { onChange, valueCleanup } = useContext(RepeaterContext) || {};

	const {
		isChanged,
		isInnerBlock,
		isChangedOnOtherStates,
		isChangedOnCurrentState,
		isChangedOnCurrentBreakpointNormal,
		isChangedNormalStateOnBaseBreakpoint,
	} = useAdvancedLabelProps(
		{
			path,
			value,
			blockName,
			singularId,
			attribute,
			isRepeater,
			defaultValue,
			isNormalState: isNormalState(),
			clientId: props?.clientId || '',
			blockAttributes: getAttributes(),
		},
		200
	);

	const isChangedValue =
		(isChanged && isChangedOnCurrentState) ||
		isChangedNormalStateOnBaseBreakpoint ||
		isChangedOnOtherStates;

	const previewObjectPickKey = singularId || controlFieldId;

	const labelStatesGraph =
		isOpenModal && isChangedValue && attribute
			? getStatesGraph({
					controlId: attribute,
					blockName,
					defaultValue,
					path,
					attributesRef:
						'undefined' !== typeof getAttributesRef
							? getAttributesRef()
							: {},
					isRepeaterItem: !isUndefined(repeaterItem),
					inGlobalStylesPanel,
					getAttributes,
					currentBlock,
				})
			: [];

	const changesetRowCount = countStatesGraphChangesetRows(labelStatesGraph);

	return (
		<>
			{label && (
				<SimpleLabelControl
					label={label}
					ariaLabel={ariaLabel}
					labelDescription={labelDescription}
					advancedIsOpen={isOpenModal}
					iconPosition={iconPosition}
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
								isChangedNormalStateOnBaseBreakpoint &&
								!isChangedOnCurrentState),
						'changed-in-other-state':
							!isChangedOnCurrentState && isChangedOnOtherStates,
						'changed-in-normal-state':
							((isNormalState() || 'normal' === currentState) &&
								isChanged &&
								isChangedOnCurrentState) ||
							(!isNormalState() &&
								(isChangedNormalStateOnBaseBreakpoint ||
									isChangedOnCurrentBreakpointNormal) &&
								!isChangedOnCurrentState) ||
							(!isNormalState() &&
								(isChangedNormalStateOnBaseBreakpoint ||
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
					resetToDefault={
						isChanged &&
						isChangedOnCurrentState &&
						isFunction(resetToDefault)
							? () => {
									if ('function' !== typeof resetToDefault) {
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
										attribute,
										isRepeater,
										attributes,
										repeaterItem,
										valueCleanup,
										propId: singularId,
										action: isNormalState()
											? 'RESET_TO_DEFAULT'
											: 'RESET_TO_NORMAL',
									});
								}
							: null
					}
				/>
			)}

			{isOpenModal && (
				<Popover
					offset={offset}
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
					className={classNames(
						controlInnerClassNames('label-popover'),
						!isChangedValue &&
							controlInnerClassNames('label-popover--auto-height')
					)}
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
								{_n(
									'Customization',
									'Customizations',
									changesetRowCount,
									'blockera'
								)}
							</h3>

							<StatesGraph
								controlId={attribute}
								statesGraph={labelStatesGraph}
								onClick={switchBlockState}
								changesetGraphPreview={changesetGraphPreview}
								previewObjectPickKey={previewObjectPickKey}
								changesetGraphPreviewRender={
									changesetGraphPreviewRender
								}
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
										isChangedNormalStateOnBaseBreakpoint && (
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
														attribute,
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

									{!isNormalState() &&
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
													'Reset To Normal Setting',
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
														!isFunction(
															resetToDefault
														)
													) {
														return;
													}

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
														attribute,
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

export { renderSelectOptionChangesetPreview } from './changeset-graph/render-select-option-changeset-preview';
export type { RenderSelectOptionChangesetPreviewArgs } from './changeset-graph/render-select-option-changeset-preview';
