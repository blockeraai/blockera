/**
 * External dependencies
 */
import {
	FlexItem,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	__experimentalItemGroup as ItemGroup,
} from '@wordpress/components';
import { __, isRTL } from '@wordpress/i18n';
import { Icon, chevronLeft, chevronRight } from '@wordpress/icons';

/**
 * Blockera dependencies
 */
import { ColorIndicatorStack } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Subtitle, NavigationButtonAsItem } from '../components';
import { useGetColors } from './use-get-colors';
import { useGetLinearGradients } from './use-get-linear-gradients';
import { useGetRadialGradients } from './use-get-radial-gradients';

interface ColorsScreenProps {
	onClick: (event: Event) => void;
}

/**
 * Subscribes to palette and gradient previews for the nav list. The parent
 * `ColorsScreen` does not use global-styles context, so the subtitle row does
 * not re-run when presets change.
 */
function ColorsNavigationPreviews({ onClick }: ColorsScreenProps) {
	const { colors } = useGetColors();
	const { linearGradients } = useGetLinearGradients();
	const { radialGradients } = useGetRadialGradients();

	return (
		<ItemGroup isBordered isSeparated>
			<NavigationButtonAsItem path="/colors/palette" onClick={onClick}>
				<HStack direction="row">
					{colors.length > 0 && (
						<ColorIndicatorStack value={colors} />
					)}
					<FlexItem>{__('Color variables', 'blockera')}</FlexItem>
					<Icon icon={isRTL() ? chevronLeft : chevronRight} />
				</HStack>
			</NavigationButtonAsItem>
			<NavigationButtonAsItem
				path="/colors/linear-gradients"
				onClick={onClick}
			>
				<HStack direction="row">
					{linearGradients.length > 0 && (
						<ColorIndicatorStack
							value={linearGradients.map((g) => ({
								value: g.gradient,
								type: 'gradient',
							}))}
						/>
					)}
					<FlexItem>
						{__('Linear gradient variables', 'blockera')}
					</FlexItem>
					<Icon icon={isRTL() ? chevronLeft : chevronRight} />
				</HStack>
			</NavigationButtonAsItem>
			<NavigationButtonAsItem
				path="/colors/radial-gradients"
				onClick={onClick}
			>
				<HStack direction="row">
					{radialGradients.length > 0 && (
						<ColorIndicatorStack
							value={radialGradients.map((g) => ({
								value: g.gradient,
								type: 'gradient',
							}))}
						/>
					)}
					<FlexItem>
						{__('Radial gradient variables', 'blockera')}
					</FlexItem>
					<Icon icon={isRTL() ? chevronLeft : chevronRight} />
				</HStack>
			</NavigationButtonAsItem>
		</ItemGroup>
	);
}

function ColorsScreen({ onClick }: ColorsScreenProps) {
	return (
		<VStack
			spacing={2}
			className="blockera-colors-presets-navigation blockera-colors-presets-count"
		>
			<HStack justify="space-between">
				<Subtitle level={3}>{__('Colors', 'blockera')}</Subtitle>
			</HStack>
			<ColorsNavigationPreviews onClick={onClick} />
		</VStack>
	);
}

export default ColorsScreen;
