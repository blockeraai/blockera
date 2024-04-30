<?php

namespace Blockera\Framework\Illuminate\Foundation;

interface ContainerInterface {

	/**
	 * Set registered value addons.
	 *
	 * @param array $value_addons the recieved value addons stack to register.
	 */
	public function setRegisteredValueAddons( array $value_addons = [] ): void;

}