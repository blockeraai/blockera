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
import { Flex, PresetVariablesViewModeProvider } from '@blockera/controls';

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
		<Flex
			direction="column"
			gap={0}
			className="blockera-linear-gradients-presets"
			style={{ paddingBottom: '10px' }}
		>
			<ScreenHeader
				onBack={onBackHandler}
				title={__('Linear Gradient Variables', 'blockera')}
				description={__(
					'Create and edit linear gradient variables used for fills and backgrounds.',
					'blockera'
				)}
			/>

			<View>
				<Spacer paddingX={4}>
					<PresetVariablesViewModeProvider>
						<LinearGradientsPresetContent />
					</PresetVariablesViewModeProvider>
				</Spacer>
			</View>
		</Flex>
	);
}

export default LinearGradientsScreen;
