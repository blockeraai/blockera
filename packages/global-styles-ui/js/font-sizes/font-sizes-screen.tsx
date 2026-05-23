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

interface FontSizesScreenProps {
	onClick: (event: Event) => void;
}

function FontSizesScreen({ onClick }: FontSizesScreenProps) {
	return (
		<Flex
			direction="column"
			gap={'12px'}
			className="blockera-font-size-panel blockera-font-size-hub"
		>
			<Subtitle level={3}>{__('Font Sizes', 'blockera')}</Subtitle>

			<ItemGroup isBordered isSeparated>
				<NavigationButtonAsItem
					path="/typography/font-sizes"
					onClick={onClick}
				>
					<HStack direction="row">
						<FlexItem>
							{__('Font size variables', 'blockera')}
						</FlexItem>
						<Icon icon={isRTL() ? chevronLeft : chevronRight} />
					</HStack>
				</NavigationButtonAsItem>
			</ItemGroup>
		</Flex>
	);
}

export default FontSizesScreen;
