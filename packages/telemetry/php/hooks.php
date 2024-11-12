<?php

if ( ! function_exists( 'blockera_telemetry_render_container' ) ) {

	/**
	 * Rendering blockera telemetry html element container.
	 *
	 * @return void
	 */
	function blockera_telemetry_render_container(): void {

		?>
		<div id="blockera-telemetry-container"></div>
		<?php
	}
}

add_action( 'admin_footer', 'blockera_telemetry_render_container' );
