<?php
/**
 * Class Blockera to contains all services and entities.
 *
 * @package Blockera
 */

namespace Blockera\Setup\Compatibility;

use Blockera\Setup\Compatibility\Themes\Blocksy\Blocksy;

/**
 * A Blockera compatibility class
 *
 * @package Blockera\Setup\Compatibility
 */
class Compatibility {

	/**
	 * Blockera constructor.
	 */
	public function __construct() {

		$this->themes_compatibility();
	}

	/**
	 * Themes compatibility.
	 *
	 * @return void
	 */
	public function themes_compatibility() {
		$themes = [
			'blocksy' => Blocksy::class,
		];

		$current_theme     = wp_get_theme();
		$parent_theme      = $current_theme->parent();
		$theme_name        = $current_theme->get_template();
		$parent_theme_name = $parent_theme ? $parent_theme->get_template() : '';

		if (isset($themes[ $theme_name ]) || ( $parent_theme && isset($themes[ $parent_theme_name ]) )) {
			$theme_class = isset($themes[ $theme_name ]) ? $themes[ $theme_name ] : $themes[ $parent_theme_name ];
			new $theme_class();
		}
	}
}
