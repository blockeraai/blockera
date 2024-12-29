<?php

namespace Blockera\Auth;

use Blockera\Bootstrap\Application;

trait DynamicPropertyTrait {

	/**
	 * The application instance.
	 *
	 * @var Application $app The application instance.
	 */
	protected Application $app;

	/**
	 * The auth config.
	 *
	 * @var Config $config The auth config.
	 */
	public Config $config;

	/**
	 * The validator instance.
	 *
	 * @var Validator $validator The validator instance.
	 */
	private Validator $validator;

	/**
	 * The constructor.
	 *
	 * @param Application $app The application instance.
	 * @param array       $args The arguments.
	 */
	public function __construct( Application $app, array $args = []) {
		$this->app = $app;
		$this->config = $app->make(Config::class);
		$this->validator = $app->make(Validator::class);

		array_map(
			function ( $key, $value) {
				if (property_exists($this, $key)) {
					$this->{$key} = $value;
				}
			},
			array_keys($args),
			$args
		);
	}
}
