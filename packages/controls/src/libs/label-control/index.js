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
import { useBlockContext } from '@publisher/extensions/src/hooks/context';

/**
 * Internal dependencies
 */
import { GroupControl } from '../index';
import { getStatesGraph } from './states-graph';
import type {
	LabelStates,
	LabelControlProps,
	AdvancedLabelControlProps,
} from './types';

const StatesGraph = ({
	controlId,
	blockName,
}: {
	controlId: string,
	blockName: string,
}): null | MixedElement => {
	if (!controlId) {
		return null;
	}

	const renderedBreakpoints = [];

	const statesGraph = getStatesGraph({ controlId, blockName });

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
			{statesGraph?.map((state, index) => {
				const breakpoint = state?.graph;

				if (isEmpty(breakpoint.states)) {
					return null;
				}

				const isRenderedBreakpoint = renderedBreakpoints.includes(
					breakpoint.type
				);

				const renderedStates = [];

				renderedBreakpoints.push(breakpoint.type);

				return (
					<Flex
						direction={'column'}
						key={`${breakpoint.type}-${index}`}
					>
						{!isRenderedBreakpoint && <div>{breakpoint.label}</div>}
						{breakpoint.states?.map((state, _index) => {
							if (renderedStates.includes(state?.type)) {
								return null;
							}

							renderedStates.push(state.type);

							const key = `${breakpoint.type}-${index}-${state.type}-${_index}-${controlId}`;

							const MappedHeader = () => {
								return [
									':' + state.type.slice(0, 3),
									<div key={`${key}-label`}>
										{state.label}
									</div>,
								];
							};

							return (
								<GroupControl
									mode={'nothing'}
									key={`${key}-state`}
									header={<MappedHeader />}
								/>
							);
						})}
					</Flex>
				);
			})}
		</Flex>
	);
};

const AdvancedLabelControl = ({
	path = null,
	label,
	fieldId,
	className,
	ariaLabel,
	attribute,
	blockName,
	description,
	repeaterItem,
	resetToDefault,
	...props
}: AdvancedLabelControlProps): null | MixedElement => {
	const [isOpenModal, setOpenModal] = useState(false);
	const { getBreakpoint, isNormalState, getAttributes, getCurrentState } =
		useBlockContext();

	if ('undefined' === typeof attribute || 'undefined' === typeof blockName) {
		return null;
	}

	const states = getStatesGraph({ controlId: attribute, blockName });
	const currentGraph = states.find(
		(state: LabelStates) => state?.graph?.type === getBreakpoint()?.type
	);

	const isChangedValue =
		'undefined' !== typeof currentGraph &&
		currentGraph?.isChangedState(getCurrentState());

	const normalHasChanges = currentGraph?.changedStates.find(
		(state) => 'normal' === state.type
	);

	const isChangedInOtherStates =
		'undefined' !== typeof currentGraph &&
		currentGraph?.changedStates?.length > 0;

	return (
		<>
			{label && (
				<span
					{...props}
					onClick={() =>
						(isChangedValue || isChangedInOtherStates) &&
						setOpenModal(true)
					}
					className={controlClassNames('label', className, {
						'changed-in-other-state':
							'undefined' !== typeof currentGraph &&
							isChangedInOtherStates,
						'changed-in-normal-state':
							(isNormalState() && isChangedValue) ||
							normalHasChanges,
						'changed-in-secondary-state':
							!isNormalState() && isChangedValue,
					})}
					aria-label={ariaLabel || label}
					data-cy="label-control"
					style={{
						cursor:
							isChangedValue || isChangedInOtherStates
								? 'pointer'
								: 'auto',
					}}
				>
					{label}
				</span>
			)}
			{isOpenModal && (isChangedValue || isChangedInOtherStates) && (
				<Popover
					offset={35}
					title={label}
					onClose={() => setOpenModal(!isOpenModal)}
					placement={'left-start'}
				>
					{isFunction(description) ? description() : description}

					<StatesGraph controlId={attribute} blockName={blockName} />

					<Button
						variant={'primary'}
						text={__('Reset To Default', 'publisher-core')}
						label={__('Reset To Default', 'publisher-core')}
						onClick={() => {
							if (
								!resetToDefault ||
								!isFunction(resetToDefault)
							) {
								return;
							}

							setOpenModal(!isOpenModal);

							if (
								isNull(path) ||
								isEmpty(path) ||
								isUndefined(path)
							) {
								return resetToDefault();
							}

							resetToDefault({
								path,
								repeaterItem,
								propId: fieldId,
							});
						}}
					/>

					{!isNormalState() && (
						<Button
							variant={'primary'}
							text={__('Reset To Normal', 'publisher-core')}
							label={__('Reset To Normal', 'publisher-core')}
							onClick={() => {
								if (
									!resetToDefault ||
									!isFunction(resetToDefault)
								) {
									return;
								}

								setOpenModal(!isOpenModal);

								if (
									isNull(path) ||
									isEmpty(path) ||
									isUndefined(path)
								) {
									return resetToDefault();
								}

								resetToDefault({
									path,
									repeaterItem,
									propId: fieldId,
									attributes: getAttributes(),
								});
							}}
						/>
					)}
				</Popover>
			)}
		</>
	);
};

const LabelControl = ({
	mode = 'simple',
	label = '',
	path,
	fieldId,
	className,
	ariaLabel = '',
	attribute,
	blockName,
	description,
	repeaterItem,
	resetToDefault,
	...props
}: LabelControlProps): MixedElement => {
	if ('advanced' === mode || isFunction(resetToDefault)) {
		return (
			<AdvancedLabelControl
				{...{
					label,
					fieldId,
					className,
					ariaLabel,
					attribute,
					blockName,
					description,
					repeaterItem,
					resetToDefault,
					path: path || attribute,
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
