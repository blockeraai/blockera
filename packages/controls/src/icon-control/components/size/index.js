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
	const { size, setSize } = useContext( IconContext );

	return (
		<RangeControl
			className="p-blocks-size-control"
			value={ size }
			onChange={ ( value ) => setSize( value ) }
			min={ 12 }
			max={ 30 }
		/>
	);
};

export default SizeControl;
