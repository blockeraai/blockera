<?php

namespace Blockera\Data\ValueAddon;

use Blockera\Bootstrap\Application;

/**
 * Class ValueAddonType
 *
 * @package Blockera\Data\ValueAddon\ValueAddonType
 */
abstract class ValueAddonType {

	/**
	 * Holds the instance of Application Container class.
	 *
	 * @var Application $app
	 */
	protected Application $app;

	/**
	 * @param Application $application the app container.
	 *
	 * @throws \Exception
	 */
	public function __construct( Application $application ) {

		$this->app = $application;
	}

	/**
	 * Retrieve value addon config key.
	 *
	 * @return string the value addon config key.
	 */
	abstract public function getConfigKey(): string;

	/**
	 * Retrieve value addon type.
	 *
	 * @return string the value addon type.
	 */
	abstract public function valueAddonType(): string;

	/**
	 * Retrieve callback rendered value.
	 *
	 * @param string $name the value addon name.
	 *
	 * @return mixed
	 */
	abstract public function getHandler( string $name );

}