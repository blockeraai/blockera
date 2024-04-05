// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { select, dispatch, useDispatch } from '@wordpress/data';
import { useEffect, useState, createPortal } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	useStoreDispatchers,
	useStoreSelectors,
} from '@publisher/extensions/src/hooks';
import { isEquals } from '@publisher/utils';
import { Flex, Popover } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';
import { ControlContextProvider, InputControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Preview } from '../preview';
import Circles from '../../icons/circles';
import PickedBreakpoints from './picked-breakpoints';
import BreakpointSettings from './breakpoint-settings';
import type { BreakpointsComponentProps } from './types';
import { isLaptopBreakpoint } from './helpers';

export const Breakpoints = ({
	className,
}: BreakpointsComponentProps): MixedElement => {
	const { getDeviceType, getBreakpoints, getBreakpoint, getCanvasSettings } =
		select('publisher-core/editor');
	const { setDeviceType, setCanvasSettings, updateBreakpoints } = useDispatch(
		'publisher-core/editor'
	);
	const { changeExtensionCurrentBlockStateBreakpoint } = dispatch(
		'publisher-core/extensions'
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
		const editorWrapper = document.querySelector('.editor-styles-wrapper');

		if (!editorWrapper) {
			return;
		}

		const classes = Array.from(editorWrapper.classList);
		const selectedBreakpoint = getBreakpoint(deviceType);

		// remove all active preview related css class.
		classes?.forEach((className: string, index: number) => {
			if (isLaptopBreakpoint(deviceType)) {
				editorWrapper.style.minWidth = '100%';
				editorWrapper.style.maxWidth = '100%';
				editorWrapper.classList.remove('preview-margin');

				return;
			}

			if (-1 !== className.indexOf('-preview')) {
				editorWrapper.classList.remove(className);
			}

			if (classes.length - 1 === index) {
				editorWrapper.classList.add('publisher-core-canvas');
				editorWrapper.classList.add('preview-margin');
				editorWrapper.classList.add(`is-${deviceType}-preview`);

				editorWrapper.style.minWidth =
					selectedBreakpoint?.settings?.min;
				editorWrapper.style.maxWidth =
					selectedBreakpoint?.settings?.max;

				if (editorWrapper.parentElement) {
					// $FlowFixMe
					editorWrapper.parentElement.style.background = '#222222';
				}
			}
		});

		createPortal(
			<iframe srcDoc={editorWrapper} title={'canvas-editor'} />,
			editorWrapper.parentElement
		);

		setDeviceType(deviceType);
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
					publisherCurrentDevice: device,
				};

				// Dispatch an action to update the selected block
				updateBlockAttributes(
					selectedBlock.clientId,
					updatedAttributes
				);
			}
		};

		if (device === getDeviceType()) {
			updateDeviceType('laptop');
			changeExtensionCurrentBlockStateBreakpoint('laptop');

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
				<Flex className={className} justifyContent={'space-between'}>
					<div
						className={controlInnerClassNames(
							'publisher-core-breakpoints'
						)}
					>
						<Circles
							onClick={() =>
								handleOnChange(
									'isOpenOtherBreakpoints',
									!canvasSettings.isOpenOtherBreakpoints
								)
							}
						/>
					</div>

					<PickedBreakpoints onClick={handleOnClick} />

					<div
						style={{
							cursor: 'pointer',
							lineHeight: '36px',
						}}
						aria-label={__('Canvas Zoom', 'publisher-core')}
						onClick={() =>
							handleOnChange(
								'isOpenSettings',
								!canvasSettings.isOpenSettings
							)
						}
					>
						{canvasSettings.zoom}
					</div>
				</Flex>

				{canvasSettings.isOpenOtherBreakpoints && (
					<Popover
						offset={20}
						placement={'left-end'}
						title={__('Breakpoint Settings', 'publisher-core')}
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
						title={__('Canvas Settings', 'publisher-core')}
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
							label={__('Width', 'publisher-core')}
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
							label={__('Height', 'publisher-core')}
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
							label={__('Zoom', 'publisher-core')}
						/>
					</Popover>
				)}

				<Preview />
			</ControlContextProvider>
		</>
	);
};

export * from './helpers';
