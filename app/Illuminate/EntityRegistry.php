<?php

namespace Publisher\Framework\Illuminate;

use Publisher\Framework\Illuminate\Foundation\Application;

class EntityRegistry {

	/**
	 * Store instance of application container.
	 *
	 * @var Application $app
	 */
	protected Application $app;

	public function __construct( Application $app ) {

		$this->app = $app;

		$this->register();
	}

	/**
	 * Registration entities.
	 *
	 * @return void
	 */
	protected function register(): void {

		$entities = apply_filters( 'publisher-core/entities/registry', $this->app->getEntities() );

		foreach ( $entities as $entity => $instance ) {

			if ( empty( $instance ) ) {

				continue;
			}

			$this->app->setEntities(
				array_merge(
					$this->app->getEntities(),
					[ $entity => $instance ]
				)
			);
		}
	}

}
