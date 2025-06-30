<?php

use Blockera\Features\Contracts\FeatureInterface;

if (! function_exists('blockera_features_list')) {
    /**
	 * Get the list of requested features.
	 * 
	 * @param string $project_root The project root directory path.
	 *
	 * @return array<string, FeatureInterface> The list of features.
	 */
	function blockera_features_list( string $project_root): array {
        $config_file = $project_root . '/config/features.php';

		if (! file_exists($config_file)) {
			return [];
		}

		return require $config_file;
    }
}
