// @flow

/**
 * External Dependencies
 */
import type { MixedElement } from 'react';

/**
 *  Dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

export function MatrixItem({
	id,
	selected = false,
	normalIcon,
	selectedIcon,
	onClick,
	onMouseDown,
}: {
	id: string,
	selected: boolean,
	normalIcon: MixedElement,
	selectedIcon: MixedElement,
	onClick?: () => void,
	onMouseDown?: (event: MouseEvent) => void,
}): MixedElement {
	return (
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
	);
}
