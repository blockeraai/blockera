<?php
/** theme.json: elements.button.typography letterSpacing, textTransform, fontWeight */
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
		$data['styles']['blocks'][ $block ]['elements']['button'] = array_replace_recursive(
			$data['styles']['blocks'][ $block ]['elements']['button'] ?? array(),
			array(
				'typography' => array(
					'letterSpacing' => '0.05em',
					'textTransform' => 'uppercase',
					'fontWeight'    => '700',
				),
			)
		);
		return $data;
	},
	10,
	PHP_INT_MAX
);
