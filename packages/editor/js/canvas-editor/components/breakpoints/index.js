// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { select, dispatch, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';
import { isEquals, getIframe, getIframeTag } from '@blockera/utils';
import { Flex, Popover, ControlContextProvider } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Preview } from '../preview';
import PickedBreakpoints from './picked-breakpoints';
import BreakpointSettings from './breakpoint-settings';
import type { BreakpointsComponentProps } from './types';
import { isBaseBreakpoint, getBaseBreakpoint } from './helpers';
import { useStoreSelectors, useStoreDispatchers } from '../../../hooks';

export const Breakpoints = ({
	className,
}: BreakpointsComponentProps): MixedElement => {
	const { getDeviceType, getBreakpoints, getBreakpoint, getCanvasSettings } =
		select('blockera/editor');
	const {
		setDeviceType,
		setCanvasSettings,
		// updateBreakpoints,
		updaterDeviceType,
		updaterDeviceIndicator,
	} = useDispatch('blockera/editor');
	const { changeExtensionCurrentBlockStateBreakpoint } = dispatch(
		'blockera/extensions'
	);
	const [canvasSettings, updateCanvasSettings] = useState({
		...getCanvasSettings(),
		breakpoints: getBreakpoints(),
	});
	const [deviceType, updateDeviceType] = useState(getDeviceType());
	const {
		blockEditor: { getSelectedBlock },
	} = useStoreSelectors();
	const {
		blockEditor: { updateBlockAttributes },
	} = useStoreDispatchers();

	useEffect(() => {
		let editorWrapper: Object = document.querySelector(
			'.editor-styles-wrapper'
		);

		if (!editorWrapper) {
			editorWrapper = getIframeTag('.editor-styles-wrapper');
		}

		if (editorWrapper) {
			const {
				settings: { min, max },
			} = getBreakpoint(deviceType);
			const iframe = getIframe();

			if (!editorWrapper.classList.contains('blockera-canvas')) {
				editorWrapper.classList.add('blockera-canvas');
			}

			// We try to clean up additional styles added from our custom breakpoints (means: any breakpoints apart from 'desktop', 'tablet', and 'mobile')
			// of iframe and editor styles wrapper elements of post|site editor.
			if (
				isBaseBreakpoint(deviceType) &&
				editorWrapper.classList.contains('preview-margin')
			) {
				editorWrapper.style.minWidth = '100%';
				editorWrapper.style.maxWidth = '100%';
				editorWrapper.style.removeProperty('margin');
				editorWrapper.classList.remove('preview-margin');
				editorWrapper.parentElement.style.removeProperty('background');

				if (iframe) {
					iframe.style.removeProperty('min-width');
					iframe.style.removeProperty('max-width');
					iframe.parentElement.style.removeProperty('background');
				}
			}
			// We try to set our custom breakpoints (means: any breakpoints apart from 'desktop', 'tablet', and 'mobile') settings into,
			// iframe element as dimensions with preview margin style.
			else if (!['desktop', 'tablet', 'mobile'].includes(deviceType)) {
				if (iframe) {
					if (min && max) {
						iframe.style.minWidth = min;
						iframe.style.maxWidth = max;
					} else if (min) {
						iframe.style.minWidth = min;
					} else if (max) {
						iframe.style.maxWidth = max;
					}
				}

				if (!editorWrapper.classList.contains('preview-margin')) {
					editorWrapper.classList.add('preview-margin');
				}
			}
		}

		setDeviceType(deviceType);
		updaterDeviceType(updateDeviceType);
		// eslint-disable-next-line
	}, [deviceType]);

	useEffect(() => {
		if (!isEquals(canvasSettings, getCanvasSettings())) {
			setCanvasSettings(canvasSettings);
		}
		// eslint-disable-next-line
	}, [canvasSettings]);

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

	const handleOnChange = (key: string, value: any): void =>
		updateCanvasSettings({
			...canvasSettings,
			[key]: value,
		});

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
					className={className}
					justifyContent={'space-between'}
				>
					<div
						className={controlInnerClassNames(
							'blockera-breakpoints'
						)}
					>
						<Icon
							data-test={'blockera-breakpoints-settings-opener'}
							icon="more-horizontal"
							iconSize="24"
							onClick={() =>
								handleOnChange(
									'isOpenOtherBreakpoints',
									!canvasSettings.isOpenOtherBreakpoints
								)
							}
						/>
					</div>

					<PickedBreakpoints
						items={Object.fromEntries(
							Object.entries(canvasSettings.breakpoints).filter(
								([key]) =>
									canvasSettings.breakpoints[key].settings
										.picked || key === getBaseBreakpoint()
							)
						)}
						onClick={handleOnClick}
						updateBlock={updateSelectedBlock}
						updaterDeviceIndicator={updaterDeviceIndicator}
					/>
				</Flex>

				{canvasSettings.isOpenOtherBreakpoints && (
					<Popover
						offset={10}
						className={controlInnerClassNames(
							'breakpoints-popover'
						)}
						placement={'bottom-end'}
						title={__('Breakpoint Settings', 'blockera')}
						onClose={() =>
							updateCanvasSettings({
								...canvasSettings,
								isOpenSettings: false,
								isOpenOtherBreakpoints: false,
							})
						}
					>
						<BreakpointSettings
							onClick={handleOnClick}
							onChange={handleOnChange}
							breakpoints={canvasSettings.breakpoints}
						/>
					</Popover>
				)}

				<Preview />
			</ControlContextProvider>
		</>
	);
};

export * from './helpers';
export * from './bootstrap';
