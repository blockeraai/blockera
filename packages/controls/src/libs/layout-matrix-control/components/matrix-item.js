// @flow

/**
 * External Dependencies
 */
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

import { controlInnerClassNames } from '@publisher/classnames';
import { useLateEffect } from '@publisher/utils';

export function MatrixItem({
	id,
	selected = false,
	normalIcon,
	selectedIcon,
	hoverIcon,
	onClick,
	onMouseDown,
}: {
	id: string,
	selected: boolean,
	normalIcon: MixedElement,
	hoverIcon: MixedElement,
	selectedIcon: MixedElement,
	onClick?: () => void,
	onMouseDown?: (event: MouseEvent) => void,
}): MixedElement {
	const [itemState, setItemState] = useState(
		selected ? 'selected' : 'normal'
	);

	useLateEffect(() => {
		setItemState(selected ? 'selected' : 'normal');
	}, [selected]);

	return (
		<span
			className={controlInnerClassNames(
				'matrix-item',
				'matrix-item-' + id,
				'matrix-item-' + itemState
			)}
			onClick={onClick}
			onMouseDown={onMouseDown}
			tabIndex="0"
			{...(itemState !== 'selected'
				? {
						onMouseEnter: () => {
							if (itemState === 'selected') {
								return;
							}

							setItemState('hover');
						},
						onMouseLeave: () => {
							if (itemState === 'selected') {
								return;
							}

							setItemState('normal');
						},
						onKeyDown: (event) => {
							if (itemState === 'selected') {
								return;
							}

							if (
								event.code === 'Enter' ||
								event.code === 'NumpadEnter'
							) {
								event.preventDefault();
								setItemState('selected');

								if (onClick) {
									onClick();
								}
							}
						},
				  }
				: {})}
		>
			{itemState === 'normal' && normalIcon}
			{itemState === 'hover' && hoverIcon}
			{itemState === 'selected' && selectedIcon}
		</span>
	);
}
