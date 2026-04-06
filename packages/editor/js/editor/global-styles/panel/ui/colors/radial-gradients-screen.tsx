/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalVStack as VStack,
	__experimentalSpacer as Spacer,
	__experimentalView as View,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { ScreenHeader } from '../components';
import { GradientPresetGroupsContent } from './gradient-preset-groups-content';
import { useGetRadialGradients } from './use-get-radial-gradients';

interface RadialGradientsScreenProps {
	onBackHandler: () => void;
}

function RadialGradientsPresetContent() {
	const { radialGradients: _, ...groupsState } = useGetRadialGradients();

	return <GradientPresetGroupsContent variant="radial" {...groupsState} />;
}

function RadialGradientsScreen({ onBackHandler }: RadialGradientsScreenProps) {
	return (
		<VStack spacing={2} className="blockera-radial-gradients-presets">
			<ScreenHeader
				onBack={onBackHandler}
				title={__('Radial gradient variables', 'blockera')}
				description={__(
					'Create and edit radial gradient presets used for fills and backgrounds.',
					'blockera'
				)}
			/>

			<View>
				<Spacer paddingX={4}>
					<RadialGradientsPresetContent />
				</Spacer>
			</View>
		</VStack>
	);
}

export default RadialGradientsScreen;
