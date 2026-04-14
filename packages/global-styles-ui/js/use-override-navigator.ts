/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
export const useOverrideNavigator = ({ panel }: { panel: string }) => {
	useEffect(() => {
		document
			.querySelector(
				'button[data-wp-component="Navigator.BackButton"]:first-child'
			)
			?.addEventListener(
				'click',
				() => {
					document.body.classList.remove(
						`is-open-blockera-${panel}-navigation-override`
					);
				},
				{ once: true }
			);
	}, []);
};
