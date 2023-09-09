/**
 * External dependencies
 */
import { memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	BoxSpacingControl,
	ControlContextProvider,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { generateExtensionId, hasSameProps } from '../utils';

export const SpacingExtension = memo(
	({
		block,
		config,
		children,
		spacingValue,
		handleOnChangeAttributes,
		...props
	}) => {
		const {
			spacingConfig: { publisherSpacing },
		} = config;

		return (
			<>
				{isActiveField(publisherSpacing) && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'spacing'),
							value: spacingValue,
						}}
					>
						<BaseControl controlName="box-spacing">
							<BoxSpacingControl
								{...{
									...props,
									//
									onChange: (newValue) =>
										handleOnChangeAttributes(
											'publisherSpacing',
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
