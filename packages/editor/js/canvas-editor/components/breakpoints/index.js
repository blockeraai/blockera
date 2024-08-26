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
import { getIframe, getIframeTag, isEquals } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';
import {
	Flex,
	Popover,
	InputControl,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { experimental } from '@blockera/env';

/**
 * Internal dependencies
 */
import { Preview } from '../preview';
import { getBaseBreakpoint, isBaseBreakpoint } from './helpers';
import PickedBreakpoints from './picked-breakpoints';
import BreakpointSettings from './breakpoint-settings';
import type { BreakpointsComponentProps } from './types';
import { useStoreSelectors, useStoreDispatchers } from '../../../hooks';

export const Breakpoints = ({
	className,
}: BreakpointsComponentProps): MixedElement => {
	// todo remove this after finishing development
	const enableCanvasSettings = experimental().get(
		'editor.canvasEditor.settings'
	);

	const { getDeviceType, getBreakpoints, getBreakpoint, getCanvasSettings } =
		select('blockera/editor');
	const {
		setDeviceType,
		setCanvasSettings,
		updateBreakpoints,
		updaterDeviceType,
		updaterDeviceIndicator,
	} = useDispatch('blockera/editor');
	const { changeExtensionCurrentBlockStateBreakpoint } = dispatch(
		'blockera/extensions'
	);
	const [canvasSettings, updateCanvasSettings] = useState(
		getCanvasSettings()
	);
	const [deviceType, updateDeviceType] = useState(getDeviceType());
	const {
		blockEditor: { getSelectedBlock },
	} = useStoreSelectors();
	const {
		blockEditor: { updateBlockAttributes },
	} = useStoreDispatchers();

	const breakpoints = getBreakpoints();

	useEffect(() => {
		let inIframe = false;
		let editorWrapper: Object = document.querySelector(
			'.editor-styles-wrapper'
		);

		if (!editorWrapper) {
			editorWrapper = getIframeTag('.editor-styles-wrapper');

			if (!editorWrapper) {
				return;
			}

			inIframe = true;
		}

		const {
			settings: { min, max },
		} = getBreakpoint(deviceType);
		const iframe = getIframe();

		if (!editorWrapper.classList.contains('blockera-canvas')) {
			editorWrapper.classList.add('blockera-canvas');
		}

		if (isBaseBreakpoint(deviceType)) {
			if (!editorWrapper.classList.contains('preview-margin')) {
				if (editorWrapper.parentElement) {
					editorWrapper.parentElement.style.background = '#222222';
				}
			} else {
				editorWrapper.style.minWidth = '100%';
				editorWrapper.style.maxWidth = '100%';
				editorWrapper.classList.remove('preview-margin');

				// Assume user working with canvas editor on site editor!
				if (inIframe) {
					editorWrapper.style.removeProperty('margin');
				}

				if (iframe) {
					iframe.style.removeProperty('min-width');
					iframe.style.removeProperty('max-width');
					iframe.parentElement.style.removeProperty('background');
				}

				if (editorWrapper.parentElement) {
					editorWrapper.parentElement.style.removeProperty(
						'background'
					);
				}
			}
		} else {
			if (iframe) {
				if (min && max) {
					iframe.style.minWidth = min;
					iframe.style.maxWidth = max;
				} else if (min) {
					iframe.style.minWidth = min;
				} else if (max) {
					iframe.style.maxWidth = max;
				}

				iframe.parentElement.style.background = '#222222';
			}

			if (!editorWrapper.classList.contains('preview-margin')) {
				editorWrapper.classList.add('preview-margin');

				// Assume user working with canvas editor on site editor!
				if (inIframe) {
					editorWrapper.style.margin = '72px auto';
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

	const handleOnClick = (device: string): void => {
		const updateSelectedBlock = () => {
			// Check if a block is selected
			if (selectedBlock) {
				// Update the block attributes
				const updatedAttributes = {
					blockeraCurrentDevice: device,
				};

				// Dispatch an action to update the selected block
				updateBlockAttributes(
					selectedBlock.clientId,
					updatedAttributes
				);
			}
		};

		if (device === getDeviceType()) {
			const baseBreakpoint = getBaseBreakpoint();

			updateDeviceType(baseBreakpoint);
			changeExtensionCurrentBlockStateBreakpoint(baseBreakpoint);

			updateSelectedBlock();

			return;
		}

		updateDeviceType(device);
		changeExtensionCurrentBlockStateBreakpoint(device);

		updateSelectedBlock();
	};

	const handleOnChange = (key: string, value: any): void => {
		if ('breakpoints' === key) {
			updateBreakpoints(value);

			return;
		}

		updateCanvasSettings({
			...canvasSettings,
			[key]: value,
		});
	};

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
					justifyContent={
						enableCanvasSettings ? 'space-between' : 'center'
					}
				>
					{enableCanvasSettings && (
						<div
							className={controlInnerClassNames(
								'blockera-breakpoints'
							)}
						>
							<Icon
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
					)}

					<PickedBreakpoints
						onClick={handleOnClick}
						updaterDeviceIndicator={updaterDeviceIndicator}
					/>

					{enableCanvasSettings && (
						<div
							style={{
								cursor: 'pointer',
								lineHeight: '36px',
							}}
							aria-label={__('Canvas Zoom', 'blockera')}
							onClick={() =>
								handleOnChange(
									'isOpenSettings',
									!canvasSettings.isOpenSettings
								)
							}
						>
							{canvasSettings.zoom}
						</div>
					)}
				</Flex>

				{canvasSettings.isOpenOtherBreakpoints && (
					<Popover
						offset={20}
						placement={'left-end'}
						title={__('Breakpoint Settings', 'blockera')}
						onClose={() => handleOnChange('isOpenSettings', false)}
					>
						<BreakpointSettings
							onClick={handleOnClick}
							onChange={handleOnChange}
							breakpoints={breakpoints}
						/>
					</Popover>
				)}

				{canvasSettings.isOpenSettings && (
					<Popover
						offset={20}
						placement={'bottom-end'}
						title={__('Canvas Settings', 'blockera')}
						onClose={() => handleOnChange('isOpenSettings', false)}
					>
						<InputControl
							id={'width'}
							type={'number'}
							placeholder="100"
							unitType={'width'}
							columns={'columns-2'}
							onChange={(newValue) =>
								handleOnChange('width', newValue)
							}
							label={__('Width', 'blockera')}
						/>
						<InputControl
							id={'height'}
							type={'number'}
							placeholder="100"
							unitType={'height'}
							columns={'columns-2'}
							onChange={(newValue) =>
								handleOnChange('height', newValue)
							}
							label={__('Height', 'blockera')}
						/>
						<InputControl
							id={'zoom'}
							type={'number'}
							placeholder="100"
							unitType={'width'}
							columns={'columns-2'}
							onChange={(newValue) =>
								handleOnChange('zoom', newValue)
							}
							label={__('Zoom', 'blockera')}
						/>
					</Popover>
				)}

				<Preview />
			</ControlContextProvider>
		</>
	);
};

export * from './helpers';
