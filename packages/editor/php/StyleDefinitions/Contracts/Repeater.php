<?php 

namespace Blockera\Editor\StyleDefinitions\Contracts;

interface Repeater {

	/**
	 * Check if the setting is valid.
	 *
	 * @param array $setting The setting to check.
	 *
	 * @return bool True if the setting is valid, false otherwise.
	 */
    public function isValidSetting( array $setting): bool;
}
