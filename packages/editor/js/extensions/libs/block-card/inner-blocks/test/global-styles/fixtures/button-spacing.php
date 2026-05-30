<?php
/** theme.json: elements.button.spacing padding + blockGap */
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
				'spacing' => array(
					'padding'  => array(
						'top'    => '8px',
						'right'  => '12px',
						'bottom' => '8px',
						'left'   => '12px',
					),
					'blockGap' => '16px',
				),
			)
		);
		return $data;
	},
	10,
	PHP_INT_MAX
);
