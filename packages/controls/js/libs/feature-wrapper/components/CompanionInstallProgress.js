// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { componentInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { FEATURE_WRAPPER_TEST_ID } from '../constants/testIds';

export function CompanionInstallProgress({
	value,
	message,
}: {
	value: number,
	message: string,
}): MixedElement {
	const clampedValue = Math.max(0, Math.min(100, value));
	const roundedValue = Math.round(clampedValue);

	return (
		<div
			data-test={FEATURE_WRAPPER_TEST_ID.companionInstallProgress}
			className={componentInnerClassNames(
				'feature-wrapper-companion-modal__progress'
			)}
		>
			<div
				className={componentInnerClassNames(
					'feature-wrapper-companion-modal__progress-header'
				)}
			>
				<p
					className={componentInnerClassNames(
						'feature-wrapper-companion-modal__progress-message'
					)}
				>
					{message}
				</p>

				<span
					className={componentInnerClassNames(
						'feature-wrapper-companion-modal__progress-percent'
					)}
					aria-hidden
				>
					{roundedValue}%
				</span>
			</div>

			<div
				className={componentInnerClassNames(
					'feature-wrapper-companion-modal__progress-track'
				)}
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={roundedValue}
				aria-label={message}
			>
				<div
					className={componentInnerClassNames(
						'feature-wrapper-companion-modal__progress-fill'
					)}
					style={{ width: `${clampedValue}%` }}
				>
					<span
						className={componentInnerClassNames(
							'feature-wrapper-companion-modal__progress-shimmer'
						)}
					/>
				</div>
			</div>
		</div>
	);
}
