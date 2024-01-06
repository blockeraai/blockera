// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import type { TStates } from '@publisher/extensions/src/libs/block-states/types';
import { controlInnerClassNames } from '@publisher/classnames';
import { Tooltip } from '@publisher/components';

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
				__('Switch To: %1$s → %2$s', 'publisher-core'),
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
						{__('Current', 'publisher-core')}
					</span>
				)}
			</div>
		</Tooltip>
	);
}
