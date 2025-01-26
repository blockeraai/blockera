<?php

if ( ! function_exists( 'blockera_telemetry_opt_in_is_off' ) ) {

	/**
	 * Check the blockera telemetry opt-in system is off?
	 *
	 * @param string $slug The consumer product slug.
	 *
	 * @return bool true on success, false on otherwise!
	 */
	function blockera_telemetry_opt_in_is_off( string $slug ): bool {

		$is_disabled = in_array( get_option( "$slug-opt-in-status" ), [ 'SKIP', 'ALLOW' ], true );

		if ( isset( $_ENV['BLOCKERA_TELEMETRY_OPT_IN_OFF'] ) ) {

			return ! ( 'false' === $_ENV['BLOCKERA_TELEMETRY_OPT_IN_OFF'] );
		}

		if ( defined( 'BLOCKERA_TELEMETRY_OPT_IN_OFF' ) ) {

			return BLOCKERA_TELEMETRY_OPT_IN_OFF;
		}

		return $is_disabled;
	}
}


if (! function_exists('blockera_telemetry_debug_logger_is_off')) {

    /**
     * Check the blockera telemetry debug logger system is off?
     *
     * @return bool true on success, false on otherwise!
     */
    function blockera_telemetry_debug_logger_is_off(): bool {

        return blockera_get_experimental([ 'telemetry', 'debugLogger' ]);
    }
}
