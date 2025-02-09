<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/php/third-party/blocksy-search
 */

return array_merge(
	$args,
	[
		'selectors'  => array_merge(
			$args['selectors'] ?? [],
			[
				'root' => ' .ct-search-form',
				'blockera/elements/input'   => [
					'root' => '.ct-search-form input',
				],
				'blockera/elements/button'   => [
					'root' => '.ct-search-form .ct-search-form-controls .wp-element-button',
				],
				'blockera/elements/result-dropdown'   => [
					'root' => '.ct-search-form .ct-search-results',
				],
				'blockera/elements/result-link'   => [
					'root' => '.ct-search-form .ct-search-results .ct-search-item',
				],
				'blockera/elements/filter'   => [
					'root' => '.ct-search-form .ct-fake-select-container .ct-fake-select',
				],
			]
		),
		'supports'  => array_merge(
            $args['supports'] ?? [],
            [
				'blockeraStyleEngineConfig' => [
					'blockeraBorderRadius'   => [
						'all' => '--theme-form-field-border-radius',
						'topLeft' => '--border-top-left-radius',
						'topRight' => '--border-top-right-radius',
						'bottomLeft' => '--border-bottom-left-radius',
						'bottomRight' => '--border-bottom-right-radius',
					],
				],
            ]
        ),
	]
);
