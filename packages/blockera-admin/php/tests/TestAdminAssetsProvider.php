<?php

namespace Blockera\Admin\Tests;

use Blockera\Setup\Blockera;
use Symfony\Component\VarDumper\VarDumper;
use Blockera\Setup\Providers\AppServiceProvider;
use Blockera\Admin\Providers\AdminAssetsProvider;
use Illuminate\Contracts\Container\BindingResolutionException;

class TestAdminAssetsProvider extends \Blockera\Dev\PHPUnit\AppTestCase
{
    protected static ?AdminAssetsProvider $provider = null;

    public function set_up(): void
    {

        parent::set_up();

        $app = new Blockera();
        $appProvider = new AppServiceProvider($app);
        $appProvider->boot();
        self::$provider = new AdminAssetsProvider($app);
    }

    /**
     *
     * @throws BindingResolutionException
     * @return void
     */
    public function testItShouldNotEnqueueBlockeraAdminAssetsOnNewPostPage(): void
    {
		self::$provider->register();
        self::$provider->boot();

        set_current_screen('post.php');

        $this->assertFalse(wp_style_is('@blockera/blockera-admin-styles'));
        $this->assertFalse(wp_script_is('@blockera/blockera-admin'));
    }

    /**
     *
     * @return void
     */
    public function testItShouldEnqueueBlockeraAdminAssetsOnBlockeraSettingsPage(): void
    {
        $user = $this->factory()->user->create();
        wp_set_current_user($user);

        // Set up admin page environment
        set_current_screen('admin.php');
        $_GET['page'] = 'blockera-settings-dashboard';

        // Boot provider which should enqueue assets
		self::$provider->register();
        self::$provider->boot();

        // Trigger admin scripts hook
        do_action('admin_enqueue_scripts');

        // Verify each admin asset is properly enqueued
        $admin_assets = blockera_core_config('assets.admin.list');
        foreach ($admin_assets as $asset) {
            $handle = '@blockera/' . $asset;

            if (false !== strpos($asset, '-styles')) {
                $this->assertTrue(
                    wp_style_is($handle, 'enqueued'),
                    sprintf('Asset %s should be enqueued on blockera settings page', $handle)
                );
            } else {
                $this->assertTrue(
                    wp_script_is($handle, 'enqueued'),
                    sprintf('Asset %s should be enqueued on blockera settings page', $handle)
                );
            }
        }
    }
}
