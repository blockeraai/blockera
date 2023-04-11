/**
 * WordPress dependencies
 */
import { Path, SVG, Rect } from '@wordpress/primitives';

/**
 * Store the publisher icon
 *
 * @return {JSX.Element}
 */
const frame = (
	<SVG viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<Path d="M3 5V7H17V5H3Z" fill="black" />
		<Path d="M5 9V11H15V9H5Z" fill="black" />
		<Path d="M7 13V15H13V13H7Z" fill="black" />
	</SVG>
);

export default frame;
