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
import type { InnerBlockType } from '../../inner-blocks/types';

export function Breadcrumb({
	states,
	children,
	innerBlock,
}: {
	states: Object,
	children?: MixedElement,
	innerBlock?: InnerBlockType,
}): MixedElement {
	// do not show normal state and inner block was not selected
	if (states.length <= 1 && !innerBlock) {
		return <></>;
	}

	return (
		<>
			{innerBlock && (
				<>
					<CaretIcon />
					<span
						className={extensionInnerClassNames(
							'block-card__title__item',
							'inner-block'
						)}
					>
						{innerBlock}
					</span>
				</>
			)}
			{states
				.filter(
					(value) => value?.isSelected && value?.type !== 'normal'
				)
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
				))}
			{children}
		</>
	);
}
