// @flow
/**
 * External dependencies
 */
import { type MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

export function FeatureWrapper({
	type,
	typeName = '',
	upgradeLink = 'https://blockera.ai/products/site-builder/upgrade/?utm_source=feature-wrapper&utm_medium=referral&utm_campaign=upgrade-feature-wrapper&utm_content=cta-link',
	text = '',
	children,
	className = '',
	showText = 'on-hover',
	...props
}: {
	type:
		| 'native'
		| 'state'
		| 'breakpoint'
		| 'inner-block'
		| 'parent-inactive'
		| 'none',
	upgradeLink?: string,
	typeName?: string,
	text?: string | MixedElement,
	className?: string,
	showText?: 'on-hover' | 'always',
	children: MixedElement,
}): MixedElement {
	if ('none' === type) {
		return children;
	}

	let icon = (
		<Icon
			icon="warning"
			iconSize="22"
			className={componentInnerClassNames(
				'feature-wrapper__notice__icon'
			)}
		/>
	);
	let icon2 = null;
	let link = '';

	if (!text) {
		switch (type) {
			case 'native':
				text = __('Upgrade to PRO', 'blockera');
				icon = (
					<Icon
						icon="lock"
						iconSize="22"
						className={componentInnerClassNames(
							'feature-wrapper__notice__icon'
						)}
					/>
				);
				icon2 = (
					<Icon
						icon="unlock"
						iconSize="22"
						className={componentInnerClassNames(
							'feature-wrapper__notice__icon-2'
						)}
					/>
				);
				link = upgradeLink;
				break;
			case 'state':
				text = typeName
					? sprintf(
							/* translators: %s is a state name. */
							__('Only available in %1$s state%2$s!', 'blockera'),
							typeName.replace(/,(?=[^,]*$)/, ', and '),
							typeName.includes(', ') ? 's' : ''
					  )
					: __('Not available in current state!', 'blockera');
				break;
			case 'breakpoint':
				text = typeName
					? sprintf(
							/* translators: %s is a breakpoint name. */
							__(
								'Only available in %1$s breakpoint%2$s!',
								'blockera'
							),
							typeName.replace(/,(?=[^,]*$)/, ', and '),
							typeName.includes(', ') ? 's' : ''
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
	} else {
		link = upgradeLink;
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
				<div
					className={componentInnerClassNames(
						'feature-wrapper__notice__icons',
						icon2 ? 'icons-2' : ''
					)}
				>
					{icon}
					{icon2}
				</div>

				{link ? (
					<a
						href={link}
						target="_blank"
						rel="noreferrer"
						className={componentInnerClassNames(
							'feature-wrapper__notice__text',
							'feature-wrapper__notice__text__link'
						)}
					>
						{text}
					</a>
				) : (
					<div
						className={componentInnerClassNames(
							'feature-wrapper__notice__text'
						)}
					>
						{text}
					</div>
				)}
			</div>

			<div
				className={componentInnerClassNames(
					'feature-wrapper__children'
				)}
				style={{ pointerEvents: 'none' }}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onMouseDown={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onMouseUp={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onTouchStart={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onTouchEnd={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				{children}
			</div>
		</div>
	);
}
