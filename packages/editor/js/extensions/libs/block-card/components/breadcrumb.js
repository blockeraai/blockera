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
import { ucFirstWord } from '@blockera/utils';
import { extensionInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import statesDefinition from '../../../libs/block-states/states';
import type { StateTypes, TStates } from '../../block-states/types';
import type { InnerBlockModel, InnerBlockType } from '../../inner-blocks/types';

export function Breadcrumb({
	states,
	children,
	clientId,
	blockName,
	activeBlock,
	innerBlocks,
	currentInnerBlock,
}: {
	clientId: string,
	blockName: string,
	children?: MixedElement,
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
			<CurrentState
				current={masterActiveState}
				definition={statesDefinition[masterActiveState]}
			/>

			{null !== currentInnerBlock && (
				<>
					{isRTL() ? (
						<Icon library="wp" icon="chevron-left" iconSize="16" />
					) : (
						<Icon library="wp" icon="chevron-right" iconSize="16" />
					)}

					<span
						className={extensionInnerClassNames(
							'block-card__title__item',
							'inner-block'
						)}
						aria-label={`${innerBlocks[activeBlock].label} Inner Block`}
					>
						{innerBlocks[activeBlock].label}
					</span>

					{0 !==
						Object.keys(
							currentInnerBlock?.attributes
								?.blockeraBlockStates || {}
						).length &&
						currentInnerBlock?.attributes?.blockeraBlockStates[
							activeInnerBlockState
						] &&
						'normal' !== activeInnerBlockState && (
							<CurrentState
								current={activeInnerBlockState}
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
