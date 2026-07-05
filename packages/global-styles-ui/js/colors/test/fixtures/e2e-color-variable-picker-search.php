<?php
/**
 * E2E theme.json layer: deterministic color presets for variable-picker search tests.
 *
 * Names use an `E2E Search` prefix so assertions never depend on the active theme palette.
 */

use Blockera\Setup\Compatibility\JSONResolver;

/**
 * Production CI builds cache theme.json in JSONResolver per PHP-FPM worker. Clearing on each
 * request ensures this MU layer's `blockera_theme_json_data_theme` filter runs after activation.
 */
add_action(
	'plugins_loaded',
	static function (): void {
		if (! class_exists(JSONResolver::class)) {
			return;
		}

		JSONResolver::clean_cached_data();
	},
	0
);

add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['color'])) {
		$data['settings']['color'] = [];
	}
	$data['settings']['color']['defaultPalette'] = true;

	$presets = [
		[
			'slug'  => 'e-2-e-search-on-brand',
			'name'  => 'E2E Search / E2E Brand / E2E On Brand Leaf',
			'color' => '#aabbcc',
		],
		[
			'slug'  => 'e-2-e-search-accent',
			'name'  => 'E2E Search / E2E Accent Row',
			'color' => '#112233',
		],
		[
			'slug'  => 'e-2-e-search-neutral',
			'name'  => 'E2E Search Neutral Flat',
			'color' => '#445566',
		],
	];

	if (!isset($data['settings']['color']['palette'])) {
		$data['settings']['color']['palette'] = [];
	}

	$palette = &$data['settings']['color']['palette'];
	$uses_origin_buckets = is_array($palette) && (
		isset($palette['theme']) ||
		isset($palette['default']) ||
		isset($palette['custom'])
	);

	if ($uses_origin_buckets) {
		if (!isset($palette['theme']) || !is_array($palette['theme'])) {
			$palette['theme'] = [];
		}
		foreach ($presets as $preset) {
			$palette['theme'][] = $preset;
		}
	} else {
		foreach ($presets as $preset) {
			$palette[] = $preset;
		}
	}

	return $data;
}, 10, PHP_INT_MAX);
