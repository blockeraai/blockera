// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { extensionInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { CaretIcon } from '../icons';
import type { InnerBlockModel } from '../../inner-blocks/types';
import type { StateTypes } from '../../block-states/types';

export function Breadcrumb({
	states,
	children,
	currentInnerBlock,
}: {
	states: Array<{ ...StateTypes, isSelected: boolean }>,
	children?: MixedElement,
	currentInnerBlock: InnerBlockModel,
}): MixedElement {
	// do not show normal state and inner block was not selected
	if (states.length <= 1 && !currentInnerBlock) {
		return <></>;
	}

	const States = ({
		_states,
	}: {
		_states: Array<{ ...StateTypes, isSelected: boolean }>,
	}) =>
		_states
			.filter((value) => value?.isSelected && value?.type !== 'normal')
			.map((value) => (
				<>
					<CaretIcon />
					<span
						className={extensionInnerClassNames(
							'block-card__title__item',
							'item-state',
							'item-state-' + value.type
						)}
					>
						{value.label}
					</span>
				</>
			));

	return (
		<>
			<States _states={states} />

			{!Array.isArray(currentInnerBlock) && (
				<>
					<CaretIcon />
					<span
						className={extensionInnerClassNames(
							'block-card__title__item',
							'inner-block'
						)}
					>
						{currentInnerBlock.label}
					</span>
					<States
						_states={
							currentInnerBlock?.attributes
								?.publisherBlockStates || []
						}
					/>
				</>
			)}

			{children}
		</>
	);
}
