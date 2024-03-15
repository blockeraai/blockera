// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@publisher/classnames';
import { Button } from '@publisher/components';

/**
 * Internal dependencies
 */
import type { MoreFeaturesProps } from './types';
import CaretIcon from './icons/caret';

export default function MoreFeatures({
	isOpen: _isOpen = false,
	isChanged = false,
	label = __('More features', 'publisher'),
	ariaLabel = __('More features', 'publisher'),
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
				<CaretIcon isOpen={isOpen} />

				{label}

				{isChanged && (
					<span
						className={componentInnerClassNames(
							'more-features__button__changed'
						)}
					/>
				)}
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
