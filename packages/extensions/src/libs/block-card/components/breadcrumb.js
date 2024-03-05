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
import statesDefinition from '../../../libs/block-states/states';
import type { StateTypes, TStates } from '../../block-states/types';
import type { InnerBlockModel, InnerBlockType } from '../../inner-blocks/types';

export function Breadcrumb({
	states,
	children,
	activeState,
	activeBlock,
	innerBlocks,
	currentInnerBlock,
	activeInnerBlockState,
}: {
	activeState: TStates,
	children?: MixedElement,
	activeInnerBlockState: TStates,
	activeBlock: 'master' | InnerBlockType,
	currentInnerBlock: InnerBlockModel | null,
	states: { [key: TStates]: { ...StateTypes, isSelected: boolean } },
	innerBlocks: { [key: 'master' | InnerBlockType | string]: InnerBlockModel },
}): MixedElement {
	// do not show normal state and inner block was not selected
	if (Object.keys(states).length <= 1 && !currentInnerBlock) {
		return <></>;
	}

	const CurrentState = ({
		current,
		definition,
	}: {
		current: { ...StateTypes, isSelected: boolean },
		definition: { label: string, type: string },
	}): MixedElement => {
		const { label, type } = definition;

		if (!current || !current?.isSelected || 'normal' === type) {
			return <></>;
		}

		return (
			<>
				<CaretIcon />
				<span
					className={extensionInnerClassNames(
						'block-card__title__item',
						'item-state',
						'item-state-' + type
					)}
				>
					{label}
				</span>
			</>
		);
	};

	return (
		<>
			<CurrentState
				current={states[activeState]}
				definition={statesDefinition[activeState]}
			/>

			{null !== currentInnerBlock && (
				<>
					<CaretIcon />
					<span
						className={extensionInnerClassNames(
							'block-card__title__item',
							'inner-block'
						)}
					>
						{innerBlocks[activeBlock].label}
					</span>
					{0 !==
						Object.keys(
							currentInnerBlock?.attributes
								?.publisherBlockStates || {}
						).length &&
						currentInnerBlock?.attributes?.publisherBlockStates[
							activeInnerBlockState
						] &&
						'normal' !== activeInnerBlockState && (
							<CurrentState
								current={
									currentInnerBlock?.attributes
										?.publisherBlockStates[
										activeInnerBlockState
									]
								}
								definition={
									statesDefinition[activeInnerBlockState]
								}
							/>
						)}
				</>
			)}

			{children}
		</>
	);
}
