// @flow
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { isEmpty, isFunction, isNull, isUndefined } from '@publisher/utils';
import { Button, Flex, Popover } from '@publisher/components';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { useAdvancedLabelProps } from '@publisher/hooks';
import { useBlockContext } from '@publisher/extensions/src/hooks/context';

/**
 * Internal dependencies
 */
import { GroupControl } from '../index';
import { getStatesGraph } from './states-graph';
import type {
	LabelControlProps,
	LabelStates,
	AdvancedLabelControlProps,
} from './types';
import type { StateTypes } from '@publisher/extensions/src/libs/block-states/types';

const StatesGraph = ({
	onClick,
	controlId,
	blockName,
	defaultValue,
}: {
	controlId: string,
	blockName: string,
	defaultValue: any,
	onClick: (state: string) => void,
}): null | MixedElement => {
	if (!controlId) {
		return null;
	}

	const renderedBreakpoints: Array<string> = [];

	const statesGraph = getStatesGraph({ controlId, blockName, defaultValue });

	return (
		<Flex
			direction={'column'}
			style={{
				marginBottom: '10px',
			}}
			className={controlInnerClassNames(
				'publisher-control-states-changes'
			)}
		>
			{statesGraph?.map(
				(state: LabelStates, index: number): null | MixedElement => {
					if ('undefined' === typeof state?.graph) {
						return null;
					}

					if (isEmpty(state.graph.states)) {
						return null;
					}

					const isRenderedBreakpoint = renderedBreakpoints.includes(
						state.graph.type
					);

					const renderedStates: Array<string> = [];

					renderedBreakpoints.push(state.graph.type);

					return (
						<Flex
							direction={'column'}
							key={`${state.graph.type}-${index}`}
						>
							{!isRenderedBreakpoint && (
								<div>{state.graph.label}</div>
							)}
							{state.graph.states?.map(
								(
									_state: StateTypes,
									_index: number
								): MixedElement | null => {
									if (renderedStates.includes(_state?.type)) {
										return null;
									}

									renderedStates.push(_state.type);

									const key = `${state.graph.type}-${index}-${_state.type}-${_index}-${controlId}`;

									const MappedHeader = () => {
										return [
											':' + _state.type.slice(0, 3),
											<div key={`${key}-label`}>
												{_state.label}
											</div>,
										];
									};

									return (
										<GroupControl
											mode={'nothing'}
											key={`${key}-state`}
											header={<MappedHeader />}
											onClick={() => onClick(_state.type)}
										/>
									);
								}
							)}
						</Flex>
					);
				}
			)}
		</Flex>
	);
};

const AdvancedLabelControl = ({
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
		return <></>;
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
				<span
					{...props}
					onClick={onClick ? onClick : () => setOpenModal(true)}
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
					aria-label={ariaLabel || label}
					data-cy="label-control"
					style={{
						cursor: 'pointer',
					}}
				>
					{label}
				</span>
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

const LabelControl = ({
	mode = 'simple',
	label = '',
	popoverTitle = '',
	path,
	singularId,
	className,
	ariaLabel = '',
	attribute,
	blockName,
	isRepeater = false,
	description,
	repeaterItem,
	resetToDefault,
	...props
}: LabelControlProps): MixedElement => {
	if ('advanced' === mode) {
		return (
			<AdvancedLabelControl
				{...{
					label,
					singularId,
					className,
					ariaLabel,
					attribute,
					blockName,
					isRepeater,
					description,
					popoverTitle,
					repeaterItem,
					resetToDefault,
					path: isRepeater ? path || attribute : path,
					...props,
				}}
			/>
		);
	}

	return (
		<>
			{label && (
				<span
					{...props}
					className={controlClassNames('label', className)}
					aria-label={ariaLabel || label}
					data-cy="label-control"
				>
					{label}
				</span>
			)}
		</>
	);
};

LabelControl.propTypes = {
	/**
	 * Label text
	 */
	label: PropTypes.string,
	/**
	 * Custom css classes
	 */
	className: PropTypes.string,
	/**
	 * Custom aria label for adding to label tag
	 */
	ariaLabel: PropTypes.string,
	/**
	 * The mode of label control
	 */
	// $FlowFixMe
	mode: PropTypes.oneOf(['simple', 'advanced']),
};

export default LabelControl;
