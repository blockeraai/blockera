<?php
/**
 * Temporary mu-plugin for global styles save compatibility e2e tests.
 */
add_filter(
	'blockera_theme_json_data_theme',
	function ( $theme_json ) {
		$data = $theme_json;

		if ( ! isset( $data['styles'] ) ) {
			$data['styles'] = [];
		}

		$data['styles']['typography']['textIndent'] = '99px';
		$data['styles']['color']['text']             = '#111111';

		if ( ! isset( $data['styles']['blocks'] ) ) {
			$data['styles']['blocks'] = [];
		}

		if ( ! isset( $data['styles']['blocks']['core/paragraph'] ) ) {
			$data['styles']['blocks']['core/paragraph'] = [];
		}

		$data['styles']['blocks']['core/paragraph']['typography']['textIndent'] = '2px';

		return $data;
	},
	10,
	PHP_INT_MAX
);
