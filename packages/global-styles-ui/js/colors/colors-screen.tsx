/**
 * External dependencies
 */
import { __experimentalItemGroup as ItemGroup } from '@wordpress/components';
import { __, isRTL } from '@wordpress/i18n';
import { Icon, chevronLeft, chevronRight } from '@wordpress/icons';

/**
 * Blockera dependencies
 */
import { ColorIndicatorStack, Flex } from '@blockera/controls';

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

const PREVIEW_STACK_SIZE = 4;

function buildColorPreviewStack(colors: string[]): string[] {
	if (colors.length > PREVIEW_STACK_SIZE) {
		return colors;
	}
	const padded = [...colors];
	while (padded.length < PREVIEW_STACK_SIZE) {
		padded.push('none');
	}
	return padded;
}

type GradientPreviewItem = { value: string; type: 'gradient' };

function buildGradientPreviewStack(
	gradients: Array<{ gradient: string }>
): GradientPreviewItem[] {
	const mapped: GradientPreviewItem[] = gradients.map((g) => ({
		value: g.gradient,
		type: 'gradient',
	}));
	if (mapped.length > PREVIEW_STACK_SIZE) {
		return mapped;
	}
	const padded = [...mapped];
	while (padded.length < PREVIEW_STACK_SIZE) {
		padded.push({ value: 'none', type: 'gradient' });
	}
	return padded;
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
				<Flex
					direction="row"
					alignItems="center"
					justifyContent="start"
					gap="8px"
				>
					<ColorIndicatorStack
						maxItems={PREVIEW_STACK_SIZE}
						value={buildColorPreviewStack(colors)}
						size={18}
					/>

					<div style={{ flexGrow: 1 }}>
						{__('Color variables', 'blockera')}
					</div>

					<Icon icon={isRTL() ? chevronLeft : chevronRight} />
				</Flex>
			</NavigationButtonAsItem>

			<NavigationButtonAsItem
				path="/colors/linear-gradients"
				onClick={onClick}
			>
				<Flex
					direction="row"
					alignItems="center"
					justifyContent="start"
					gap="8px"
				>
					<ColorIndicatorStack
						maxItems={PREVIEW_STACK_SIZE}
						value={buildGradientPreviewStack(linearGradients)}
						size={18}
					/>

					<div style={{ flexGrow: 1 }}>
						{__('Linear gradient variables', 'blockera')}
					</div>

					<Icon icon={isRTL() ? chevronLeft : chevronRight} />
				</Flex>
			</NavigationButtonAsItem>

			<NavigationButtonAsItem
				path="/colors/radial-gradients"
				onClick={onClick}
			>
				<Flex
					direction="row"
					alignItems="center"
					justifyContent="start"
					gap="8px"
				>
					<ColorIndicatorStack
						maxItems={PREVIEW_STACK_SIZE}
						value={buildGradientPreviewStack(radialGradients)}
						size={18}
					/>

					<div style={{ flexGrow: 1 }}>
						{__('Radial gradient variables', 'blockera')}
					</div>

					<Icon icon={isRTL() ? chevronLeft : chevronRight} />
				</Flex>
			</NavigationButtonAsItem>
		</ItemGroup>
	);
}

function ColorsScreen({ onClick }: ColorsScreenProps) {
	return (
		<Flex
			direction="column"
			gap={'12px'}
			className="blockera-colors-presets-navigation blockera-colors-presets-count"
		>
			<Subtitle level={3}>{__('Colors', 'blockera')}</Subtitle>
			<ColorsNavigationPreviews onClick={onClick} />
		</Flex>
	);
}

export default ColorsScreen;
