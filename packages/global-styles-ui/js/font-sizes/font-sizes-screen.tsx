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

function FontSizesScreen() {
	const onClick = (event: Event) => {
		const button = (event.target as HTMLElement)?.closest(
			'.blockera-font-size-presets-count'
		);
		const parent =
			button?.parentElement?.parentElement?.parentElement?.parentElement;

		parent?.classList?.add('blockera-font-size-presets-count-active');

		if (
			parent.previousElementSibling &&
			parent.previousElementSibling instanceof HTMLElement
		) {
			parent.previousElementSibling.style.display = 'none';
		}
	};

	return (
		<Flex
			direction="column"
			gap={'12px'}
			className="blockera-font-size-presets-count"
		>
			<Subtitle level={3}>{__('Font Sizes', 'blockera')}</Subtitle>

			<ItemGroup isBordered isSeparated>
				<NavigationButtonAsItem
					path="/typography/font-sizes"
					onClick={onClick}
				>
					<HStack direction="row">
						<FlexItem>
							{__('Font size presets', 'blockera')}
						</FlexItem>
						<Icon icon={isRTL() ? chevronLeft : chevronRight} />
					</HStack>
				</NavigationButtonAsItem>
			</ItemGroup>
		</Flex>
	);
}

export default FontSizesScreen;
