/**
 * WordPress dependenices
 */
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { IconContext } from '../../context';

/**
 * Render size control for icon control
 *
 * @return {Object}
 */
const SizeControl = () => {
	const {
		iconInfo: { size },
		dispatch,
	} = useContext(IconContext);

	return (
		<RangeControl
			className="publisher-core-size-control"
			value={size}
			onChange={(value) => dispatch({ type: 'UPDATE_SIZE', size: value })}
			min={12}
			max={30}
		/>
	);
};

export default SizeControl;
