<?php
/**
 * E2E theme.json layer: deterministic color presets for variable-picker search tests.
 */
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
			'name'  => 'Base / Primary / On Brand',
			'color' => '#aabbcc',
		],
		[
			'slug'  => 'e-2-e-search-accent',
			'name'  => 'Accent / Secondary Tone',
			'color' => '#112233',
		],
		[
			'slug'  => 'e-2-e-search-neutral',
			'name'  => 'Neutral Surface',
			'color' => '#445566',
		],
	];

	if (!isset($data['settings']['color']['palette'])) {
		$data['settings']['color']['palette'] = [];
	}

	$palette = &$data['settings']['color']['palette'];
	$usesOriginBuckets = is_array($palette) && (
		isset($palette['theme']) ||
		isset($palette['default']) ||
		isset($palette['custom'])
	);

	if ($usesOriginBuckets) {
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
