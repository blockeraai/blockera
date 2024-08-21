// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { isRTL } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { isEmpty, mergeObject, ucFirstWord } from '@blockera/utils';
import { extensionInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { StateTypes } from '../../block-states/types';
import statesDefinition from '../../../libs/block-states/states';
import type { InnerBlockModel, InnerBlockType } from '../../inner-blocks/types';

export function Breadcrumb({
	states,
	children,
	clientId,
	blockName,
	activeBlock,
	currentInnerBlock,
}: {
	clientId: string,
	blockName: string,
	states: StateTypes,
	children?: MixedElement,
	activeBlock?: 'master' | InnerBlockType,
	currentInnerBlock: InnerBlockModel | null,
}): MixedElement {
	const { getBlockStates } = select('blockera/extensions');

	const savedBlockStates = getBlockStates(clientId, blockName);

	if (isEmpty(states)) {
		// Sets initialize states ...
		states = savedBlockStates;
	} else {
		states = mergeObject(savedBlockStates, states);
	}

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

		if (!current || 'normal' === type) {
			return <></>;
		}

		return (
			<>
				{isRTL() ? (
					<Icon library="wp" icon="chevron-left" iconSize="16" />
				) : (
					<Icon library="wp" icon="chevron-right" iconSize="16" />
				)}

				<span
					className={extensionInnerClassNames(
						'block-card__title__item',
						'item-state',
						'item-state-' + type
					)}
					aria-label={`${ucFirstWord(type)} State`}
				>
					{label}
				</span>
			</>
		);
	};

	const { getActiveInnerState, getActiveMasterState } = select(
		'blockera/extensions'
	);
	const masterActiveState = getActiveMasterState(clientId, blockName);
	const activeInnerBlockState = getActiveInnerState(clientId, activeBlock);

	return (
		<>
			{Object.keys(states).length > 1 &&
				states[
					activeBlock ? activeInnerBlockState : masterActiveState
				] && (
					<CurrentState
						current={
							activeBlock
								? activeInnerBlockState
								: masterActiveState
						}
						definition={
							statesDefinition[
								activeBlock
									? activeInnerBlockState
									: masterActiveState
							]
						}
					/>
				)}

			{children}
		</>
	);
}
