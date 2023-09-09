/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';

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

export const PositionExtension = memo(
	({
		block,
		config,
		children,
		zIndexValue,
		positionValue,
		handleOnChangeAttributes,
		...props
	}) => {
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
						<BaseControl controlName="box-position">
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
							<BaseControl
								controlName="input"
								label={__('z-index', 'publisher-core')}
							>
								<InputControl
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
							</BaseControl>
						</ControlContextProvider>
					)}
			</>
		);
	},
	hasSameProps
);
