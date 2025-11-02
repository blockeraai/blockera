<?php

/**
 * Get the design frontend output file.
 *
 * @param string $design_name The design name.
 *
 * @return string The design frontend output file.
 */
function blockera_test_get_frontend_output( string $design_name): string {

	$fixtures_path = dirname(__DIR__, 2) . '/fixtures/';
	$fixtures_file = $fixtures_path.$design_name. '/frontend.html';

	if (file_exists($fixtures_file)) {
		return file_get_contents($fixtures_file);
	}

	throw new \Exception('Frontend output file not found: ' . $fixtures_file);
}

/**
 * Get the design input file.
 *
 * @param string $design_name The design name.
 *
 * @return string The design input file.
 */
function blockera_test_get_design_input( string $design_name): string {
	$fixtures_path = dirname(__DIR__, 2) . '/fixtures/designs/';

	$fixtures_file = $fixtures_path . $design_name . '/input.html';

	if (file_exists($fixtures_file)) {
		return file_get_contents($fixtures_file);
	}

	throw new \Exception('Design file not found: ' . $fixtures_file);
}