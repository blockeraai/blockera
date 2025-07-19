<?php

namespace Blockera\Features\Traits;

use Blockera\Bootstrap\Application;

trait ApplicationTrait {

	/**
	 * Store the instance of the application.
	 *
	 * @var Application $app the instance of the application.
	 */
	protected Application $app;

	/**
	 * Set the instance of the application.
	 *
	 * @param Application $app the instance of the application.
	 * 
	 * @return void
	 */
	public function setApp( Application $app): void {
		
		$this->app = $app;
	}
}
