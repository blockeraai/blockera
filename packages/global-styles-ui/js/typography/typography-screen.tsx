/**
 * External dependencies
 */
import { __, isRTL } from '@wordpress/i18n';
import {
	FlexItem,
	__experimentalHStack as HStack,
	__experimentalItemGroup as ItemGroup,
} from '@wordpress/components';
import { Icon, chevronLeft, chevronRight } from '@wordpress/icons';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Subtitle, NavigationButtonAsItem } from '../components';

interface TypographyScreenProps {
	onFontSizesClick: (event: Event) => void;
	onLineHeightsClick: (event: Event) => void;
}

function TypographyScreen({
	onFontSizesClick,
	onLineHeightsClick,
}: TypographyScreenProps) {
	return (
		<Flex
			direction="column"
			gap={'12px'}
			className="blockera-typography-panel blockera-typography-hub"
		>
			<Subtitle level={3}>{__('Variables', 'blockera')}</Subtitle>

			<ItemGroup isBordered isSeparated>
				<NavigationButtonAsItem
					path="/typography/font-sizes"
					onClick={onFontSizesClick}
				>
					<HStack direction="row">
						<FlexItem>
							{__('Font size variables', 'blockera')}
						</FlexItem>
						<Icon icon={isRTL() ? chevronLeft : chevronRight} />
					</HStack>
				</NavigationButtonAsItem>

				<NavigationButtonAsItem
					path="/typography/line-heights"
					onClick={onLineHeightsClick}
				>
					<HStack direction="row">
						<FlexItem>
							{__('Line height variables', 'blockera')}
						</FlexItem>
						<Icon icon={isRTL() ? chevronLeft : chevronRight} />
					</HStack>
				</NavigationButtonAsItem>
			</ItemGroup>
		</Flex>
	);
}

export default TypographyScreen;
