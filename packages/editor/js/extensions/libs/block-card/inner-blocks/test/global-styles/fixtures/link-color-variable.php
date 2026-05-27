<?php
/**
 * theme.json: link element preset colors (var:preset|color|*).
 */
add_filter(
	'blockera_theme_json_data_theme',
	function ( $theme_json ) {
		$data  = $theme_json;
		$block = 'core/group';

		if ( ! isset( $data['styles'] ) ) {
			$data['styles'] = array();
		}
		if ( ! isset( $data['styles']['blocks'] ) ) {
			$data['styles']['blocks'] = array();
		}
		if ( ! isset( $data['styles']['blocks'][ $block ] ) ) {
			$data['styles']['blocks'][ $block ] = array( 'elements' => array() );
		}
		if ( ! isset( $data['styles']['blocks'][ $block ]['elements'] ) ) {
			$data['styles']['blocks'][ $block ]['elements'] = array();
		}
		if ( ! isset( $data['settings']['color']['palette'] ) ) {
			$data['settings']['color']['palette'] = array();
		}

		foreach ( array( 'accent-3' => '#503AA8', 'accent-4' => '#686868' ) as $slug => $color ) {
			$found = false;
			foreach ( $data['settings']['color']['palette'] as $entry ) {
				if ( isset( $entry['slug'] ) && $entry['slug'] === $slug ) {
					$found = true;
					break;
				}
			}
			if ( ! $found ) {
				$data['settings']['color']['palette'][] = array(
					'slug'  => $slug,
					'color' => $color,
					'name'  => ucfirst( str_replace( '-', ' ', $slug ) ),
				);
			}
		}

		$data['styles']['blocks'][ $block ]['elements']['link'] = array_replace_recursive(
			$data['styles']['blocks'][ $block ]['elements']['link'] ?? array(),
			array(
				'color'   => array( 'text' => 'var:preset|color|accent-3' ),
				':hover' => array( 'color' => array( 'text' => 'var:preset|color|accent-4' ) ),
			)
		);

		return $data;
	},
	10,
	PHP_INT_MAX
);
