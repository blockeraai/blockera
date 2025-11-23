<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/video
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/caption' => [
					'root' => 'figcaption.wp-element-caption',
				],
				'blockeraRatio' => [
					'root' => ' video',
				],
				'blockeraFit' => [
					'root' => ' video',
				],
				'blockeraFitPosition' => [
					'root' => ' video',
				],
			]
		),
	]
);
