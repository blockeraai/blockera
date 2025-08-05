<?php

use Blockera\Feature\Icon\IconStyleDefinition;

add_filter(
    'blockera.editor.style.definitions',
    function ( $styleDefinitions) {
		$styleDefinitions['IconStyleDefinition'] = IconStyleDefinition::class;

		return $styleDefinitions;
	},
    10
);
