/**
 * WordPress dependencies
 */
import { ColorIndicator } from '@wordpress/components';

export default function Header({ x, y, blur, spread, color, unit }) {
	const heading = () => {
		const getNormalizedValue = (value) => {
			if (!value.length) {
				return unit ? `0${unit}` : '0px';
			}
			if (!unit) {
				return `${value}px`;
			}
			if (!value.includes(unit)) {
				return `${value}${unit}`;
			}

			return value;
		};

		return `${getNormalizedValue(x)} ${getNormalizedValue(y)} ${getNormalizedValue(blur)} ${getNormalizedValue(spread)}`;
	}
	return (
		<>
			<ColorIndicator colorValue={color} className='publisher-core-box-shadow-heading-color' />
			<span className='publisher-core-box-shadow-values'>
				{heading()}
			</span>
		</>
	);
}
