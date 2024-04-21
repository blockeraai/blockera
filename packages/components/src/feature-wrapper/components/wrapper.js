// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import WarningIcon from '@blockera/controls/src/libs/notice-control/icons/warning-icon';

/**
 * Internal dependencies
 */
import { ProIcon } from '../icons/pro-icon';

export function Wrapper({
	type,
	typeName = '',
	text = '',
	children,
	className = '',
	...props
}: {
	type: 'free' | 'state' | 'breakpoint',
	typeName?: string,
	text?: string | MixedElement,
	className?: string,
	children: MixedElement,
}): MixedElement {
	let icon = <WarningIcon />;

	if (!text) {
		switch (type) {
			case 'free':
				text = __('Upgrade to PRO', 'blockera-core');
				icon = <ProIcon />;
				break;
			case 'state':
				text = typeName
					? sprintf(
							/* translators: %s is a state name. */
							__('Only available in %s state', 'blockera-core'),
							typeName
					  )
					: __('Not available in current state', 'blockera-core');
				break;
			case 'breakpoint':
				text = typeName
					? sprintf(
							/* translators: %s is a breakpoint name. */
							__(
								'Only available in %s breakpoint',
								'blockera-core'
							),
							typeName
					  )
					: __(
							'Not available in current breakpoint.',
							'blockera-core'
					  );
				break;
		}
	}

	return (
		<div
			className={componentClassNames(
				'feature-wrapper',
				'type-' + type,
				className
			)}
			{...props}
		>
			<div
				className={componentInnerClassNames('feature-wrapper__notice')}
			>
				{icon}

				<div
					className={componentInnerClassNames(
						'feature-wrapper__notice__text'
					)}
				>
					{text}
				</div>
			</div>

			<div
				className={componentInnerClassNames(
					'feature-wrapper__children'
				)}
				onClick={(e) => {
					e.preventDefault();
				}}
			>
				{children}
			</div>
		</div>
	);
}
