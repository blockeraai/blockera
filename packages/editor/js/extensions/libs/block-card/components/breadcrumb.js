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
import type { StateTypes } from '../../block-states/types';
import statesDefinition from '../../../libs/block-states/states';
import type { InnerBlockModel, InnerBlockType } from '../../inner-blocks/types';

export function Breadcrumb({
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
	innerBlocks: { [key: 'master' | InnerBlockType | string]: InnerBlockModel },
}): MixedElement {
	const { getBlockStates, getExtensionCurrentBlock } = select(
		'blockera/extensions'
	);
	const states = getBlockStates(clientId, blockName);

	// do not show normal state and inner block was not selected
	if (Object.keys(states).length <= 1 && !currentInnerBlock) {
		return <></>;
	}

	const innerBlockStates = getBlockStates(clientId, activeBlock);

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

	const { getBlockType } = select('core/blocks');

	const getInnerBlockDetails = (): Object => {
		if (innerBlocks[activeBlock]) {
			return innerBlocks[activeBlock];
		}

		const registeredBlock = getBlockType(getExtensionCurrentBlock());

		return {
			...registeredBlock,
			label: registeredBlock?.title,
		};
	};

	const innerBlock = getInnerBlockDetails();

	return (
		<>
			{Object.keys(states).length > 1 && states[masterActiveState] && (
				<CurrentState
					current={masterActiveState}
					definition={statesDefinition[masterActiveState]}
				/>
			)}

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
						aria-label={`${innerBlock.label} Inner Block`}
					>
						{innerBlock.label}
					</span>

					{0 !== Object.keys(innerBlockStates).length > 1 &&
						innerBlockStates[activeInnerBlockState] &&
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
