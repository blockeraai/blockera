<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/search
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'innerBlocks' => [
					'elements/label'  => [
						'root' => '.wp-block-search__label',
					],
					'elements/input'  => [
						'root' => '.wp-block-search__input',
					],
					'elements/button' => [
						'root' => '.wp-block-search__button',
					],
				],
			]
		),
	]
);
