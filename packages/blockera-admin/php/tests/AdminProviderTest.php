<?php

namespace Blockera\Admin\Tests;

use Blockera\Setup\Blockera;
use Blockera\Admin\Providers\AdminProvider;

class AdminProviderTest extends \Blockera\Dev\PHPUnit\AppTestCase
{

	protected static ?AdminProvider $provider = null;

	public function set_up(): void
	{
		parent::set_up();

		// Set up the WordPress admin environment
		set_current_screen('dashboard');

		// Login as admin user
		$user_id = self::factory()->user->create(['role' => 'administrator']);
		wp_set_current_user($user_id);

		// Mock WordPress functions.
		require_once ABSPATH . '/wp-admin/includes/plugin.php'; // Ensure you have WordPress functions available.

		self::$provider = new AdminProvider(new Blockera());
	}

	/**
	 * Test if the menu page is registered.
	 *
	 * @test
	 * @return void
	 */
	public function itShouldRegisterMenuPage(): void
	{
		global $menu, $submenu;
		self::$provider->boot();

		do_action('admin_menu');

		$registeredMenus = array_column($menu, 2);
		$baseMenuSlug = blockera_core_config('menu.menu_slug');

		// Check if the base menu is registered.
		$this->assertContains($baseMenuSlug, $registeredMenus);

		$expectedSubmenus = array_column(blockera_core_config('menu.submenus'), 'menu_slug');

		$submenu_found = false;

		// Assert the submenu was registered under the correct parent slug.
		if (isset($submenu[$baseMenuSlug])) {
			foreach ($submenu[$baseMenuSlug] as $submenu_item) {
				foreach ($expectedSubmenus as $expected_submenu) {
					if ($submenu_item[2] === $expected_submenu) {
						$submenu_found = true;
						break;
					}
				}
			}
		}

		$this->assertTrue($submenu_found, 'Submenu was not registered correctly.');
	}
}
