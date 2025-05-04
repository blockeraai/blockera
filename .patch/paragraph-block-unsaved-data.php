<?php

/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/paragraph
 */

return array_merge(
    $args,
    [
        'attributes' => array_merge(
			$args['attributes'] ?? [],
			[
				'blockeraUnsavedData' => [
                'type' => 'object',
                'default' => [
						'states' => [
							'new-customized-normal' => [
								'type' => 'customized-normal',
								'label' => __( 'Customized Normal', 'blockera' ),
								'category' => 'essential',
								'category-label' => __( 'Essential', 'blockera' ),
								'breakpoints' => [],
								'priority' => 0,
								'force' => true,
								'color' => 'var(--blockera-controls-primary-color-bk)',
							]
						],
                	],
            	],
			]
		),
        'selectors' => array_merge(
            $args['selectors'] ?? [],
            [
                'blockera/elements/link' => [
                    'root' => 'a:not(.wp-element-button)',
                ],
            ]
        ),
    ]
);
