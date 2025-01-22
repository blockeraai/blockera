<?php
/**
 * The hooks bootstrap file.
 *
 * @package bootstrap/hooks
 */

/**
 * FIXME: Please remove this add_filter after finalize variable registration codes.
 * TODO: This is just an example of registration variable groups.
 */
add_filter(
	'blockera/variable/groups/registry',
	static function ( array $groups ): array {

		return array_merge(
			$groups,
			[
				'blockera-one-spacing'   => [
					'label' => __( 'Blockera One Spacing Sizes', 'blockera' ),
					'type'  => 'spacing',
				],
				'blockera-one-font-size' => [
					'label' => __( 'Blockera One Font Sizes', 'blockera' ),
					'type'  => 'font-size',
				],
			],
		);
	}
);

/**
 * FIXME: Please remove this add_filter after finalize variable registration codes.
 * TODO: This is just an example of registration variable groups.
 */
add_filter(
	'blockera/variable/groups/blockera-one-spacing/items/registry',
	static function ( array $values ): array {

		return array_merge(
			$values,
			[
				[
					'value'     => '60px',
					'name'      => 'blockera-one-spacing-60',
					'id'        => 'var:preset|spacing|60',
					'type'      => 'spacing',
					'group'     => 'blockera-one-spacing',
					'var'       => '--blockera-one-spacing-preset-60',
					'label'     => __( '60', 'blockera' ),
					'reference' => [
						'type' => 'core',
					],
				],
			]
		);
	},
	10
);
