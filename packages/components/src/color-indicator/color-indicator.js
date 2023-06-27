/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { componentClassNames } from '@publisher/classnames';

export default function ColorIndicator({
	className,
	value = '',
	type = 'color',
	size,
	style,
	...props
}) {
	const customStyle = {};
	let styleClassName = '';

	if (size !== 18) {
		customStyle.width = Number(size) + 'px';
		customStyle.height = Number(size) + 'px';
	}

	switch (type) {
		case '':
		case 'color':
			if (value !== '' && value !== 'none') {
				customStyle.background = value;
			}

			styleClassName =
				'color-' +
				(value === '' || value === 'none' ? 'none' : 'custom');
			break;

		case 'image':
			if (value !== '' && value !== 'none') {
				customStyle.backgroundImage = `url(${value})`;
				styleClassName = 'image-custom';
			} else {
				customStyle.backgroundImage =
					'repeating-conic-gradient(#c7c7c7 0%, #c7c7c7 25%, transparent 0%, transparent 50%)'; // transparent image
				customStyle.backgroundPosition = '50% center';
				customStyle.backgroundSize = '10px 10px';
				styleClassName = 'image-none';
			}
			break;

		case 'gradient':
			if (value !== '' && value !== 'none') {
				customStyle.backgroundImage = value;
				styleClassName = 'gradient-custom';
			} else {
				styleClassName = 'gradient-none';
			}
			break;

		default:
			return <></>;
	}

	return (
		<span
			{...props}
			style={{ ...customStyle, ...style }}
			className={componentClassNames(
				'color-indicator',
				styleClassName,
				className
			)}
		></span>
	);
}

ColorIndicator.propTypes = {
	/**
	 * Specifies the value type. It creates custom indicator for types and return empty tag for invalid types. Empty type will be treated as color.
	 *
	 * @default color
	 */
	type: PropTypes.oneOf(['color', 'image', 'gradient']),
	/**
	 * Specifies the value of indicator. It's always string but the content of value can be differed by the `type` for example gradient or image url.
	 */
	value: PropTypes.string,
	/**
	 * Specifies the size of indicator.
	 *
	 * @default 18
	 */
	size: PropTypes.number,
};

ColorIndicator.defaultProps = {
	type: '',
	value: '',
	size: 18,
};
