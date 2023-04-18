/**
 * WordPress dependencies
 */
import { ColorIndicator } from '@wordpress/components';

export default function Header({ x, y, blur, spread, color }) {
	return (
		<>
			<ColorIndicator colorValue={color} className='publisher-core-box-shadow-heading-color' />
			<span className='publisher-core-box-shadow-values'>
				{`${x}px ${y}px ${blur}px ${spread}px`}
			</span>
		</>
	);
}
