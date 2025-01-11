<?php

namespace Blockera\Auth;

use Blockera\Auth\Config;
use Blockera\Bootstrap\Application;

class Validator
{

	/**
	 * Store the auth module identifier.
	 *
	 * @var string $id The auth module identifier.
	 */
	protected string $id;

	/**
	 * Store the consumer.
	 *
	 * @var string $consumer The consumer.
	 */
	protected string $consumer;

	/**
	 * Store the name.
	 *
	 * @var string $name The name.
	 */
	protected string $name;

	/**
	 * Store the version.
	 *
	 * @var string $version The version.
	 */
	protected string $version;

	/**
	 * Store the status.
	 *
	 * @var string $status The status.
	 */
	protected string $status;

	/**
	 * Store the start date.
	 *
	 * @var string $start The start date.
	 */
	protected string $start;

	/**
	 * Store the end date.
	 *
	 * @var string $end The end date.
	 */
	protected string $end;

	/**
	 * The application instance.
	 *
	 * @var Application $app The application instance.
	 */
	protected Application $app;

	/**
	 * The constructor.
	 *
	 * @param Application $app The application instance.
	 */
	public function __construct(Application $app)
	{
		$this->app = $app;
	}

	/**
	 * Set the properties.
	 *
	 * @param array $args The arguments.
	 *
	 * @return void
	 */
	public function __call(string $name, array $arguments): void
	{
		if (property_exists($this, $name)) {
			$this->$name = $arguments[0];
		}
	}

	/**
	 * Check update.
	 *
	 * @param string $id The id.
	 *
	 * @return array The result.
	 */
	public function updateCheck(string $id): array
	{
		$config = $this->app->make(Config::class);
		$data = get_plugin_data(WP_PLUGIN_DIR . '/' . $this->name . '/' . $this->name . '.php');

		if (empty($data)) {
			return [];
		}

		$config = $this->app->make(Config::class);
		$cache_key = $config->getOptionKey() . '__update_check_' . $id;

		// Get the transient.
		$transient = get_transient($cache_key);

		if (! empty($transient)) {
			return $transient;
		}

		$response = wp_remote_post(
			$config->getApiBaseUrl() . '/license-manager/v1/products/' . $id . '/check-for-updates',
			[
				'timeout'     => 30,
				'redirection' => 5,
				'httpversion' => '1.1',
				// Disable SSL verification.
				'sslverify'   => Config::isDev(),
				'headers'     => [
					'Authorization'    => 'Bearer ' . $config->getToken(),
				],
				'body'        => [
					'id' => $id,
					'current_version' => $data['Version'],
					'domain' => get_site_url(),
				],
			]
		);

		if (is_wp_error($response)) {
			return [];
		}

		$responseBody = json_decode(wp_remote_retrieve_body($response), true);

		if (empty($responseBody['success']) || true !== $responseBody['success']) {
			return [];
		}

		// Set the transient for 24 hours.
		set_transient($cache_key, $responseBody['data'], 60 * 60 * 24);

		return $responseBody['data'];
	}

	/**
	 * Check if the plan is allowed.
	 *
	 * @param string $plan The plan.
	 *
	 * @return bool True if the plan is allowed, false otherwise.
	 */
	public function isAllowedPlan(string $plan): bool
	{
		if (empty($plan)) {
			return false;
		}

		$config = $this->app->make(Config::class);

		$transient_key = $config->getOptionKey() . '__allowed_plans';

		$allowed_plans = get_transient($transient_key);

		if (! empty($allowed_plans)) {
			return in_array($plan, $allowed_plans, true);
		}

		$response = wp_remote_post(
			$config->getAllowedPlansLink(),
			[
				'timeout' => 30,
				'redirection' => 5,
				'httpversion' => '1.1',
				'sslverify' => false,
				'body' => [
					'id' => $config->getProductIdentifier(),
				],
			]
		);

		if (is_wp_error($response)) {
			return false;
		}

		$response_body = json_decode(wp_remote_retrieve_body($response), true);

		$allowed_plans = $response_body['data'] ?? [];

		if (empty($allowed_plans)) {
			return false;
		}

		set_transient($transient_key, $allowed_plans, 60 * 60 * 24 * 30);

		return in_array($plan, $allowed_plans, true);
	}
}
