<?php

namespace Publisher\Core\Providers\Assets;

class AssetsProvider {

	protected static $assets= [
		'icons',
		'controls',
		'components',
	];

	public function __construct()
	{
		// add_action('wp_enqueue_scripts' , [$this , 'register']);
	}

	public function register():void
	{

		foreach (self::$assets as $asset) {

			if (!$assetInfo = $this->assetInfo($asset)) {

				continue;
			}

			wp_register_script(
				'@publisher/' . $asset,
				str_replace('\\','/',$assetInfo['script']),
				$assetInfo['deps'],
				$assetInfo['version']
			);
		}
	}

	protected function assetInfo(string $name):array {

		$assetInfoFile =  sprintf('%s/%s/index.min.asset.php',PUBLISHER_DIST_DIR,$name);

		if (!file_exists($assetInfoFile)) {

			return [];
		}

		$assetInfo = include $assetInfoFile;

		$deps = $assetInfo['dependencies'] ?? [];
		$version = $assetInfo['version'] ?? filemtime($assetInfoFile);
		$script = sprintf('%s%s/index.min.js',PUBLISHER_DIST_URL,$name);

		return compact('deps','script','version');
	}
}
