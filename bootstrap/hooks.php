<?php

//FIXME: Please remove this add_filter after finalize variable registration codes.
//TODO: This is just an example of registration variable groups.
add_filter( 'publisher-core/variable/groups/registry', static function ( array $groups ): array {

	return array_merge(
		$groups,
		[
			'astra-spacing'   => [
				'label' => __( 'Astra Spacing Sizes' ),
				'type'  => 'spacing',
			],
			'astra-font-size' => [
				'label' => __( 'Astra Font Sizes' ),
				'type'  => 'font-size',
			],
		],
	);
} );

//FIXME: Please remove this add_filter after finalize variable registration codes.
//TODO: This is just an example of registration items into variable group.
add_filter( 'publisher-core/variable/groups/astra-spacing/items/registry', static function ( array $values ): array {

	return
		array_merge(
			$values,
			[
				[
					'value' => '60px',
					'name'  => 'astra-spacing-60',
					'id'    => 'var:preset|spacing|60',
					'type'  => 'spacing',
					'group' => 'astra-spacing',
					'var'   => '--astra-spacing-preset-60',
					'label' => __( '60', 'publisher-core' ),
					'reference' => [
						'type' => 'core',
					]
				]
			]
		);
}, 10 );