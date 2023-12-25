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
import { controlClassNames } from '@publisher/classnames';
import { Button, Flex, Popover } from '@publisher/components';
import { isEmpty, isFunction, isNull, isUndefined } from '@publisher/utils';

/**
 * Internal Dependencies
 */
import type { AdvancedLabelControlProps } from '../types';
import { SimpleLabelControl } from './simple-label';
import { StatesGraph } from './states-graph';

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
	description,
	defaultValue,
	popoverTitle,
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

	if ('undefined' === typeof attribute || 'undefined' === typeof blockName) {
		return (
			<SimpleLabelControl
				label={label}
				ariaLabel={ariaLabel}
				className={className}
			/>
		);
	}

	const {
		isChanged,
		isChangedOnNormal,
		isChangedOnOtherStates,
		isChangedOnCurrentState,
	} =
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useAdvancedLabelProps({
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
					})}
					{...props}
					onClick={onClick ? onClick : () => setOpenModal(true)}
					style={{
						cursor: 'pointer',
					}}
				/>
			)}

			{isOpenModal && (
				<Popover
					offset={35}
					title={popoverTitle !== '' ? popoverTitle : label}
					onClose={() => setOpenModal(!isOpenModal)}
					placement={'left-start'}
				>
					{'string' !== typeof description &&
					'function' === typeof description
						? description()
						: description}

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
						>
							{isChangedValue && (
								<Button
									variant={'primary'}
									text={__('Reset All', 'publisher-core')}
									label={__('Reset All', 'publisher-core')}
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

							{isNormalState() && isChangedOnCurrentState && (
								<Button
									variant={'primary'}
									text={__(
										'Reset To Default',
										'publisher-core'
									)}
									label={__(
										'Reset To Default',
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
									text={__(
										'Reset To Normal',
										'publisher-core'
									)}
									label={__(
										'Reset To Normal',
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

										if (!isFunction(resetToDefault)) {
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
				</Popover>
			)}
		</>
	);
};
