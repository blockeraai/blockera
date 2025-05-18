<?php 

namespace Blockera\Editor\StyleDefinitions\Contracts;

interface HasIgnoreChecks {

	/**
	 * Check if the style definition is ignored.
	 *
	 * @return bool true if the style definition is ignored, false otherwise.
	 */
	public function isIgnoreChecks(): bool;
}
