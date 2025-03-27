<?php

if (! function_exists('bdd')) {
	/**
	 * Debug function to display data in a browser.
	 *
	 * @param mixed $data The data to display.
	 *
	 * @return void
	 */
	function bdd( $data) {
		var_dump($data);
		die();
	}
}
