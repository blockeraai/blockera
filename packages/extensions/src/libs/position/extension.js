/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

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
						name: generateExtensionId(props, 'position'),
						value: attributes.publisherPosition,
					}}
				>
					<BaseControl controlName="box-position">
						<BoxPositionControl
							{...{
								...props,
								//
								onChange: (newValue) =>
									setAttributes({
										...attributes,
										publisherPosition: newValue,
									}),
							}}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}

			{isActiveField(publisherZIndex) &&
				attributes?.publisherPosition?.type !== undefined &&
				attributes?.publisherPosition?.type !== 'static' && (
					<ControlContextProvider
						value={{
							name: generateExtensionId(props, 'z-index'),
							value: attributes.publisherZIndex,
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
										setAttributes({
											...attributes,
											publisherZIndex: newValue,
										}),
								}}
							/>
						</BaseControl>
					</ControlContextProvider>
				)}
		</>
	);
}
