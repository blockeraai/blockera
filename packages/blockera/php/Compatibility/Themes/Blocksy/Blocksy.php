<?php
/**
 * Class Blocksy theme compatibility class.
 *
 * @package Blockera
 */

namespace Blockera\Setup\Compatibility\Themes\Blocksy;

/**
 * A Blocksy theme compatibility class
 *
 * @package Blockera\Setup\Compatibility\Themes\Blocksy
 */
class Blocksy {

	/**
	 * Blocksy constructor.
	 */
	public function __construct() {

		// Check if "blocksy_manager" function exists.
		// If not, Then the theme is not Blocksy.
		if ( ! function_exists('blocksy_manager') ) {
			return;
		}

		add_filter(
            'blockera/variable/groups/registry',
            [ $this, 'registerVariableGroups' ]
        );

		add_filter(
			'blockera/variable/groups/blocksy-width-size/items/registry',
			[ $this, 'registerWidthSizeVariables' ]
		);
	}


	/**
	 * Register variable groups.
	 *
	 * @param array $groups the groups.
	 *
	 * @return array the groups.
	 */
	public function registerVariableGroups( array $groups) {
		return array_merge(
			$groups,
			[
				'blocksy-width-size'   => [
					'label' => sprintf(
						// translators: it's the product name (a theme or plugin name).
						__(
							'%s Width Size',
							'blockera' 
						),
						// translators: Blocksy is a theme name.
						__('Blocksy', 'blockera')
					),
					'type'  => 'width-size',
				],
			],
        );
	}

	/**
	 * Register width size variables.
	 */
	public function registerWidthSizeVariables( array $items ) {

		return array_merge(
			[
				[
					'name'      => __('Normal Container Max Width', 'blockera'),
					'id'        => 'normal-container-max-width',
					'value'     => blocksy_get_theme_mod( 'maxSiteWidth', 1290 ) . 'px',
					'type'      => 'width-size',
					'group'     => 'blocksy-width-size',
					'var'       => '--theme-normal-container-max-width',
					'label'     => __( 'Normal Container Max Width', 'blockera' ),
					'reference' => [
						'type' => 'theme',
						'theme' => 'blocksy',
					],
				],
				[
					'name'      => __('Narrow Container Max Width', 'blockera'),
					'id'        => 'narrow-container-max-width',
					'value'     => blocksy_get_theme_mod( 'narrowContainerWidth', 750 ) . 'px',
					'type'      => 'width-size',
					'group'     => 'blocksy-width-size',
					'var'       => '--theme-narrow-container-max-width',
					'label'     => __( 'Narrow Container Max Width', 'blockera' ),
					'reference' => [
						'type' => 'theme',
						'theme' => 'blocksy',
					],
				],

			],
			$items,
		);
	}
}
