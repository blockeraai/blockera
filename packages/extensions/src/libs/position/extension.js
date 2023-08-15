/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { ControlContextProvider } from '@publisher/controls';
import { BoxPositionField, InputField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';

export function PositionExtension({ children, config, ...props }) {
	const {
		positionConfig: { publisherPosition, publisherZIndex },
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherPosition) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props.blockName, 'position'),
						value: attributes.publisherPosition,
					}}
				>
					<BoxPositionField
						{...{
							...props,
							label: '',
							//
							onChange: (newValue) =>
								setAttributes({
									...attributes,
									publisherPosition: newValue,
								}),
						}}
					/>
				</ControlContextProvider>
			)}

			{isActiveField(publisherZIndex) &&
				attributes?.publisherPosition?.type !== undefined &&
				attributes?.publisherPosition?.type !== 'static' && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								props.blockName,
								'z-index'
							),
							value: attributes.publisherZIndex,
						}}
					>
						<InputField
							label={__('z-index', 'publisher-core')}
							settings={{
								type: 'number',
							}}
							//
							defaultValue=""
							onChange={(newValue) =>
								setAttributes({
									...attributes,
									publisherZIndex: newValue,
								})
							}
						/>
					</ControlContextProvider>
				)}
		</>
	);
}
