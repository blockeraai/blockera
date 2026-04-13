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
				// Features selectors.
				'spacing' => [
					'root' => '.wp-block-audio audio::-webkit-media-controls-enclosure',
				],
				'background' => [
					'root' => '.wp-block-audio audio::-webkit-media-controls-enclosure',
				],
				'border' => [
					'root' => '.wp-block-audio audio::-webkit-media-controls-enclosure',
				],
				'blockeraBorderRadius' => [
					'root' => '.wp-block-audio audio::-webkit-media-controls-enclosure,.wp-block-audio audio',
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
				// States selectors.
				'blockera/states/before' => [
					'root' => '.wp-block-audio::before',
				],
				'blockera/states/after' => [
					'root' => '.wp-block-audio::after',
				],
				// Inner blocks selectors.
				'blockera/elements/caption' => [
					'root' => 'figcaption',
				],
			]
		),
	]
);
