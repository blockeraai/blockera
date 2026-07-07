// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
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
import type { ProHighlightSpec } from '../types';
import Flex from '../../flex';
import { SITE_EDITOR_FULL_FEATURES_URL } from '../products/blockera-site-editor';

export function ProHighlightsList({
	highlights,
	heading = __('All Pro Features', 'blockera'),
}: {
	highlights: Array<ProHighlightSpec>,
	heading?: string,
}): MixedElement {
	return (
		<div className={componentClassNames('upgrade-prompt-highlights')}>
			{heading && (
				<p
					className={componentInnerClassNames(
						'upgrade-prompt-highlights__heading'
					)}
				>
					{heading}
				</p>
			)}

			{highlights.map((item, index) => (
				<Flex
					key={index}
					className={componentInnerClassNames(
						'upgrade-prompt-highlights__row'
					)}
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					gap="10px"
				>
					<div
						className={componentInnerClassNames(
							'upgrade-prompt-highlights__icon'
						)}
					>
						{item.icon ?? (
							<Icon
								icon="check-circle"
								iconSize="22"
								library="ui"
							/>
						)}
					</div>

					<div
						className={componentInnerClassNames(
							'upgrade-prompt-highlights__body'
						)}
					>
						<div
							className={componentInnerClassNames(
								'upgrade-prompt-highlights__title'
							)}
						>
							{item.title}
						</div>

						{item.description && (
							<div
								className={componentInnerClassNames(
									'upgrade-prompt-highlights__desc'
								)}
							>
								{item.description}
							</div>
						)}
					</div>
					<div
						className={componentInnerClassNames(
							'upgrade-prompt-highlights__check'
						)}
					>
						<Icon icon="check" iconSize="18" library="ui" />
					</div>
				</Flex>
			))}

			<div
				className={componentInnerClassNames(
					'upgrade-prompt-content__more-row'
				)}
			>
				<span
					className={componentInnerClassNames(
						'upgrade-prompt-content__more'
					)}
				>
					{__('Plus many more Pro features', 'blockera')}
				</span>

				<a
					className={componentInnerClassNames(
						'upgrade-prompt-content__see-all'
					)}
					href={SITE_EDITOR_FULL_FEATURES_URL}
					target="_blank"
					rel="noreferrer"
				>
					{__('See full list', 'blockera')}
					<span aria-hidden="true"> →</span>
				</a>
			</div>
		</div>
	);
}
