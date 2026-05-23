/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getPresetOverrideBodyClass,
	type PresetPanelOverride,
} from './override-classes';
import { getDualGlobalStylesSelector } from './selectors';

/**
 * Cleans up preset override body class when WordPress navigator back is pressed.
 */
export const useOverrideNavigator = ({
	panel,
}: {
	panel: PresetPanelOverride;
}) => {
	useEffect(() => {
		document
			.querySelector(
				`${getDualGlobalStylesSelector('navigatorBackButton')}:first-child`
			)
			?.addEventListener(
				'click',
				() => {
					document.body.classList.remove(
						getPresetOverrideBodyClass(panel)
					);
				},
				{ once: true }
			);
	}, [panel]);
};
