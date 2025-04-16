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
	componentInnerClassNames,
	componentClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import Flex from '../../flex';
import { default as Logo } from '../icons/logo.svg';

export const Promoter = ({
	design = 'light',
	icon = <Logo />,
	heading = __('It’s a PRO Feature', 'blockera'),
	description = (
		<p>{__('Elevate Your Design with Premium Features:', 'blockera')}</p>
	),
	featuresList = [
		__('All responsive breakpoints', 'blockera'),
		__('All block states', 'blockera'),
		__('Advanced features', 'blockera'),
		__('Premium blocks', 'blockera'),
	],
	disableHintsText = __(
		'You can disable the Pro hints in the settings panel.',
		'blockera'
	),
	buttonURL = 'https://blockera.ai/products/site-builder/upgrade/',
	buttonText = __('Upgrade to PRO', 'blockera'),
	buttonTarget = '_blank',
	style,
	...props
}: {
	design?: 'light' | 'dark',
	icon?: string | MixedElement,
	heading?: string,
	description?: string | MixedElement,
	disableHintsText?: string | MixedElement,
	featuresList?: Array<string>,
	buttonURL?: string,
	buttonText?: string,
	buttonTarget?: string,
	style?: Object,
}): MixedElement => {
	return (
		<Flex
			className={componentClassNames('promoter', 'design-' + design)}
			direction="column"
			alignItems="center"
			justifyContent="center"
			gap={'20px'}
			style={style}
			{...props}
		>
			{icon && (
				<div className={componentInnerClassNames('promoter__image')}>
					{icon}
				</div>
			)}

			{heading && (
				<h3 className={componentInnerClassNames('promoter__heading')}>
					{heading}
				</h3>
			)}

			<Flex
				direction="column"
				alignItems="center"
				justifyContent="center"
				gap={'10px'}
			>
				{description && (
					<div
						className={componentInnerClassNames(
							'promoter__description'
						)}
					>
						{description}
					</div>
				)}

				{featuresList.length > 0 && (
					<ul className={componentInnerClassNames('promoter__list')}>
						{featuresList.map((feature, index) => (
							<li key={index}>
								<Icon icon="check" iconSize="20" />
								{feature}
							</li>
						))}
					</ul>
				)}
			</Flex>

			<Flex
				direction="column"
				alignItems="center"
				justifyContent="center"
				gap={'10px'}
				style={{ width: '100%' }}
			>
				{buttonURL && (
					<a
						className={componentInnerClassNames(
							'promoter__button',
							'components-button',
							'blockera-component-button',
							'is-primary'
						)}
						href={buttonURL}
						target={buttonTarget}
						rel="noreferrer"
					>
						{buttonText}
					</a>
				)}

				{disableHintsText && (
					<div
						className={componentInnerClassNames(
							'promoter__description disable-pro-hints'
						)}
					>
						{disableHintsText}
					</div>
				)}
			</Flex>
		</Flex>
	);
};
