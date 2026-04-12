/**
 * External dependencies
 */
import { __experimentalHeading as Heading } from '@wordpress/components';
/**
 * Blockera dependencies
 */
import { BlockeraBranding } from './blockera-branding';

interface SubtitleProps {
	showBranding?: boolean;
	children: React.ReactNode;
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Subtitle({
	showBranding = true,
	children,
	level = 2,
}: SubtitleProps) {
	return (
		<Heading
			className="blockera-global-styles-subtitle"
			level={level}
			style={{
				marginBottom: '0',
				display: 'flex',
				alignItems: 'center',
				gap: '4px',
				justifyContent: 'space-between',
			}}
		>
			{children}

			{showBranding && (
				<BlockeraBranding linkClassName="blockera-global-styles-subtitle-branding-icon" />
			)}
		</Heading>
	);
}
