// @flow
/**
 * External dependencies
 */
import type { MixedElement, Node } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import DynamicHtmlFormatter from '../dynamic-html-formatter';
import Flex from '../flex';
import { Tooltip } from '../tooltip';

type PoweredByProps = {
	preText?: string,
	postText?: string,
	tooltipText?: string | MixedElement,
	showTooltip?: boolean,
	clickable?: boolean,
	href?: string,
	icon?: string,
	iconLibrary?: string,
	iconSize?: number,
	tooltipDelay?: number,
	tooltipBg?: string,
	primaryColor?: string,
	className?: string,
	linkTabIndex?: number,
	style?: Object,
};

const DEFAULT_HREF =
	'https://blockera.ai/products/site-builder/?utm_source=block-section-powered-by&utm_medium=referral&utm_campaign=powered-by&utm_content=cta-link';

export function getDefaultPoweredByText({
	type = 'powered-by',
	icon,
	iconLibrary,
	iconSize,
}: {
	type?: 'powered-by' | 'empowered-by',
	icon: string,
	iconLibrary: string,
	iconSize: number,
}): MixedElement {
	let template =
		type === 'empowered-by'
			? sprintf(
					// translators: %s is the brand name (Required)
					__('Empowered by %s', 'blockera'),
					'{brand-name}'
				)
			: sprintf(
					// translators: %s is the brand name (Required)
					__('Powered by %s', 'blockera'),
					'{brand-name}'
				);

	// For backward brand name to prevent removing it
	if (!template.includes('{brand-name}')) {
		if (type === 'powered-by') {
			template = 'Powered by {brand-name}';
		} else {
			template = 'Empowered by {brand-name}';
		}
	}

	return (
		<Flex direction="row" alignItems="center" gap="8px">
			{DynamicHtmlFormatter({
				text: template,
				replacements: {
					'brand-name': (
						<>
							<Icon
								icon={icon}
								library={iconLibrary}
								iconSize={iconSize}
							/>
							Blockera Site Builder
						</>
					),
				},
			})}
		</Flex>
	);
}

export function PoweredBy({
	preText = '',
	postText = '',
	tooltipText = '',
	showTooltip = true,
	clickable = true,
	href = DEFAULT_HREF,
	icon = 'blockera',
	iconLibrary = 'blockera',
	iconSize = 18,
	tooltipDelay = 0,
	tooltipBg = '#0051e7',
	primaryColor = '#0051e7',
	className = '',
	style = {},
	linkTabIndex,
}: PoweredByProps): Node {
	// Empty string (default) means: use built-in “Powered by {brand-name}” tooltip.
	const resolvedTooltipText: string | MixedElement = tooltipText
		? tooltipText
		: getDefaultPoweredByText({
				icon,
				iconLibrary,
				iconSize,
			});

	const linkProps =
		clickable && linkTabIndex !== undefined
			? { tabIndex: linkTabIndex }
			: {};

	const inner = clickable ? (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="blockera-powered-by__icon"
			{...linkProps}
		>
			{preText}
			<Icon library={iconLibrary} icon={icon} iconSize={iconSize} />
			{postText}
		</a>
	) : (
		<span className="blockera-powered-by__icon">
			{preText}
			<Icon library={iconLibrary} icon={icon} iconSize={iconSize} />
			{postText}
		</span>
	);

	const body = showTooltip ? (
		<Tooltip
			text={resolvedTooltipText}
			style={{
				'--tooltip-bg': tooltipBg,
			}}
			delay={tooltipDelay}
		>
			{inner}
		</Tooltip>
	) : (
		inner
	);

	return (
		<span
			className={classNames('blockera-powered-by', className)}
			style={{
				'--blockera-controls-primary-color': primaryColor,
				...style,
			}}
		>
			{body}
		</span>
	);
}
