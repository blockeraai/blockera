/**
 * WordPress dependencies
 */
import { ColorIndicator } from '@wordpress/components';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

/**
 * Internal dependencies
 */
import { Icon } from '@publisher/components';

export default function Header({ x, y, blur, spread, color, unit, isVisible, onChangeVisibility }) {
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
			<span className='publisher-core-box-shadow-visibility'>
				{isVisible && <Icon onClick={() => onChangeVisibility('isVisible', !isVisible)} icon={faEye} type="far" size={16} />}
				{!isVisible && <Icon onClick={() => { onChangeVisibility('isVisible', !isVisible) }} icon={faEyeSlash} type="far" size={16} />}
			</span>
		</>
	);
}
