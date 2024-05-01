<?php

namespace Blockera\Bootstrap;

use Blockera\Bootstrap\Application;

/**
 * Class EntityRegistry for registration entities around of application container.
 *
 * @package EntityRegistry
 */
class EntityRegistry {

	/**
	 * Store instance of application container.
	 *
	 * @var Application $app the instance of Application container object.
	 */
	protected Application $app;

	/**
	 * EntityRegistry constructor.
	 *
	 * @param Application $app the instance of Application container object.
	 */
	public function __construct( Application $app ) {

		$this->app = $app;

		$entities = apply_filters( 'blockera-core/entities/registry', $this->app->getEntities() );

		array_map( [ $this, 'register' ], $entities, array_keys( $entities ) );
	}

	/**
	 * Register entity.
	 *
	 * @param mixed $entity   the any type of entity data.
	 * @param mixed $instance the instance of any type of entity object.
	 *
	 * @return void
	 */
	protected function register( $instance, $entity ): void {

		if ( empty( $instance ) ) {

			return;
		}

		$this->app->setEntities(
			array_merge(
				$this->app->getEntities(),
				[ $entity => $instance ]
			)
		);
	}

}
