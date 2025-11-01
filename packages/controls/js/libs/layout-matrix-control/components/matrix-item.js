// @flow

/**
 * External Dependencies
 */
import type { MixedElement } from 'react';

/**
 *  Blockera Dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { ConditionalWrapper, Tooltip } from '../../index';

export function MatrixItem({
	id,
	selected = false,
	normalIcon,
	selectedIcon,
	onClick,
	onMouseDown,
	tooltipText = '',
}: {
	id: string,
	selected: boolean,
	normalIcon: MixedElement,
	selectedIcon: MixedElement,
	onClick?: () => void,
	onMouseDown?: (event: MouseEvent) => void,
	tooltipText?: string | MixedElement,
}): MixedElement {
	return (
		<ConditionalWrapper
			condition={tooltipText !== ''}
			wrapper={(children) => (
				<Tooltip text={tooltipText}>{children}</Tooltip>
			)}
		>
			<span
				className={controlInnerClassNames(
					'matrix-item',
					'matrix-item-' + id,
					'matrix-item-' + (selected ? 'selected' : 'normal')
				)}
				onClick={onClick}
				onMouseDown={onMouseDown}
				tabIndex="0"
				data-test={`matrix-${id}-${selected ? 'selected' : 'normal'}`}
			>
				<span
					className={controlInnerClassNames(
						'matrix-item-icon',
						'matrix-item-icon-normal'
					)}
				>
					{normalIcon}
				</span>
				<span
					className={controlInnerClassNames(
						'matrix-item-icon',
						'matrix-item-icon-selected'
					)}
				>
					{selectedIcon}
				</span>
			</span>
		</ConditionalWrapper>
	);
}
