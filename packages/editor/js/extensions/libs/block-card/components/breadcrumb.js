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
import {
	default as statesDefinition,
	type BlockStateType,
} from '../../../libs/block-states/states';
import type { InnerBlockType } from '../../inner-blocks/types';

export function Breadcrumb({
	children,
	clientId,
	blockName,
	activeBlock,
}: {
	clientId: string,
	blockName: string,
	children?: MixedElement,
	activeBlock?: 'master' | InnerBlockType,
}): MixedElement {
	const { getActiveInnerState, getActiveMasterState } = select(
		'blockera/extensions'
	);

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
						? statesDefinition[activeInnerBlockState]
						: statesDefinition[masterActiveState]
				}
			/>

			{children}
		</>
	);
}
