<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/php/third-party/blocksy-about-me
 */

return array_merge(
	$args,
	[
		'selectors'  => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/text'   => [
					'root' => '.ct-about-me-name span, .ct-about-me-name a',
				],
				'blockera/elements/icons'   => [
					'root' => '.ct-icon-container',
				],
				'blockera/elements/avatar' => [
					'root' => 'figure img',
				],
				'blockera/elements/name' => [
					'root' => '.ct-about-me-name span',
				],
				'blockera/elements/profile-link' => [
					'root' => '.ct-about-me-name a',
				],
			]
		),
	]
);
