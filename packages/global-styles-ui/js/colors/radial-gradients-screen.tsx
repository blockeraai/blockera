/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalSpacer as Spacer,
	__experimentalView as View,
} from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { ScreenHeader } from '../components';
import { GradientPresetGroupsContent } from './gradient-preset-groups-content';
import { useGetRadialGradients } from './use-get-radial-gradients';

interface RadialGradientsScreenProps {
	onBackHandler: () => void;
}

export function RadialGradientsPresetContent() {
	const { radialGradients: _, ...groupsState } = useGetRadialGradients();

	return <GradientPresetGroupsContent variant="radial" {...groupsState} />;
}

function RadialGradientsScreen({ onBackHandler }: RadialGradientsScreenProps) {
	return (
		<Flex
			direction="column"
			gap={0}
			className="blockera-radial-gradients-presets"
			style={{ paddingBottom: '10px' }}
		>
			<ScreenHeader
				onBack={onBackHandler}
				title={__('Radial Gradient Variables', 'blockera')}
				description={__(
					'Create and edit radial gradient variables used for fills and backgrounds.',
					'blockera'
				)}
			/>

			<View>
				<Spacer paddingX={4}>
					<RadialGradientsPresetContent />
				</Spacer>
			</View>
		</Flex>
	);
}

export default RadialGradientsScreen;
