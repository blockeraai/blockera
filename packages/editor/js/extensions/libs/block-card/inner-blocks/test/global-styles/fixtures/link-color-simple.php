<?php
/**
 * theme.json: styles.blocks.core/group.elements.link color (normal + :hover).
 */
add_filter(
	'blockera_theme_json_data_theme',
	function ( $theme_json ) {
		$data  = $theme_json;
		$block = 'core/group';

		if ( ! isset( $data['styles']['blocks'][ $block ]['elements'] ) ) {
			if ( ! isset( $data['styles'] ) ) {
				$data['styles'] = array();
			}
			if ( ! isset( $data['styles']['blocks'] ) ) {
				$data['styles']['blocks'] = array();
			}
			if ( ! isset( $data['styles']['blocks'][ $block ] ) ) {
				$data['styles']['blocks'][ $block ] = array();
			}
			$data['styles']['blocks'][ $block ]['elements'] = array();
		}

		$data['styles']['blocks'][ $block ]['elements']['link'] = array_replace_recursive(
			$data['styles']['blocks'][ $block ]['elements']['link'] ?? array(),
			array(
				'color'   => array( 'text' => '#ffbaba' ),
				':hover' => array( 'color' => array( 'text' => '#ff1d1d' ) ),
			)
		);

		return $data;
	},
	10,
	PHP_INT_MAX
);
