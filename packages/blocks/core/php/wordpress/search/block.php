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
		'selectors' => [
			'innerBlocks' => [
				'label'  => [
					'root' => '.wp-block-search__label',
				],
				'input'  => [
					'root' => '.wp-block-search__input',
				],
				'button' => [
					'root' => '.wp-block-search__button',
				],
			],
		],
	]
);
