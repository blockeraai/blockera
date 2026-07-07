/**
 * External dependencies
 */
import { Navigator } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { prependPortal } from '@blockera/utils';

/**
 * Internal dependencies
 */
import ColorsScreen from './colors-screen';
import ColorPaletteScreen from './color-palette-screen';
import LinearGradientsScreen from './linear-gradients-screen';
import RadialGradientsScreen from './radial-gradients-screen';
import { NavItemScreen } from '../navigation/nav-item-screen';
import {
	useOverrideNavigator,
	BLOCKERA_COLORS_PRESET_INSPECTOR_ACTIVE_CLASS,
	disablePresetInspectorCleanup,
	enablePresetInspectorCleanup,
} from '../panel-override';

const onBack = () => {
	disablePresetInspectorCleanup(
		BLOCKERA_COLORS_PRESET_INSPECTOR_ACTIVE_CLASS
	);
};

const onClick = (event: Event) => {
	enablePresetInspectorCleanup(
		BLOCKERA_COLORS_PRESET_INSPECTOR_ACTIVE_CLASS,
		event
	);
};

interface ColorsProps {
	screenSelector: string;
}

function Colors({ screenSelector }: ColorsProps) {
	useOverrideNavigator({ panel: 'colors' });

	return prependPortal(
		<Navigator initialPath="/">
			<NavItemScreen path="/">
				<ColorsScreen onClick={onClick} />
			</NavItemScreen>
			<NavItemScreen path="/colors/palette">
				<ColorPaletteScreen onBackHandler={onBack} />
			</NavItemScreen>
			<NavItemScreen path="/colors/linear-gradients">
				<LinearGradientsScreen onBackHandler={onBack} />
			</NavItemScreen>
			<NavItemScreen path="/colors/radial-gradients">
				<RadialGradientsScreen onBackHandler={onBack} />
			</NavItemScreen>
		</Navigator>,
		document.querySelector(screenSelector)
	);
}

export default Colors;
