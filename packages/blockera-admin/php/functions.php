<?php

if ( ! function_exists( 'blockera_settings_page_template' ) ) {

	/**
	 * Get the settings page template.
	 *
	 * @return void
	 */
	function blockera_settings_page_template(): void {

		echo '<div id="blockera-admin-settings-container">
				<div class="blockera-loading">
					<div class="blockera-loading-container">
						<svg class="blockera-loading-logo" fill="none" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
							<path d="m29.908 9.9635-12.408 7.1635-12.408-7.1635 12.408-7.1634 12.408 7.1634zm-13.602 13.707v-4.1662c0-0.4268-0.2275-0.8208-0.597-1.0339l-11.939-6.893v13.73l12.088 6.979c0.1988 0.1146 0.4478-0.0286 0.4478-0.2585v-3.9142c0-0.2131-0.1141-0.4101-0.2985-0.517l-1.1939-0.6895c-0.1845-0.1068-0.2985-0.3038-0.2985-0.5169v-2.9788c0-0.1146 0.1242-0.1869 0.2239-0.1296l1.1192 0.6465c0.1988 0.1147 0.4478-0.0286 0.4478-0.2584zm-4.4026 3.3477-5.1487-2.9728v-2.3879l5.0741 2.9293c0.1845 0.1068 0.2985 0.3038 0.2985 0.517v1.7848c0 0.1147-0.1242 0.1869-0.2239 0.1296zm0-4.7756-5.1487-2.9729v-2.3878l5.0741 2.9293c0.1845 0.1068 0.2985 0.3038 0.2985 0.5169v1.7849c0 0.1146-0.1242 0.1869-0.2239 0.1296zm6.7903-3.4177 12.536-7.2375v13.73l-12.536 7.2374v-13.73z" clip-rule="evenodd" fill="#0051E7" fill-rule="evenodd"/>
						</svg>
					</div>
				</div>
		</div>';
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