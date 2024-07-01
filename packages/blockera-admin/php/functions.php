<?php

if ( ! function_exists( 'blockera_settings_page_template' ) ) {

	/**
	 * Get the settings page template.
	 *
	 * @return void
	 */
	function blockera_settings_page_template(): void {

		include_once __DIR__ . '/panel-loading.php';
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

if ( ! function_exists( 'blockera_get_admin_options' ) ) {

	/**
	 * Get blockera admin options value.
	 *
	 * @return array the options value.
	 */
	function blockera_get_admin_options(): array {

		$default_settings = blockera_core_config( 'panel.std' );

		return blockera_get_array_deep_merge( $default_settings, get_option( 'blockera_settings', $default_settings ) );
	}
}
