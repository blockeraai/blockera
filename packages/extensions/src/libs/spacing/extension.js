/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';

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
import { generateExtensionId } from '../utils';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';

export function SpacingExtension({ children, config, ...props }) {
	const {
		spacingConfig: { publisherSpacing },
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherSpacing) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'spacing'),
						value: attributes.publisherSpacing,
					}}
				>
					<BaseControl controlName="box-spacing">
						<BoxSpacingControl
							{...{
								...props,
								//
								onChange: (newValue) =>
									setAttributes({
										...attributes,
										publisherSpacing: newValue,
									}),
							}}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}
		</>
	);
}
