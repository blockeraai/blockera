/**
 * WordPress dependencies
 */
import { Icon as WPIcon } from '@wordpress/components';

/**
 * External dependencies
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Icon({
	type,
	size,
	uploadedSVG,
	fixedSizing = false,
	...props
}) {
	if (uploadedSVG) {
		return <img alt={uploadedSVG.title} src={uploadedSVG.url} />;
	}

	if (!props.icon || !type) {
		return <></>;
	}

	if (-1 !== type.indexOf('fa')) {
		return (
			<FontAwesomeIcon
				{...props}
				style={
					!fixedSizing
						? {
								width: `${size}px`,
								height: `${size}px`,
						  }
						: ''
				}
			/>
		);
	}

	return <WPIcon {...props} size={!fixedSizing ? size + 5 : 22} />;
}
