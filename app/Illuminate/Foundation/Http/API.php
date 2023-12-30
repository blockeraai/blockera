<?php

namespace Publisher\Framework\Illuminate\Foundation\Http;

/**
 * The API Interface.
 *
 * @package Publisher\Framework\Illuminate\Foundation\Http\API
 */
interface API {

	/**
	 * Retrieve api type.
	 *
	 * @return string the type of API
	 */
	public function type(): string;
}
