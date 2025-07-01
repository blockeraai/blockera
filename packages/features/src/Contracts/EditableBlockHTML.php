<?php

namespace Blockera\Features\Contracts;

interface EditableBlockHTML {

	/**
	 * The html manipulate method.
	 *
	 * @param array $data The data to manipulate.
	 * 
	 * @return string The manipulated html.
	 */
    public function htmlManipulate( array $data): string;
}
