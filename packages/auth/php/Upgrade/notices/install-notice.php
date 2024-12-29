<div class="notice notice-info is-dismissible">
	<p>
		<?php
		// phpcs:disable
		/* translators: %s: Plugin name */
		printf(
			__('The %s plugin is required. Please install and activate it.', 'blockera'),
			'<strong>' . esc_html($plugin['name']) . '</strong>'
		);
		?>
	</p>
	<p>
		<a href="
					<?php
					echo esc_url(
						wp_nonce_url(
							add_query_arg(
								array(
									'action' => 'install-plugin',
									'plugin' => $plugin['slug'],
								),
								admin_url('update.php')
							),
							'install-plugin_' . $plugin['slug']
						)
					);
					?>
								" class="button button-primary">
			<?php _e('Install Now', 'blockera'); ?>
		</a>
	</p>
</div>