<?php

namespace Blockera\WordPress\Admin\Menu;

use Blockera\Exceptions\BaseException;

/**
 * Class Factory for add menu and sub menu pages on WordPress admin dashboard.
 *
 * @package Blockera\WordPress\Admin\Menu\Factory
 */
class Factory {

	/**
	 * Store menu args.
	 *
	 * @var array $menu the menu arguments.
	 */
	protected array $menu = [];

	/**
	 * Menu constructor.
	 *
	 * @param array $args the menu args.
	 */
	public function __construct( array $args = [] ) {

		$this->menu = $args;
	}

	/**
	 * Add menu page on WordPress admin dashboard.
	 *
	 * @throws BaseException Exception for invalid recieved args.
	 * @return void
	 */
	public function add(): void {

		if ( ! $this->validate() ) {

			return;
		}

		// Cloned menu.
		$menu = $this->menu;

		// Remove redundant keys.
		unset( $menu['submenus'] );

		add_menu_page( ...$menu );

		if ( ! empty( $this->menu['submenus'] ) ) {

			array_map( [ $this, 'addSubmenu' ], array_filter( $this->menu['submenus'], [ $this, 'validate' ] ) );
		}
	}

	/**
	 * Add menu page on WordPress admin dashboard.
	 *
	 * @param array $menu the submenu array.
	 *
	 * @return void
	 */
	protected function addSubmenu( array $menu ): void {

		if ( empty( $this->menu['menu_slug'] ) ) {

			return;
		}

		add_submenu_page( $this->menu['menu_slug'], ...$menu );
	}

	/**
	 * Validate requested menu.
	 *
	 * @throws BaseException Exception for invalid recieved args.
	 * @return bool true on success, false on otherwise.
	 */
	protected function validate(): bool {

		$required_params = [
			'page_title',
			'menu_title',
			'capability',
			'menu_slug',
		];

		// Assume invalid menu arguments.
		if ( count( array_intersect( $required_params, array_keys( $this->menu ) ) ) < count( $required_params ) ) {

			$invalid_args = array_diff( $required_params, array_keys( $this->menu ) );
			$plural       = count( $invalid_args ) > 1 ? 's were' : ' was';

			// phpcs:disable
			throw new BaseException(
				__( 'Invalid menu arguments. "' . implode( ', ', $invalid_args ) . '" argument' . $plural . ' not configured!', 'blockera' ),
				500
			);
		}

		return true;
	}

}
