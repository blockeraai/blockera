<div class="notice notice-info is-dismissible">
	<p>
		<?php _e( 'Blockera Pro is available now, Install the plugin to get the full experience.', 'blockera' ); ?>
		<a href="
		<?php
		echo wp_nonce_url(
			add_query_arg(
				[ 'install_plugin' => 'blockera-pro' ],
				admin_url( 'admin.php' )
			),
			'install-plugin_blockera-pro'
		);
		?>
					" class="button">
			<?php _e( 'Install and Activate Blockera PRO', 'blockera' ); ?>
		</a>
	</p>
</div>
