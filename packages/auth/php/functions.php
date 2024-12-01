<?php

if ( ! function_exists( 'blockera_connect_with_account' ) ) {
	/**
	 * Connect with account.
	 *
	 * @param callable|array $callback The callback function to be executed.
	 * @param callable|array $authorization_callback The callback function to be executed.
	 * @return void
	 */
	function blockera_connect_with_account( $callback, $authorization_callback ): void {
		if ( method_exists( $authorization_callback[0], $authorization_callback[1] ) ) {
			call_user_func( $authorization_callback );
		}

		if ( is_callable( $callback ) ) {
			$callback();

			return;
		}

		wp_die( 'Invalid callback provided for connect with account page.' );
	}
}

if ( ! function_exists( 'blockera_is_connected	' ) ) {

	/**
	 * Check if the user is connected to Blockera.
	 *
	 * @return bool true if connected, false otherwise.
	 */
	function blockera_is_connected(): bool {
		return get_option( 'blockera-access-token', false ) !== false;
	}
}
