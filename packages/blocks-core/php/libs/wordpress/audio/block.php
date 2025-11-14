<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/audio
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/caption' => [
					'root' => 'figcaption',
				],
				'spacing' => [
					'root' => '.wp-block-audio audio::-webkit-media-controls-enclosure',
				],
				'background' => [
					'root' => '.wp-block-audio audio::-webkit-media-controls-enclosure',
				],
				'border' => [
					'root' => '.wp-block-audio audio::-webkit-media-controls-enclosure',
				],
				'shadow' => [
					'root' => '.wp-block-audio audio',
				],
				'width' => [
					'root' => '.wp-block-audio audio',
				],
				'dimensions' => [
					'root' => '.wp-block-audio audio',
				],
				'blockeraBackgroundClip' => [
					'root' => '.wp-block-audio',
				],
			]
		),
	]
);
