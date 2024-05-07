// @flow
/**
 * External Dependencies
 */
import type { MixedElement } from 'react';

/**
 *  Dependencies
 */
import { isEmpty } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';
import type { TStates } from '@blockera/editor-extensions/js/libs/block-states/types';
import { BreakpointIcon } from '@blockera/editor-extensions/js/libs/block-states/helpers';

/**
 * Internal Dependencies
 */
import type { LabelStates } from '../types';
import { getStatesGraph } from '../states-graph';
import EditedItem from './edited-item';

export const StatesGraph = ({
	onClick,
	controlId,
	blockName,
	defaultValue,
}: {
	controlId: string,
	blockName: string,
	defaultValue: any,
	onClick: (state: TStates) => void,
}): null | MixedElement => {
	if (!controlId) {
		return null;
	}

	const renderedBreakpoints: Array<string> = [];

	const statesGraph = getStatesGraph({ controlId, blockName, defaultValue });

	if (statesGraph.length === 0) {
		return <></>;
	}

	return (
		<div className={controlInnerClassNames('states-changes')}>
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
						<div
							className={controlInnerClassNames(
								'states-changes-breakpoint'
							)}
							key={`${state.graph.type}-${index}`}
						>
							{!isRenderedBreakpoint && (
								<div
									className={controlInnerClassNames(
										'states-changes-breakpoint-title'
									)}
								>
									<BreakpointIcon name={state.graph.type} />
									{state.graph.label}
								</div>
							)}

							<div
								className={controlInnerClassNames(
									'states-changes-items'
								)}
							>
								{state.graph.states?.map(
									(
										_state: Object,
										_index: number
									): MixedElement | null => {
										if (
											renderedStates.includes(
												_state?.type
											)
										) {
											return null;
										}

										renderedStates.push(_state.type);

										const key = `${state.graph.type}-${index}-${_state.type}-${_index}-${controlId}`;

										return (
											<EditedItem
												label={_state.label}
												state={_state.type}
												breakpoint={state.graph.label}
												key={`${key}-state`}
												onClick={(): void => {
													onClick(_state.type);
												}}
												current={false}
											/>
										);
									}
								)}
							</div>
						</div>
					);
				}
			)}
		</div>
	);
};