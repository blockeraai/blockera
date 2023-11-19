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
							}}
						>
							<InputControl
								controlName="input"
								columns="columns-2"
								label={__('z-index', 'publisher-core')}
								type="number"
								{...{
									...props,
									defaultValue: '',
									onChange: (newValue) =>
										handleOnChangeAttributes(
											'publisherZIndex',
											newValue
										),
								}}
							/>
						</ControlContextProvider>
					)}
			</>
		);
	},
	hasSameProps
);
