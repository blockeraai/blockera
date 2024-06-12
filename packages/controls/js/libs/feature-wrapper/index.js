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
import WarningIcon from '../notice-control/icons/warning-icon';

/**
 * Internal dependencies
 */
import { ProIcon } from './icons/pro-icon';

export function FeatureWrapper({
	type,
	typeName = '',
	text = '',
	children,
	className = '',
	showText = 'on-hover',
	...props
}: {
	type: 'free' | 'state' | 'breakpoint' | 'inner-block' | 'parent-inactive',
	typeName?: string,
	text?: string | MixedElement,
	className?: string,
	showText?: 'on-hover' | 'always',
	children: MixedElement,
}): MixedElement {
	let icon = <WarningIcon />;

	if (!text) {
		switch (type) {
			case 'free':
				text = __('Upgrade to PRO', 'blockera');
				icon = <ProIcon />;
				break;
			case 'state':
				text = typeName
					? sprintf(
							/* translators: %s is a state name. */
							__('Only available in %s state!', 'blockera'),
							typeName
					  )
					: __('Not available in current state!', 'blockera');
				break;
			case 'breakpoint':
				text = typeName
					? sprintf(
							/* translators: %s is a breakpoint name. */
							__('Only available in %s breakpoint!', 'blockera'),
							typeName
					  )
					: __('Not available in current breakpoint!', 'blockera');
				break;
			case 'inner-block':
				text = typeName
					? sprintf(
							/* translators: %s is a breakpoint name. */
							__('Only available in %s inner block!', 'blockera'),
							typeName
					  )
					: __('Not available in current inner block!', 'blockera');
				break;

			case 'parent-inactive':
				text = typeName
					? sprintf(
							/* translators: %s is a breakpoint name. */
							__('Only available when %s is active.', 'blockera'),
							typeName
					  )
					: sprintf(
							/* translators: %s is a breakpoint name. */
							__(
								'Not available when %s is inactive!',
								'blockera'
							),
							typeName
					  );
				break;
		}
	}

	return (
		<div
			className={componentClassNames(
				'feature-wrapper',
				'type-' + type,
				'show-text-' + showText,
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
