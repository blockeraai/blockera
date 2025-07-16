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

			$user_roles[ $id ] = true;
		}

		return $user_roles;
	}
}

if ( ! function_exists( 'blockera_get_post_types' ) ) {

	/**
	 * Get the post types.
	 *
	 * @return array the post types.
	 */
	function blockera_get_post_types(): array {

		$normalized_post_types = [];
		$post_types            = get_post_types(
            [
				'public' => true,
				'show_in_rest' => true,
			],
            'object' 
        );

		foreach ( $post_types as $post_type ) {

			if ( 'attachment' === $post_type->name ) {

				continue;
			}

			$normalized_post_types[ $post_type->name ] = true;
		}

		return $normalized_post_types;
	}
}

if ( ! function_exists( 'blockera_get_admin_options' ) ) {

	/**
	 * Get blockera admin options value.
	 *
	 * @param array $path the path to access the options value.
	 *
	 * @return mixed the options value.
	 */
	function blockera_get_admin_options( array $path = []) {

		$default_settings = blockera_core_config( 'panel.std' );

		$options = blockera_get_array_deep_merge($default_settings, get_option('blockera_settings', $default_settings));

		if (empty($path)) {

			return $options;
		}

		return \Blockera\DataEditor\Utility::arrayGet($options, $path);
	}
}

if (! function_exists('blockera_update_breakpoints')) {

    /**
     * Update the breakpoints.
     * Internal configuration synchronization for device-specific display settings.
     *
     * @param array $settings The settings.
     * @param array $breakpoints The breakpoints.
     *
     * @return array
     */
    function blockera_update_breakpoints( array $settings, array $breakpoints): array {

        foreach ($breakpoints as $key => $value) {

            // Skip not native breakpoints.
            if (in_array($key, [ 'desktop', 'tablet', 'mobile' ], true)) {
                continue;
            }

            $breakpoints[ $key ]['native'] = true;
            $breakpoints[ $key ]['status'] = false;
        }

        if (! isset($settings['general']['breakpoints']) || $settings['general']['breakpoints'] === $breakpoints) {

            return $breakpoints;
        }

        update_option(
            'blockera_settings',
            blockera_get_array_deep_merge(
                $settings,
                [
                    'general' => [
                        'breakpoints' => $breakpoints,
                    ],
                ]
            )
        );

        return $breakpoints;
    }
}
