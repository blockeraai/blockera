// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useEffect, useState } from '@wordpress/element';
import { dispatch, useSelect, useDispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';
import { Flex, ControlContextProvider } from '@blockera/controls';
import { isEquals, getIframe, getIframeTag } from '@blockera/utils';

/**
 * Internal dependencies
 */
import PickedBreakpoints from './picked-breakpoints';
import type { BreakpointsComponentProps } from './types';
import { isBaseBreakpoint, getBaseBreakpoint } from './helpers';
import { subscribeToEditorModeChanges } from './editor-mode-subscription';
import { useStoreSelectors } from '../../../../hooks/use-store-selectors';
import { useStoreDispatchers } from '../../../../hooks/use-store-dispatchers';
import type {
	TBreakpoint,
	BreakpointTypes,
} from '../../../../extensions/libs/block-card/block-states/types';

export const BreakpointsUI = ({
	className,
	editorMode,
}: BreakpointsComponentProps): MixedElement => {
	const { getDeviceType, getBreakpoints, getBreakpoint, getCanvasSettings } =
		useSelect((select) => select('blockera/editor'), []);
	const {
		setDeviceType,
		setCanvasSettings,
		updaterDeviceType,
		updaterDeviceIndicator,
	} = useDispatch('blockera/editor');
	const { changeExtensionCurrentBlockStateBreakpoint } = dispatch(
		'blockera/extensions'
	);
	const [canvasSettings] = useState(getCanvasSettings());
	const [deviceType, updateDeviceType] = useState(getDeviceType());
	const {
		blockEditor: { getSelectedBlock },
	} = useStoreSelectors();
	const {
		blockEditor: { updateBlockAttributes },
	} = useStoreDispatchers();

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			const iframe = getIframe();

			// Get the editor wrapper (body element of the editor iframe).
			let editorWrapper = document.querySelector(
				'.editor-styles-wrapper'
			);

			if (!editorWrapper) {
				editorWrapper = getIframeTag('.editor-styles-wrapper');
				if (iframe?.style) {
					iframe.style.margin = '0 auto';
				}
			}

			if (editorWrapper) {
				// Get breakpoint settings for current device.
				const {
					settings: { min, max },
				} = {
					settings: {
						min: '',
						max: '',
					},
					...getBreakpoint(deviceType),
				};

				// Add base canvas class.
				if (!editorWrapper.classList.contains('blockera-canvas')) {
					editorWrapper.classList.add('blockera-canvas');
				}

				// Reset styles for base breakpoint.
				if (isBaseBreakpoint(deviceType)) {
					if (editorWrapper.classList.contains('preview-margin')) {
						editorWrapper.style.width = '100%';
						editorWrapper.style.minWidth = '100%';
						editorWrapper.style.maxWidth = '100%';
						editorWrapper.style.margin = '';
						editorWrapper.style.transform = '';
						editorWrapper.classList.remove('preview-margin');
						// $FlowFixMe
						editorWrapper.parentElement.style.background = '';

						if (iframe) {
							iframe.style.width = '100%';
							iframe.style.minWidth = '';
							iframe.style.maxWidth = '';
							iframe.style.transform = '';
							iframe.parentElement.style.background = '';
						}
					}
				}
				// Apply custom breakpoint styles.
				else {
					// Add preview margin class.
					if (!editorWrapper.classList.contains('preview-margin')) {
						editorWrapper.classList.add('preview-margin');
					}

					if (iframe) {
						// Set width constraints based on breakpoint settings.
						if (min && max) {
							iframe.style.width = max;
							iframe.style.minWidth = '';
							iframe.style.maxWidth = max;
						} else if (min || max) {
							iframe.style.width = min || max;
							iframe.style.minWidth = '';
							iframe.style.maxWidth = '';
						}

						// Scale down non-base breakpoints for better preview.
						if (deviceType !== getBaseBreakpoint()) {
							iframe.style.transformOrigin = '50% 50%'; // Center both horizontally and vertically.
							editorWrapper.style.transformOrigin = '50% 50%'; // Center both horizontally and vertically.

							iframe.parentElement.style.overflowX = 'auto';
						} else {
							iframe.parentElement.style.overflowX = 'none';
						}

						// Center the preview.
						editorWrapper.style.margin = '0 auto';
						iframe.style.margin = '50px auto';
					}
				}
			}

			setDeviceType(deviceType);
			updaterDeviceType(updateDeviceType);
		}, 100);

		return () => clearTimeout(timeoutId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deviceType, editorMode]);

	useEffect(() => {
		if (!isEquals(canvasSettings, getCanvasSettings())) {
			setCanvasSettings(canvasSettings);
		}
		// eslint-disable-next-line
	}, [canvasSettings]);

	useEffect(() => {
		subscribeToEditorModeChanges(editorMode);
	}, [editorMode]);

	const selectedBlock = getSelectedBlock();

	const updateSelectedBlock = (device: string) => {
		// Check if a block is selected.
		if (selectedBlock) {
			// Update the block attributes.
			const updatedAttributes = {
				blockeraCurrentDevice: device,
			};

			// Dispatch an action to update the selected block.
			updateBlockAttributes(selectedBlock.clientId, updatedAttributes);
		}
	};

	const handleOnClick = (device: string): void => {
		// Updating the device type by WordPress Core api.
		updateDeviceType(device);

		// Updating the extension current block state breakpoint global state.
		changeExtensionCurrentBlockStateBreakpoint(device);

		// Updating the selected block blockeraCurrentDevice attribute.
		updateSelectedBlock(device);
	};

	const baseBreakpoint = getBaseBreakpoint();
	let breakpoints = getBreakpoints();

	const availableBreakpoints = (() => {
		if (!breakpoints || typeof breakpoints !== 'object') {
			breakpoints = getBreakpoints();
		}

		const result: { [key: TBreakpoint | string]: BreakpointTypes } = {};

		for (const key in breakpoints) {
			if (
				key === baseBreakpoint ||
				(breakpoints[key]?.settings?.picked && breakpoints[key]?.status)
			) {
				result[key] = breakpoints[key];
			}
		}

		return result;
	})();

	return (
		<>
			<ControlContextProvider
				value={{
					name: 'canvas-editor',
					value: canvasSettings,
					type: 'nested',
				}}
			>
				<Flex
					data-test={'blockera-canvas-editor'}
					className={classNames(className, {
						'breakpoints-open':
							canvasSettings.isOpenOtherBreakpoints,
					})}
					justifyContent={'center'}
				>
					<PickedBreakpoints
						onClick={handleOnClick}
						items={availableBreakpoints}
						updateBlock={updateSelectedBlock}
						updaterDeviceIndicator={updaterDeviceIndicator}
					/>
				</Flex>
			</ControlContextProvider>
		</>
	);
};

export * from './helpers';
export * from './bootstrap';
export { default as BreakpointsSettings } from './breakpoint-settings';
