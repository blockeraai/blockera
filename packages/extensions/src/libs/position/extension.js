// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	BoxPositionControl,
	ControlContextProvider,
	InputControl,
	NoticeControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';
import type { TPositionExtensionProps } from './types/position-extension-props';

export const PositionExtension: MixedElement = memo<TPositionExtensionProps>(
	({
		block,
		config,
		children,
		zIndexValue,
		positionValue,
		handleOnChangeAttributes,
		...props
	}: TPositionExtensionProps): MixedElement => {
		const {
			positionConfig: { publisherPosition, publisherZIndex },
		} = config;

		return (
			<>
				{isActiveField(publisherPosition) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'position'),
							value: positionValue,
							attribute: 'publisherPosition',
							blockName: block.blockName,
						}}
					>
						<BaseControl
							controlName="box-position"
							columns="columns-1"
							label=""
						>
							<BoxPositionControl
								{...{
									...props,
									//
									onChange: (newValue) =>
										handleOnChangeAttributes(
											'publisherPosition',
											newValue
										),
								}}
							/>
							{positionValue?.type === 'sticky' &&
								positionValue.position.top &&
								positionValue.position.bottom && (
									<NoticeControl type="error">
										{__(
											'Selecting both "Top" and "Bottom" for sticky positioning can lead to issues. Set value only for "Top" or "Bottom" to ensure smooth functionality.',
											'publisher-core'
										)}
									</NoticeControl>
								)}
						</BaseControl>
					</ControlContextProvider>
				)}

				{isActiveField(publisherZIndex) &&
					positionValue?.type !== undefined &&
					positionValue?.type !== 'static' && (
						<ControlContextProvider
							value={{
								name: generateExtensionId(block, 'z-index'),
								value: zIndexValue,
								attribute: 'publisherZIndex',
								blockName: block.blockName,
							}}
						>
							<InputControl
								controlName="input"
								columns="columns-2"
								label={__('z-index', 'publisher-core')}
								type="number"
								unitType="z-index"
								arrows={true}
								defaultValue=""
								onChange={(newValue) =>
									handleOnChangeAttributes(
										'publisherZIndex',
										newValue
									)
								}
								{...props}
							/>
						</ControlContextProvider>
					)}
			</>
		);
	},
	hasSameProps
);
