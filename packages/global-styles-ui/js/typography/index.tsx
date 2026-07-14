/**
 * External dependencies
 */
import { Navigator } from '@wordpress/components';
import { createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TypographyScreen from './typography-screen';
import { FontSizesEditorScreen } from './font-sizes';
import { LineHeightsEditorScreen } from './line-heights';
import { NavItemScreen } from '../navigation/nav-item-screen';
import {
	useOverrideNavigator,
	BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS,
	BLOCKERA_LINE_HEIGHT_PRESET_INSPECTOR_ACTIVE_CLASS,
	disablePresetInspectorCleanup,
	enablePresetInspectorCleanup,
} from '../panel-override';

const onFontSizesBack = () => {
	disablePresetInspectorCleanup(
		BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS
	);
};

const onLineHeightsBack = () => {
	disablePresetInspectorCleanup(
		BLOCKERA_LINE_HEIGHT_PRESET_INSPECTOR_ACTIVE_CLASS
	);
};

const onFontSizesClick = (event: Event) => {
	enablePresetInspectorCleanup(
		BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS,
		event
	);
};

const onLineHeightsClick = (event: Event) => {
	enablePresetInspectorCleanup(
		BLOCKERA_LINE_HEIGHT_PRESET_INSPECTOR_ACTIVE_CLASS,
		event
	);
};

function Typography({ screenSelector }: { screenSelector: string }) {
	useOverrideNavigator({ panel: 'typography' });

	const target = document.querySelector(screenSelector);

	if (!target) {
		return null;
	}

	return createPortal(
		<div className="blockera-block-inspector-controls-wrapper">
			<Navigator initialPath="/">
				<NavItemScreen path="/">
					<TypographyScreen
						onFontSizesClick={onFontSizesClick}
						onLineHeightsClick={onLineHeightsClick}
					/>
				</NavItemScreen>
				<NavItemScreen path="/typography/font-sizes">
					<FontSizesEditorScreen onBackHandler={onFontSizesBack} />
				</NavItemScreen>
				<NavItemScreen path="/typography/line-heights">
					<LineHeightsEditorScreen
						onBackHandler={onLineHeightsBack}
					/>
				</NavItemScreen>
			</Navigator>
		</div>,
		target
	);
}

export default Typography;
