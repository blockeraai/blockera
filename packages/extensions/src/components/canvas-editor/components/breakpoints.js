// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { Button, Flex, Icon, Popover } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';
import { ControlContextProvider, InputControl } from '@publisher/controls';
import { useState } from '@wordpress/element';
import { select, useDispatch } from '@wordpress/data';
import { isFunction } from '@publisher/utils';
import { Preview } from './preview';

export const Breakpoints = ({
	refId,
	className,
}: {
	refId: Object,
	className: string,
}): MixedElement => {
	const [canvasSettings, setCanvasSettings] = useState({
		width: '100%',
		height: '100%',
		isOpen: false,
	});
	const getDeviceType =
		select('core/edit-post').__experimentalGetPreviewDeviceType();

	const {
		__experimentalSetPreviewDeviceType: setDeviceType,
		// __experimentalGetPreviewDeviceType: getDeviceType,
		// eslint-disable-next-line react-hooks/rules-of-hooks
	} = useDispatch('core/edit-post');

	const handleOnClick = (device: string): void => {
		if (!isFunction(setDeviceType)) {
			return;
		}

		if (device === getDeviceType) {
			return;
		}

		setDeviceType(device);
	};

	return (
		<>
			<Flex className={className} justifyContent={'space-between'}>
				<span>...</span>

				<Flex
					className={controlInnerClassNames(
						'publisher-core-breakpoints'
					)}
					justifyContent={'space-between'}
				>
					<Icon
						library={'wp'}
						icon={'desktop'}
						onClick={(event) => {
							event.stopPropagation();

							handleOnClick('desktop');
						}}
					/>

					<Icon
						library={'wp'}
						icon={'tablet'}
						onClick={(event) => {
							event.stopPropagation();

							handleOnClick('Tablet');
						}}
					/>
					<Icon
						library={'wp'}
						icon={'mobile'}
						onClick={(event) => {
							event.stopPropagation();

							handleOnClick('Mobile');
						}}
					/>
				</Flex>

				<Button
					type={'tertiary'}
					title={__('Canvas Settings', 'publisher-core')}
					onClick={() => {
						setCanvasSettings({
							...canvasSettings,
							isOpen: !canvasSettings.isOpen,
						});
					}}
				>
					{canvasSettings.width}
				</Button>

				{canvasSettings.isOpen && (
					<Popover
						offset={20}
						placement={'bottom-end'}
						title={__('Canvas Settings', 'publisher-core')}
						onClose={() => {
							setCanvasSettings({
								...canvasSettings,
								isOpen: false,
							});
						}}
					>
						<ControlContextProvider
							value={{
								name: 'canvas-editor',
								value: canvasSettings,
								type: 'nested',
							}}
						>
							<InputControl
								id={'width'}
								type={'number'}
								unitType={'height'}
								columns={'columns-2'}
								onChange={(newValue) =>
									setCanvasSettings({
										...canvasSettings,
										width: newValue,
									})
								}
								label={__('Width', 'publisher-core')}
							/>
							<InputControl
								id={'height'}
								type={'number'}
								unitType={'width'}
								columns={'columns-2'}
								onChange={(newValue) =>
									setCanvasSettings({
										...canvasSettings,
										width: newValue,
									})
								}
								label={__('Height', 'publisher-core')}
							/>
						</ControlContextProvider>
					</Popover>
				)}
			</Flex>

			<Preview refId={refId} />
		</>
	);
};
