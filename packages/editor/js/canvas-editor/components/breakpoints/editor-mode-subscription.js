// @flow

/**
 * External dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getBaseBreakpoint } from './helpers';
import { STORE_NAME as blockeraEditorStore } from '../../../store/constants';

let savedDeviceType = null;
let previousEditorMode = null;

export const subscribeToEditorModeChanges = (editorMode: string) => {
	// Only proceed if the editor mode has actually changed
	if (previousEditorMode !== editorMode) {
		previousEditorMode = editorMode;

		const { setDeviceType } = dispatch(blockeraEditorStore);
		const { getDeviceType } = select(blockeraEditorStore);

		// When switching to text mode
		if ('text' === editorMode) {
			const selectedDeviceType = getDeviceType();

			// Save current device type before switching
			if (selectedDeviceType !== getBaseBreakpoint()) {
				savedDeviceType = selectedDeviceType;
			}

			// Force to base breakpoint in text mode
			setDeviceType(getBaseBreakpoint());
		}

		// When switching back to visual mode
		if ('visual' === editorMode) {
			// Restore previously saved device type
			if (savedDeviceType) {
				setDeviceType(savedDeviceType);
				savedDeviceType = null; // Clear after restore
			}
		}
	}
};
