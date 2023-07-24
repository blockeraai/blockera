<?php

if ( ! class_exists( 'PublisherLibraryLoader' ) ) {

	class PublisherLibraryLoader {

		/**
		 * @var string
		 */
		public const VERSION = '1.0.0';

		/**
		 * Store the loader instances.
		 *
		 * @var self[]
		 * @since 1.0.0
		 */
		protected static array $instances = [];

		/**
		 * Store the library multiple version information.
		 *
		 * @var array
		 * @since 1.0.0
		 */
		protected array $registered = [];

		/**
		 * Library unique identifier.
		 *
		 * @var string
		 * @since 1.0.0
		 */
		protected string $id;

		protected function __construct( string $unique_id, $options = [] ) {

			$this->id = $unique_id;

			$options = array_merge(
				[
					'hook_name' => 'plugins_loaded',
					'priority'  => 10,
				],
				$options
			);

			add_action( $options['hook_name'], [ $this, 'setup' ], $options['priority'] );
		}

		/**
		 * Introduce/register library version.
		 *
		 * @param string   $version
		 * @param callable $callback
		 * @param array    ...$arguments
		 *
		 * @since 1.0.0
		 * @return bool
		 */
		public function introduce( string $version, callable $callback, ...$arguments ): bool {

			if ( empty( $version ) ) {

				return false;
			}

			$this->registered[ $version ] = compact( 'callback', 'arguments' );

			return true;
		}

		/**
		 * Get the singleton instance.
		 *
		 * @param string $unique_id
		 * @param array  $options
		 *
		 * @since 1.0.0
		 * @return static
		 */
		public static function instance( string $unique_id, array $options = [] ): self {

			if ( ! isset( self::$instances[ $unique_id ] ) ) {

				self::$instances[ $unique_id ] = new self( $unique_id, $options );
			}

			return self::$instances[ $unique_id ];
		}

		/**
		 * Load the correct version which meet the requirements.
		 *
		 * @hooked after_setup_theme
		 * @since  1.0.0
		 * @return bool
		 */
		public function setup(): bool {

			$selected_version = '0.0.0';

			foreach ( $this->registered as $version => $current ) {

				if ( version_compare( $version, $selected_version, '>' ) ) {

					$selected_version = $version;
				}
			}

			return $this->load( $selected_version );
		}

		/**
		 * Load the specified version.
		 *
		 * @param string $version
		 *
		 * @since 1.0.0
		 * @return bool
		 */
		public function load( string $version ): bool {

			if ( empty( $this->registered[ $version ] ) ) {

				return false;
			}

			$callback  = &$this->registered[ $version ]['callback'];
			$arguments = &$this->registered[ $version ]['arguments'];

			$result = $callback( ...$arguments );

			do_action( 'publisher-core/loader/loaded', $version, $this, $result );

			return true;
		}

		/**
		 * Get the library unique identifier.
		 *
		 * @since 1.0.0
		 * @return string
		 */
		public function id(): string {

			return $this->id;
		}

		/**
		 * Get register version info.
		 *
		 * @param string|null $version
		 *
		 * @since 1.0.0
		 * @return array|null
		 */
		public function get( string $version = null ): ?array {

			if ( ! isset( $version ) ) {

				return $this->registered;
			}

			return $this->registered[ $version ] ?? null;
		}
	}
}
