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
							'normal' => [
								'type' => 'normal',
								'label' => 'Normal',
								'breakpoints' => [],
							],
							'hover' => [
								'type' => 'hover',
								'label' => 'Hover',
								'breakpoints' => [],
							],
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
