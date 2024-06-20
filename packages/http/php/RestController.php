<?php
// phpcs:disable
namespace Blockera\Http;

use Blockera\Bootstrap\Application;

abstract class RestController {

	/**
	 * Holds Rest API namespace.
	 */
	protected const NAMESPACE = 'blockera';

	/**
	 * @var Application $app the instance of app container object.
	 */
	protected Application $app;

	/**
	 * @var string $method the http method of controller
	 */
	private string $method = 'GET';

	/**
	 * @var string $route the route of controller
	 */
	protected string $route;

	/**
	 * Rest Controller Constructor.
	 */
	public function __construct( Application $app, string $route = '/' ) {

		$this->app   = $app;
		$this->route = $route;
	}

	/**
	 * @param string $method the method request
	 *
	 * @return void
	 */
	public function setMethod( string $method ): void {

		$this->method = $method;
	}

	/**
	 * Retrieve namespace of Rest controller
	 *
	 * @return string
	 */
	public function getNameSpace(): string {

		return self::NAMESPACE;
	}

	/**
	 * Retrieve response instance.
	 *
	 * @param \WP_REST_Request $request the request data.
	 *
	 * @return \WP_REST_Response the response instance.
	 */
	public function response( \WP_REST_Request $request ): \WP_REST_Response {

		try {

			// handle custom response.
			if ( ! $this instanceof RestfullAPI ) {

				return $this->response( $request );
			}

			// below available methods for Restfull API!
			switch ( $this->method ) {

				case 'GET':
					return $this->index( $request );

				case 'POST':
					return $this->create( $request );

				case 'PUT':
				case 'PATCH':
					return $this->update( $request );

				case 'DELETE':
					return $this->delete( $request );
			}
		} catch ( \Exception $exception ) {

			return new \WP_REST_Response(
				[
					'success' => false,
					'code'    => $exception->getMessage(),
					'message' => $exception->getTraceAsString(),
				]
			);
		}

		return new \WP_REST_Response(
			[
				'success' => false,
				'code'    => 500,
				'message' => 'Bad Request!',
			]
		);
	}

	/**
	 * The permission callback
	 *
	 * @return mixed should return one of false, null, or a WP_Error
	 * if access is to be disallowed.
	 * Anything else, including other “falsey” values, will grant access.
	 */
	abstract public function permission( \WP_REST_Request $request): bool;

	/**
	 * @return bool true on success, false when otherwise.
	 */
	protected function allowBatch(): bool {

		return false;
	}

	/**
	 * Retrieved response headers.
	 *
	 * @return array
	 */
	protected function getHeaders(): array {

		return [];
	}

	/**
	 * The rest api url.
	 *
	 * @return string
	 */
	public function url(): string {

		return rest_url(
			trailingslashit( $this->getNameSpace() ) . $this->getRoute()
		);
	}

	/**
	 * Magic method to handle custom method calling with the provided params.
	 *
	 * @param string $method     the magic method name.
	 * @param array  $parameters the params.
	 *
	 * @return mixed anything's or instance of \WP_REST_Response object.
	 */
	public function __call( string $method, array $parameters = [] ): mixed {

		if ( method_exists( $this, $method ) ) {

			// If the method exists in the controller, call it with the provided parameters.
			return call_user_func_array( [ $this, $method ], $parameters );
		}

		// Handle undefined methods here.
		return new \WP_REST_Response( '404 Not Found', 404 );
	}

	/**
	 * @return string the route of controller
	 */
	public function getRoute(): string {

		return $this->route;
	}

}
