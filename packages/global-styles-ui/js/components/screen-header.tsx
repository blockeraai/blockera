/**
 * External dependencies
 */
import { __experimentalText as Text, Navigator } from '@wordpress/components';
import { isRTL, __ } from '@wordpress/i18n';
import { chevronRight, chevronLeft } from '@wordpress/icons';
import { memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex, PoweredBy } from '@blockera/controls';

/** Matches previous `Spacer` paddingX={4} paddingY={3} (16px / 12px). */
const HEADER_PADDING_STYLE = { padding: '12px 16px' } as const;

/**
 * Lets the title column absorb remaining row width; `minWidth: 0` allows long
 * titles to shrink instead of overflowing the flex row.
 */
const TITLE_CELL_STYLE = { minWidth: 0 } as const;

interface ScreenHeaderProps {
	title: string | React.ReactNode;
	description?: string | React.ReactElement;
	onBack?: () => void;
	showBranding?: boolean;
}

function ScreenHeaderComponent({
	title,
	description,
	showBranding = true,
	onBack,
}: ScreenHeaderProps) {
	return (
		<Flex direction="column" gap="20px" style={HEADER_PADDING_STYLE}>
			<Flex gap="8px" alignItems="stretch">
				<Navigator.BackButton
					icon={
						(isRTL()
							? chevronRight
							: chevronLeft) as React.ComponentProps<
							typeof Navigator.BackButton
						>['icon']
					}
					size="small"
					label={__('Back', 'blockera')}
					onClick={onBack}
				/>
				<Flex grow={1} style={TITLE_CELL_STYLE}>
					<Flex
						direction="row"
						alignItems="center"
						justifyContent="space-between"
						gap="8px"
						grow={1}
						style={{ fontSize: '13px', fontWeight: '500' }}
					>
						{title}

						{showBranding && <PoweredBy linkTabIndex={-1} />}
					</Flex>
				</Flex>
			</Flex>

			{description && (
				<Text className="global-styles-ui-header__description">
					{description}
				</Text>
			)}
		</Flex>
	);
}

export const ScreenHeader = memo(ScreenHeaderComponent);
