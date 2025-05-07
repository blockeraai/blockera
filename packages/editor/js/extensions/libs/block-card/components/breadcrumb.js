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
import { Icon } from '@blockera/icons';
import { ucFirstWord, mergeObject } from '@blockera/utils';
import { extensionInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type {
	TStates,
	StateTypes,
	BlockStateType,
} from '../block-states/types';
import type { InnerBlockType } from '../inner-blocks/types';

export function Breadcrumb({
	children,
	clientId,
	blockName,
	activeBlock,
	availableStates,
	blockeraUnsavedData,
}: {
	clientId: string,
	blockName: string,
	children?: MixedElement,
	blockeraUnsavedData: Object,
	availableStates: { [key: TStates]: StateTypes },
	activeBlock?: 'master' | InnerBlockType,
}): MixedElement {
	const { getActiveInnerState, getActiveMasterState, getBlockExtensionBy } =
		select('blockera/extensions');

	const masterActiveState = getActiveMasterState(clientId, blockName);

	// do not show if is master and normal state
	if (!activeBlock && masterActiveState === 'normal') {
		return <>{children}</>;
	}

	const activeInnerBlockState = getActiveInnerState(clientId, activeBlock);

	// do not show if is inner block and normal state
	if (activeBlock && activeInnerBlockState === 'normal') {
		return <>{children}</>;
	}

	const { getStates, getInnerStates } = select('blockera/editor');
	let statesDefinition = getStates();

	if (activeBlock) {
		const targetBlockStates = getBlockExtensionBy(
			'targetBlock',
			activeBlock
		)?.availableBlockStates;

		if (targetBlockStates) {
			statesDefinition = mergeObject(getInnerStates(), targetBlockStates);
		} else {
			statesDefinition = getInnerStates();
		}
	}

	const CurrentState = ({
		current,
		definition,
	}: {
		current: string,
		definition: BlockStateType,
	}): MixedElement => {
		const { label, type } = definition;

		if (!current || 'normal' === type) {
			return <></>;
		}

		return (
			<>
				{isRTL() ? (
					<Icon
						className={extensionInnerClassNames(
							'block-card__title__separator'
						)}
						library="wp"
						icon="chevron-left"
						iconSize="16"
					/>
				) : (
					<Icon
						className={extensionInnerClassNames(
							'block-card__title__separator'
						)}
						library="wp"
						icon="chevron-right"
						iconSize="16"
					/>
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

	return (
		<>
			<CurrentState
				current={
					activeBlock ? activeInnerBlockState : masterActiveState
				}
				definition={
					activeBlock
						? statesDefinition[activeInnerBlockState] ||
						  (availableStates &&
						  availableStates.hasOwnProperty(activeInnerBlockState)
								? availableStates[activeInnerBlockState]
								: blockeraUnsavedData?.states[
										activeInnerBlockState
								  ])
						: statesDefinition[masterActiveState] ||
						  (availableStates &&
						  availableStates.hasOwnProperty(masterActiveState)
								? availableStates[masterActiveState]
								: blockeraUnsavedData?.states[
										masterActiveState
								  ])
				}
			/>

			{children}
		</>
	);
}
