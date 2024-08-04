// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Button } from '../button';
import type { MoreFeaturesProps } from './types';
import { ChangeIndicator } from '../';

export default function MoreFeatures({
	isOpen: _isOpen = false,
	isChanged = false,
	label = __('More features', 'blockera'),
	ariaLabel = __('More features', 'blockera'),
	className,
	children,
	...props
}: MoreFeaturesProps): Node {
	const [isOpen, setIsOpen] = useState(_isOpen);

	return (
		<div
			className={componentClassNames(
				'more-features',
				isOpen && 'is-open',
				isChanged && 'is-changed'
			)}
			{...props}
		>
			<Button
				className={componentInnerClassNames(
					'more-features__button',
					className
				)}
				onClick={() => setIsOpen(!isOpen)}
				tabIndex={0}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						setIsOpen(!isOpen);
					}
				}}
				label={ariaLabel}
				showTooltip={!isOpen && label !== ariaLabel}
			>
				{isOpen ? (
					<Icon library="wp" icon="chevron-up" iconSize="20" />
				) : (
					<Icon library="wp" icon="chevron-down" iconSize="20" />
				)}

				{label}

				<ChangeIndicator isChanged={isChanged} />
			</Button>

			{isOpen && (
				<div
					className={componentInnerClassNames('more-features__body')}
				>
					{children}
				</div>
			)}
		</div>
	);
}
