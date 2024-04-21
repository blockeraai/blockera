// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import type { TStates } from '@blockera/extensions/src/libs/block-states/types';
import { controlInnerClassNames } from '@blockera/classnames';
import { Tooltip } from '@blockera/components';

export default function EditedItem({
	state,
	label,
	breakpoint,
	current = false,
	onClick = () => {},
	...props
}: {
	state: TStates,
	label: string,
	breakpoint: string,
	current: boolean,
	onClick: () => void,
}): MixedElement {
	return (
		<Tooltip
			text={sprintf(
				/* translators: %1$s: Breakpoint name, %2$s: Block state name */
				__('Switch To: %1$s → %2$s', 'blockera-core'),
				breakpoint,
				label
			)}
		>
			<div
				className={controlInnerClassNames(
					'states-changes-item',
					'state-' + state
				)}
				onClick={onClick}
				{...props}
			>
				{label}

				{current && (
					<span
						className={controlInnerClassNames(
							'states-changes-item-current'
						)}
					>
						{__('Current', 'blockera-core')}
					</span>
				)}
			</div>
		</Tooltip>
	);
}
