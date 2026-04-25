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
import type { LockedFeatureSpec } from '../types';
import Flex from '../../flex';

function DefaultLockedIcon(): MixedElement {
	return <Icon icon="lock" iconSize="24" library="ui" />;
}

export function LockedFeatureShowcase({
	lockedFeature,
}: {
	lockedFeature: LockedFeatureSpec,
}): MixedElement {
	const { title, description, icon } = lockedFeature;

	let iconNode: MixedElement = <DefaultLockedIcon />;
	if (icon !== undefined && icon !== null && icon !== '') {
		if (typeof icon === 'string') {
			iconNode = <Icon icon={icon} iconSize="24" library="ui" />;
		} else {
			iconNode = icon;
		}
	}

	return (
		<div className={componentClassNames('upgrade-prompt-showcase')}>
			<span
				className={componentInnerClassNames(
					'upgrade-prompt-showcase__ribbon'
				)}
			>
				{__('WHERE YOU STOPPED', 'blockera')}
			</span>

			<Flex
				className={componentInnerClassNames(
					'upgrade-prompt-showcase__inner'
				)}
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				gap="10px"
			>
				<div
					className={componentInnerClassNames(
						'upgrade-prompt-showcase__icon'
					)}
				>
					{iconNode}
				</div>

				<Flex
					direction="column"
					alignItems="flex-start"
					justifyContent="flex-start"
					gap="2px"
					className={componentInnerClassNames(
						'upgrade-prompt-showcase__text'
					)}
					style={{
						flexGrow: 1,
					}}
				>
					<div
						className={componentInnerClassNames(
							'upgrade-prompt-showcase__title'
						)}
					>
						{title}
					</div>

					{description ? (
						<div
							className={componentInnerClassNames(
								'upgrade-prompt-showcase__desc'
							)}
						>
							{description}
						</div>
					) : null}
				</Flex>

				<div
					className={componentInnerClassNames(
						'upgrade-prompt-showcase__check'
					)}
				>
					<Icon icon="check" iconSize="18" library="ui" />
				</div>
			</Flex>
		</div>
	);
}
