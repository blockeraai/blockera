<?php

if ( ! function_exists( 'blockera_telemetry_is_off' ) ) {

	/**
	 * Check the blockera telemetry system is off?
	 *
	 * @return bool true on success, false on otherwise!
	 */
	function blockera_telemetry_is_off(): bool {

		if ( isset( $_ENV['BLOCKERA_TELEMETRY_OFF'] ) && 'false' !== $_ENV['BLOCKERA_TELEMETRY_OFF'] ) {

			return true;
		}

		if ( ! defined( 'BLOCKERA_TELEMETRY_OFF' ) ) {

			return false;
		}

		return BLOCKERA_TELEMETRY_OFF;
	}
}
