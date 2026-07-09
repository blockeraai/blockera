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
				'blockera/elements/label'  => [
					'root' => '.wp-block-search__label',
				],
				'blockera/elements/input'  => [
					'root' => '.wp-block-search__input',
				],
				'blockera/elements/button' => [
					'root' => '.wp-block-search__button',
				],
			]
		),
	]
);
