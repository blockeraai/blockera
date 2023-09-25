<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions\Contracts;

interface Style {

	/**
	 * Retrieve css props.
	 *
	 * @return array the css properties as array
	 */
	public function getProperties(): array;

}
