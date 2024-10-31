<?php

if ( ! function_exists( 'blockera_ds_is_off' ) ) {

	/**
	 * Check the blockera data stream system is off?
	 *
	 * @return bool true on success, false on otherwise!
	 */
	function blockera_ds_is_off(): bool {

		if ( isset( $_ENV['BLOCKERA_DATA_STREAM_OFF'] ) && 'false' !== $_ENV['BLOCKERA_DATA_STREAM_OFF'] ) {

			return true;
		}

		if ( ! defined( 'BLOCKERA_DATA_STREAM_OFF' ) ) {

			return false;
		}

		return BLOCKERA_DATA_STREAM_OFF;
	}
}
