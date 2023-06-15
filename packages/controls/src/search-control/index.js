/**
 * WordPress dependencies
 */
import { SearchControl as WPSearchControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Inner dependencies
 */
import './style.scss';

const SearchControl = ({ ...props }) => {
	return (
		<WPSearchControl className={controlClassNames('search')} {...props} />
	);
};

export default SearchControl;
