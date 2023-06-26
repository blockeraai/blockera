/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import styles from '../styles/style.lazy.scss';

export const WithPlaygroundStyles = (Story) => {
	useEffect(() => {
		styles.use();

		return styles.unuse;
	}, []);

	return <Story />;
};
