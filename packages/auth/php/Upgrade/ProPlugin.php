<?php

namespace Blockera\Auth\Upgrade;

use Blockera\Utils\Utils;
use Blockera\Auth\DynamicPropertyTrait;

class ProPlugin {

	/**
	 * Use the dynamic property trait.
	 */
	use DynamicPropertyTrait;

	/**
	 * The slug of the pro plugin.
	 *
	 * @var string $slug The slug of the plugin.
	 */
	private string $slug;

	/**
	 * The name of the pro plugin.
	 *
	 * @var string $name The name of the plugin.
	 */
	private string $name;

	/**
	 * The download URL of the pro plugin.
	 *
	 * @var string $link The download URL of the plugin.
	 */
	private string $link;

	/**
	 * The version of the pro plugin.
	 *
	 * @var string $version The version of the plugin.
	 */
	private string $version;

	/**
	 * The subscription of the pro plugin.
	 *
	 * @var array $subscription The subscription of the plugin.
	 */
	private array $subscription;

	/**
	 * Apply the hooks.
	 *
	 * @return void
	 */
	public function applyHooks(): void {
		add_filter('pre_set_site_transient_update_plugins', [ $this, 'checkForPluginUpdate' ]);
		add_filter('plugins_api', [ $this, 'pluginApiCall' ], 10, 3);
	}

	/**
	 * Set the download link.
	 *
	 * @param string $downloadLink The download link.
	 *
	 * @return void
	 */
	public function setLink( string $downloadLink): void {
		$this->link = $downloadLink;
	}

	/**
	 * Check for plugin update.
	 *
	 * @param \stdClass $transient The transient object.
	 *
	 * @return \stdClass The transient object.
	 */
	public function checkForPluginUpdate( \stdClass $transient): \stdClass {
		$id = $this->slug . '/' . $this->slug . '.php';

		// Check if pro version is not activated.
		if (! is_plugin_active($id)) {
			return $transient;
		}

		$result = $this->validator->updateCheck($this->config->getProductIdentifier());

		if (! empty($result['update_available']) && ! empty($result['new_version'])) {
			$plugin_info = new \stdClass();

			$plugin_info->plugin = $id;
			$plugin_info->icons = $this->config->getIcons();
			$plugin_info->slug = $this->slug;
			$plugin_info->package = '';
			$plugin_info->new_version = $result['new_version'];
			$plugin_info->url = $this->config->getPluginUrl();

			$transient->response[ $plugin_info->plugin ] = $plugin_info;
		} else {
			$plugin_info = get_plugin_data(WP_PLUGIN_DIR . '/' . $id);

			$item = (object) array(
				'id'            => $id,
				'slug'          => $this->slug,
				'plugin'        => $id,
				'new_version'   => $plugin_info['Version'],
				'url'           => '',
				'package'       => '',
				'icons'         => array(),
				'banners'       => array(),
				'banners_rtl'   => array(),
				'tested'        => '',
				'requires_php'  => '',
				'compatibility' => new \stdClass(),
			);

			$transient->no_update[ $id ] = $item;
		}

		return $transient;
	}

	/**
	 * Plugin API call.
	 *
	 * @param \stdClass $result The result \stdClass.
	 * @param string    $action The action.
	 * @param \stdClass $args The arguments.
	 *
	 * @return mixed The result \stdClass.
	 */
	public function pluginApiCall( $result, $action, $args) {
		$file_url = $this->getProPluginFileUrl();

		if (empty($file_url)) {
			return $result;
		}

		$this->link = $file_url;

		if ('plugin_information' !== $action) {
			return $result;
		}

		if ($args->slug !== $this->slug) {
			return $result;
		}

		$plugin_info          = new \stdClass();
		$plugin_info->name    = $this->name;
		$plugin_info->slug    = $this->slug;
		$plugin_info->version = str_replace('v', '', $this->subscription['productVersion']);
		$plugin_info->author  = 'blockera.ai';
		// Minimum WP version.
		$plugin_info->requires = '6.6';
		// WP version tested up to.
		$plugin_info->tested        = '6.7';
		$plugin_info->last_updated  = gmdate('Y-m-d');
		// phpcs:disable
		$plugin_info->sections      = array(
			'description' => sprintf(__('%s Plugin - Includes advanced features', 'blockera'), $this->name),
			'changelog'   => __('View the changelog at our website', 'blockera'),
		);
		$plugin_info->download_link = $this->link;

		return $plugin_info;
	}

	/**
	 * Get the pro plugin file.
	 *
	 * @return string The pro plugin file, empty string if no data is found.
	 */
	private function getProPluginFileUrl(): string
	{
		// Create a transient key to store the subscription temporary data.
		$transient_key = $this->config->getPrefixTransientKey() . Utils::snakeCase(explode('- ', $this->subscription['subscription_name'])[2]);
		$transient = get_transient($transient_key);

		if (empty($transient)) {
			$request = new \WP_REST_Request('POST', '/blockera/v1/auth/subscriptions');
			$request->set_param('force', true);
			$request->set_param('action', 'subscriptions');
			$request->set_header('X-Blockera-Nonce', wp_create_nonce('blockera-connect-with-your-account'));

			$response = rest_do_request($request);
			$response = $response->get_data();

			if (empty($response['success'])) {
				return '';
			}

			// Create a transient key to store the subscription temporary data.
			$transient_key = $this->config->getPrefixTransientKey() . Utils::snakeCase(explode('- ', $this->subscription['subscription_name'])[2]);
			$transient = get_transient($transient_key);

			if (empty($transient)) {
				return '';
			}
		}

		$response = wp_remote_get($this->config->getResourceOwnerDetailsUrl() . '/' . $transient, [
			'timeout' => 30,
			'sslverify' => false,
			'headers' => [
				'Authorization' => 'Bearer ' . $this->config->getToken(),
			],
			'body' => [
				'domain' => get_site_url(),
				'license_id' => $this->subscription['id']
			],
		]);

		if (is_wp_error($response)) {
			return '';
		}

		$response_body = json_decode($response['body'], true);

		if (empty($response_body['success'])) {
			return '';
		}

		return $response_body['data']['fileUrl'] ?? '';
	}
}
