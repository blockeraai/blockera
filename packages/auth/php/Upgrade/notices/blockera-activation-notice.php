<?php if (!\Blockera\Utils\Utils::isPluginInstalled($plugin['pluginSlug'])): ?>
	<div class="notice notice-info is-dismissible">
		<p>
			<?php
			// phpcs:disable
			/* translators: %s: Plugin name */
			printf(
				__('You need to Upgrade to PRO to unlock Pro features.', 'blockera'),
				'<strong>' . esc_html($plugin['productName']) . '</strong>'
			);
			?>
		</p>
		<p>
			<a href="<?php echo esc_url(\Blockera\Auth\Config::get('upgrade_url')); ?>" target="_blank" class="button button-primary">
				<?php _e('Upgrade to Pro', 'blockera'); ?>
			</a>
		</p>
	</div>
<?php elseif (is_plugin_active($plugin['pluginSlug'] . '/' . $plugin['pluginSlug'] . '.php') && empty(\Blockera\Auth\Config::getClientInfo())): ?>
	<div class="notice notice-info is-dismissible">
		<p>
			<?php
			// phpcs:disable
			/* translators: %s: Plugin name */
			_e('You need to activate your license to unlock Pro features.', 'blockera');
			?>
		</p>
		<p>
			<a href="<?php echo esc_url(admin_url('admin.php?page=blockera-settings-account')); ?>" target="_blank" class="button button-primary">
				<?php _e('Activate License', 'blockera'); ?>
			</a>
		</p>
	</div>
<?php endif; ?>
