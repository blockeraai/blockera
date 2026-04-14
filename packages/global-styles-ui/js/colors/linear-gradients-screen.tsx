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
import { useGetLinearGradients } from './use-get-linear-gradients';

interface LinearGradientsScreenProps {
	onBackHandler: () => void;
}

export function LinearGradientsPresetContent() {
	const { linearGradients: _, ...groupsState } = useGetLinearGradients();

	return <GradientPresetGroupsContent variant="linear" {...groupsState} />;
}

function LinearGradientsScreen({ onBackHandler }: LinearGradientsScreenProps) {
	return (
		<VStack spacing={2} className="blockera-linear-gradients-presets">
			<ScreenHeader
				onBack={onBackHandler}
				title={__('Linear gradient variables', 'blockera')}
				description={__(
					'Create and edit linear gradient variables used for fills and backgrounds.',
					'blockera'
				)}
			/>

			<View>
				<Spacer paddingX={4}>
					<LinearGradientsPresetContent />
				</Spacer>
			</View>
		</VStack>
	);
}

export default LinearGradientsScreen;
