<?php

add_action(
    'blockera_enqueue_blocks_editor_styles',
    function( $base_url, $version) {
		wp_enqueue_style(
            'blockera-block-icon-editor-styles',
            $base_url . 'blockera/block-icon/src/editor-styles.css',
            [],
            $version
		);
	},
    10, 
    2
);
