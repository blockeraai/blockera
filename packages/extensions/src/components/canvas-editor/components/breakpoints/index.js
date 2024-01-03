// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';
import { select, useDispatch } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { isFunction } from '@publisher/utils';
import { Button, Flex, Popover } from '@publisher/components';
import { ControlContextProvider, InputControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Preview } from '../preview';
import Circles from '../../icons/circles';
import PickedBreakpoints from './picked-breakpoints';
import BreakpointSettings from './breakpoint-settings';
import type { BreakpointsComponentProps } from './types';
import defaultBreakpoints from '../../../../libs/block-states/default-breakpoints';

export const Breakpoints = ({
	refId,
	className,
}: BreakpointsComponentProps): MixedElement => {
	const [canvasSettings, setCanvasSettings] = useState({
		width: '100%',
		height: '100%',
		isOpenSettings: false,
		isOpenOtherBreakpoints: false,
		breakpoints: defaultBreakpoints(),
	});
	const getDeviceType =
		select('core/edit-post').__experimentalGetPreviewDeviceType();

	const {
		__experimentalSetPreviewDeviceType: setDeviceType, // __experimentalGetPreviewDeviceType: getDeviceType,
		// eslint-disable-next-line react-hooks/rules-of-hooks
	} = useDispatch('core/edit-post');

	const handleOnClick = (device: string): void => {
		if (!isFunction(setDeviceType)) {
			return;
		}

		if (device === getDeviceType) {
			setDeviceType('Desktop');

			return;
		}

		setDeviceType(device);
	};

	const handleOnChange = (key: string, value: any): void => {
		setCanvasSettings({
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
					<Circles
						onClick={() =>
							handleOnChange(
								'isOpenOtherBreakpoints',
								!canvasSettings.isOpenOtherBreakpoints
							)
						}
					/>

					{canvasSettings.isOpenOtherBreakpoints && (
						<Popover
							offset={20}
							placement={'left-end'}
							title={__('Breakpoint Settings', 'publisher-core')}
							onClose={() =>
								handleOnChange('isOpenSettings', false)
							}
						>
							<BreakpointSettings
								onChange={handleOnChange}
								breakpoints={canvasSettings.breakpoints}
							/>
						</Popover>
					)}

					<PickedBreakpoints onClick={handleOnClick} />

					<Button
						type={'tertiary'}
						title={__('Canvas Settings', 'publisher-core')}
						onClick={() =>
							handleOnChange(
								'isOpenSettings',
								!canvasSettings.isOpenSettings
							)
						}
					>
						{canvasSettings.width}
					</Button>

					{canvasSettings.isOpenSettings && (
						<Popover
							offset={20}
							placement={'bottom-end'}
							title={__('Canvas Settings', 'publisher-core')}
							onClose={() =>
								handleOnChange('isOpenSettings', false)
							}
						>
							<InputControl
								id={'width'}
								type={'number'}
								unitType={'height'}
								columns={'columns-2'}
								onChange={(newValue) =>
									handleOnChange('width', newValue)
								}
								label={__('Width', 'publisher-core')}
							/>
							<InputControl
								id={'height'}
								type={'number'}
								unitType={'width'}
								columns={'columns-2'}
								onChange={(newValue) =>
									handleOnChange('height', newValue)
								}
								label={__('Height', 'publisher-core')}
							/>
						</Popover>
					)}
				</Flex>

				<Preview refId={refId} />
			</ControlContextProvider>
		</>
	);
};
