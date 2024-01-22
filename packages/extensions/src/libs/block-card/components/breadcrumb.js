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
import type { InnerBlockModel, InnerBlockType } from '../../inner-blocks/types';

export function Breadcrumb({
	states,
	children,
	innerBlock,
	innerBlocks = [],
}: {
	states: Object,
	children?: MixedElement,
	innerBlock?: InnerBlockType,
	innerBlocks: Array<InnerBlockModel>,
}): MixedElement {
	// do not show normal state and inner block was not selected
	if (states.length <= 1 && !innerBlock) {
		return <></>;
	}

	const innerBlockName =
		innerBlocks.length &&
		innerBlocks.find(
			(_innerBlock: InnerBlockModel) => _innerBlock.type === innerBlock
		);

	return (
		<>
			{innerBlock && innerBlockName && (
				<>
					<CaretIcon />
					<span
						className={extensionInnerClassNames(
							'block-card__title__item',
							'inner-block'
						)}
					>
						{innerBlockName.label}
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
