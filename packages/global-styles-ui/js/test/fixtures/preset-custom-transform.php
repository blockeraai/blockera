<?php
/**
 * User global styles layer: one custom transform preset (`settings.blockeraTransform.presets.custom`).
 *
 * Seeds the active theme's `wp_global_styles` post directly so existing custom variables are
 * available in the variable picker even when {@see e2e-global-styles-read-only.php} blocks edits.
 */

use Blockera\Setup\Compatibility\JSONResolver;

if (! defined('ABSPATH')) {
	exit;
}

/**
 * @return void
 */
function blockera_e2e_seed_custom_transform_preset(): void {
	if (! class_exists(JSONResolver::class)) {
		return;
	}

	static $seeded = false;

	if ($seeded) {
		return;
	}

	$seeded = true;

	$post_id = JSONResolver::get_user_global_styles_post_id();

	if (! $post_id) {
		return;
	}

	$post = get_post($post_id);

	if (! $post instanceof WP_Post) {
		return;
	}

	$config = json_decode($post->post_content, true);

	if (! is_array($config)) {
		$config = [
			'version'                     => 3,
			'isGlobalStylesUserThemeJSON' => true,
			'settings'                    => [],
		];
	}

	if (! isset($config['settings']) || ! is_array($config['settings'])) {
		$config['settings'] = [];
	}

	if (! isset($config['settings']['blockeraTransform']) || ! is_array($config['settings']['blockeraTransform'])) {
		$config['settings']['blockeraTransform'] = [];
	}

	if (! isset($config['settings']['blockeraTransform']['presets']) || ! is_array($config['settings']['blockeraTransform']['presets'])) {
		$config['settings']['blockeraTransform']['presets'] = [];
	}

	if (! isset($config['settings']['blockeraTransform']['presets']['custom']) || ! is_array($config['settings']['blockeraTransform']['presets']['custom'])) {
		$config['settings']['blockeraTransform']['presets']['custom'] = [];
	}

	$slug = 'e-2-e-custom-transform';

	foreach ($config['settings']['blockeraTransform']['presets']['custom'] as $row) {
		if (is_array($row) && isset($row['slug']) && $row['slug'] === $slug) {
			JSONResolver::clean_cached_data();
			return;
		}
	}

	$config['settings']['blockeraTransform']['presets']['custom'][] = [
		'slug' => $slug,
		'name' => 'E2E Custom Transform',
		'items' => [
			[
				'type'   => 'move',
				'move-x' => '8px',
				'move-y' => '0px',
				'move-z' => '0px',
			],
		],
	];

	$config['isGlobalStylesUserThemeJSON'] = true;

	global $wpdb;

	$encoded = wp_json_encode($config);

	if (! is_string($encoded)) {
		return;
	}

	$wpdb->update(
		$wpdb->posts,
		[
			'post_content' => $encoded,
		],
		['ID' => $post_id],
		['%s'],
		['%d']
	);

	clean_post_cache($post_id);
	JSONResolver::clean_cached_data();
}

add_action('plugins_loaded', 'blockera_e2e_seed_custom_transform_preset', 999);
