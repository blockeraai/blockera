/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { BoxSpacingField } from '@publisher/fields';

/**
 * Internal dependencies
 */
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
				<BoxSpacingField
					{...{
						...props,
						label: '',
						//
						value: attributes.publisherSpacing,
						onChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherSpacing: newValue,
							}),
					}}
				/>
			)}
		</>
	);
}
