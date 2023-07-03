/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { BoxPositionField, InputField } from '@publisher/fields';

/**
 * Internal dependencies
 */
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
				<BoxPositionField
					{...{
						...props,
						label: '',
						//
						value: attributes.publisherPosition,
						onChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherPosition: newValue,
							}),
					}}
				/>
			)}

			{isActiveField(publisherZIndex) &&
				attributes?.publisherPosition?.type !== undefined &&
				attributes?.publisherPosition?.type !== 'static' && (
					<InputField
						label={__('z-index', 'publisher-core')}
						settings={{
							type: 'number',
						}}
						//
						defaultValue=""
						value={attributes.publisherZIndex}
						onChange={(newValue) =>
							setAttributes({
								...attributes,
								publisherZIndex: newValue,
							})
						}
					/>
				)}
		</>
	);
}
