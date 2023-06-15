/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { IconField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';

export function IconExtension({ children, config, ...props }) {
	const {
		iconConfig: { publisherIcon },
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherIcon) && (
				<IconField
					{...props}
					label=""
					value={attributes.publisherIcon}
					suggestionsQuery={() => {
						return 'button';
					}}
					onValueChange={(newValue) => {
						setAttributes({
							...attributes,
							publisherIcon: newValue,
						});
					}}
				/>
			)}
		</>
	);
}
