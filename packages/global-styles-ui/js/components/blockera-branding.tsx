/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
/**
 * Blockera dependencies
 */
import { Tooltip, DynamicHtmlFormatter, Flex } from '@blockera/controls';
import { Icon } from '@blockera/icons';

export interface BlockeraBrandingProps {
	/** Extra class on the anchor (e.g. for layout hooks). */
	linkClassName?: string;
	/** Pixel size for the icon in the trigger link. */
	iconSize?: number | string;
	/** Pixel size for the icon in the tooltip “Powered by” row. */
	tooltipBrandIconSize?: number | string;
}

/**
 * “Powered by Blockera” tooltip + product link. Reusable next to headings or other UI.
 */
export function BlockeraBranding({
	linkClassName = '',
	iconSize = 16,
	tooltipBrandIconSize = 18,
}: BlockeraBrandingProps) {
	let text = sprintf(
		// translators: %s is the brand name (Required)
		__('Powered by %s', 'blockera'),
		'{brand-name}'
	);

	// For backward brand name to prevent removing it
	if (!text.includes('{brand-name}')) {
		text = 'Powered by {brand-name}';
	}

	const formatted = DynamicHtmlFormatter({
		text,
		replacements: {
			'brand-name': (
				<Flex direction="row" alignItems="center" gap="8px">
					<Icon
						icon="blockera"
						library="blockera"
						iconSize={tooltipBrandIconSize}
					/>
					Blockera Site Builder
				</Flex>
			),
		},
	});

	const linkClasses = ['blockera-branding__link', linkClassName]
		.filter(Boolean)
		.join(' ');

	return (
		<span className="blockera-branding">
			<Tooltip
				text={
					<Flex direction="row" alignItems="center" gap="8px">
						{formatted}
					</Flex>
				}
				style={{
					'--tooltip-bg': '#0051e7',
				}}
				delay={200}
			>
				<a
					href="https://blockera.ai/products/site-builder/"
					target="_blank"
					rel="noopener noreferrer"
					className={linkClasses}
				>
					<Icon
						icon="blockera"
						library="blockera"
						iconSize={iconSize}
					/>
				</a>
			</Tooltip>
		</span>
	);
}
