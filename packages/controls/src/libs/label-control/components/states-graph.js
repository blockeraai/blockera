// @flow
/**
 * External Dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher Dependencies
 */
import { Flex } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';
import type { StateTypes } from '@publisher/extensions/src/libs/block-states/types';
import { isEmpty } from '@publisher/utils';

/**
 * Internal Dependencies
 */
import { GroupControl } from '../../index';
import type { LabelStates } from '../types';
import { getStatesGraph } from '../states-graph';

export const StatesGraph = ({
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
