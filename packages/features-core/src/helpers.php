<?php

use Blockera\Features\Core\Contracts\FeatureInterface;

if (! function_exists('blockera_features_list')) {
    /**
     * Get the list of requested features.
     *
     * @param string $project_root The project root directory path.
     *
     * @return array<string, FeatureInterface> The list of features.
     */
    function blockera_features_list( string $project_root): array {
        static $features = null;

        if (null !== $features) {
            return $features;
        }

        $config_file = $project_root . '/config/features.php';

        if (! file_exists($config_file)) {
            $features = [];
            return $features;
        }

        $features = require $config_file;
        return $features;
    }
}

if (! function_exists('blockera_enqueue_features_editor_styles')) {
	/**
	 * Enqueue the blockera features editor styles assets.
	 * 
	 * @param string $base_path The base path of the plugin.
	 * @param string $base_url The base url of the plugin.
	 * @param string $version The version of the plugin.
	 *
	 * @return void
	 */
	function blockera_enqueue_features_editor_styles( string $base_path, string $base_url, string $version) {

		$features = glob($base_path . 'feature-*', GLOB_ONLYDIR);

		foreach ($features as $feature_path) {

			$feature_name = basename($feature_path);

			$editor_styles = glob($feature_path . '/src/editor.css');

			if (empty($editor_styles)) {

				$editor_styles = glob($feature_path . '/php/editor.css');

				if (empty($editor_styles)) {

					continue;
				}
			}

			wp_enqueue_style(
				'blockera-feature-' . $feature_name . '-editor-styles',
				$base_url . $feature_name . '/src/editor.css',
				[],
				$version
			);
		}
	}
}
