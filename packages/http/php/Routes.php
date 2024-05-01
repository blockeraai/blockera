<?php

namespace Blockera\Http;

use Blockera\Bootstrap\Application;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * The Routes Class.
 *
 * @package Blockera\Framework\Illuminate\Foundation\Http
 */
class Routes {

	/**
	 * Holds instance of application container.
	 *
	 * @var Application $app
	 */
	protected static Application $app;

	/**
	 * Holds array list of routes.
	 *
	 * @var array $routes
	 */
	protected static array $routes = [];

	/**
	 * Hold the version of api.
	 *
	 * @var string $version
	 */
	public static string $version = '/v1';

	/**
	 * The Routes constructor.
	 *
	 * @param Application $app the application container.
	 */
	public function __construct( Application $app ) {

		self::$app = $app;
	}

	/**
	 * Registration route with method and related controller.
	 *
	 * @param string       $route      the route.
	 * @param string       $methods    the http method.
	 * @param array|string $controller The route http controller.
	 *
	 * @throws BindingResolutionException|\Exception Exception is the base class for binding exception.
	 * @return void
	 */
	public static function register( string $route, string $methods, $controller ): void {

		[ 'controller' => $controller, 'callback' => $callback ] = self::getController( $controller );

		$controller = self::$app->make( $controller, [ self::$app, $route ] );

		if ( ! $controller instanceof RestController ) {

			return;
		}

		if ( self::isRegistered( $route ) ) {

			return;
		}

		$isRegister = register_rest_route(
			$controller->getNameSpace() . self::$version,
			$route,
			[
				'methods'             => $methods,
				'callback'            => [
					$controller,
					is_callable( [ $controller, $callback ] ) ? $callback : 'response',
				],
				'permission_callback' => [ $controller, 'permission' ],
				'allow_batch'         => $controller->__call( 'allowBatch' ),
			]
		);

		if ( ! $isRegister ) {

			throw new \Exception( 'Failed route registration!' );
		}
	}

	/**
	 * Registration route with "GET" http method.
	 *
	 * @param string       $route      The route.
	 * @param array|string $controller The http controller.
	 *
	 * @throws BindingResolutionException Exception is the base class for binding exception.
	 */
	public function get( string $route, $controller ): void {

		static::register( $route, \WP_REST_Server::READABLE, $controller );
	}

	/**
	 * Registration route with "POST" http method.
	 *
	 * @param string       $route      The route.
	 * @param array|string $controller The http controller.
	 *
	 * @throws BindingResolutionException Exception is the base class for binding exception.
	 */
	public function post( string $route, $controller ): void {

		static::register( $route, \WP_REST_Server::CREATABLE, $controller );
	}

	/**
	 * Registration route with "DELETE" http method.
	 *
	 * @param string       $route      The route.
	 * @param array|string $controller The http controller.
	 *
	 * @throws BindingResolutionException Exception is the base class for binding exception.
	 */
	public function delete( string $route, $controller ): void {

		static::register( $route, \WP_REST_Server::DELETABLE, $controller );
	}

	/**
	 * Registration route with "POST, PUT, PATCH" http methods.
	 *
	 * @param string       $route      The route.
	 * @param array|string $controller The http controller.
	 *
	 * @throws BindingResolutionException Exception is the base class for binding exception.
	 */
	public function update( string $route, $controller ): void {

		static::register( $route, \WP_REST_Server::EDITABLE, $controller );
	}

	/**
	 * Retrieve controller callable callback!
	 *
	 * @param array|string $controller the controller.
	 *
	 * @throws \Exception Exception is the base class for all exceptions.
	 * @return array return callback and controller as array
	 */
	protected static function getController( $controller ): array {

		if ( is_null( $controller ) ) {

			throw new \Exception( 'Controller was Null!' );
		}

		$callback = null;

		if ( is_array( $controller ) ) {

			[ $controller, $callback ] = $controller;

		} elseif ( ! class_exists( $controller ) && str_contains( $controller, '@' ) ) {

			[ $controller, $callback ] = explode( '@', $controller );

			$controller = sprintf( '%s%s', blockera_core_config( 'app.namespaces.controllers' ), $controller ?? '' );

			if ( ! class_exists( $controller ) || ! $callback ) {

				throw new \Exception( 'Controller or Callback param was not found!' );
			}
		}

		return compact( 'controller', 'callback' );
	}

	/**
	 * Is registered route?
	 *
	 * @param string $route The route.
	 *
	 * @return bool true on success, false when otherwise.
	 */
	protected static function isRegistered( string $route ): bool {

		return array_search( $route, self::$routes, true );
	}

	/**
	 * Sets version.
	 *
	 * @param string $version the version of route.
	 *
	 * @return void
	 */
	public static function setVersion( string $version ): void {

		self::$version = $version;
	}

	/**
	 * Retrieve the list of registered routes.
	 *
	 * @return array
	 */
	public static function getRoutes(): array {

		return self::$routes;
	}

}
