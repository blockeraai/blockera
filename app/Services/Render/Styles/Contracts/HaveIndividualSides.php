<?php

namespace Publisher\Framework\Services\Render\Styles\Contracts;

interface HaveIndividualSides {

	/**
	 * Retrieve corresponding valid css property names as array for css individual sides with given publisher property name
	 *
	 * @param string $propId the publisher property name
	 *
	 * @return array
	 */
	public function getCssIndividualSides(string $propId): array;
}
