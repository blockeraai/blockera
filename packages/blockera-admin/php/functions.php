<?php

if ( ! function_exists( 'blockera_settings_page_template' ) ) {

	/**
	 * Get the settings page template.
	 *
	 * @return void
	 */
	function blockera_settings_page_template(): void {

		echo '<div id="blockera-admin-settings-container"></div>';
	}
}

if ( ! function_exists( 'blockera_normalized_user_roles' ) ) {

	/**
	 * Preparing user roles and normalizing that with blockera standards.
	 * this used for restrict block visibility controls.
	 *
	 * @return array the normalized user roles.
	 */
	function blockera_normalized_user_roles(): array {

		$user_roles = [];

		foreach ( wp_roles()->get_names() as $id => $name ) {

			// Skip administrator, because this role is specific other restrict block visibility.
			if ( 'administrator' === $id ) {

				continue;
			}

			$user_roles[ $id ] = [
				'name'    => $name,
				'checked' => false,
			];
		}

		return $user_roles;
	}
}
