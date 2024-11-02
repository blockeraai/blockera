<?php

namespace Blockera\Telemetry\DataProviders;

class DebugDataProvider implements DataProvider {

	/**
	 * @return array The information data about current site with includes active/inactive theme and plugins.
	 */
	public function getData(): array {

		if ( ! class_exists( 'WP_Debug_Data' ) ) {

			require_once ABSPATH . 'wp-admin/includes/misc.php';
			require_once ABSPATH . 'wp-admin/includes/update.php';
			require_once ABSPATH . 'wp-admin/includes/class-wp-debug-data.php';
		}

		return \WP_Debug_Data::debug_data();
	}

	/**
	 * Retrieve the site data.
	 *
	 * @return array the WordPress core data fields.
	 */
	public function getSiteData(): array {

		$data = $this->getData();

		$data['blockera-plugins-active']   = $data['wp-plugins-active'];
		$data['blockera-plugins-inactive'] = $data['wp-plugins-inactive'];

		unset( $data['wp-plugins-active'], $data['wp-plugins-inactive'] );

		return $data;
	}

}
