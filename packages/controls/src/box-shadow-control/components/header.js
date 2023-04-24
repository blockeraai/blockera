/**
 * WordPress dependencies
 */
import { ColorIndicator } from '@wordpress/components';
import { memo } from '@wordpress/element';

const Header = ({
	item: { x, y, blur, spread, unit = 'px', color = '#fff' },
	children,
}) => {
	const heading = () => {
		const getNormalizedValue = (value) => {
			if ('string' === typeof value) {
				value = value.replace(/[px,%,em]/g, '');
			}
			if (!value?.length) {
				return `0${unit}`;
			}
			if (!value?.includes(unit)) {
				return `${value}${unit}`;
			}

			return value;
		};

		return `${getNormalizedValue(x)} ${getNormalizedValue(
			y
		)} ${getNormalizedValue(blur)} ${getNormalizedValue(spread)}`;
	};

	return (
		<div className="header-label">
			<ColorIndicator colorValue={color} className="color-indicator" />
			<span className="publisher-core-box-shadow-values">
				{heading()}
			</span>

			{children}
		</div>
	);
};

export default memo(Header);
