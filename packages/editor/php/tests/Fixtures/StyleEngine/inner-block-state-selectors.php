<?php

return [
	[
		[
			'block-settings'     => [],
			'block-type'         => 'core/image',
			'master-block-state' => 'hover',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		[
			'root'       => 'img',
			'filter'     => [
				'duotone' => 'img, .components-placeholder',
			],
			'fallback'   => '.wp-block-image',
			'parentRoot' => '.wp-block-image',
		],
		[
			'root'       => '.wp-block-image:hover img:hover',
			'filter'     => [
				'duotone' => '.wp-block-image:hover img:hover, .wp-block-image:hover .components-placeholder:hover',
			],
			'fallback'   => '.wp-block-image',
			'parentRoot' => '.wp-block-image',
		],
	],
	[
		// It Should retrieve selectors array with appending pseudo-class as suffix to "elements/link" selectors.
		[
			'block-settings'     => [],
			'block-type'         => 'elements/link',
			'master-block-state' => 'normal',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		[
			'root'     => 'a:not(.wp-element-button)',
			'fallback' => '.fallback-css-selector',
		],
		[
			'root'     => '.fallback-css-selector a:not(.wp-element-button):hover',
			'fallback' => '.fallback-css-selector',
		],
	],
	[
		[
			'block-settings'     => [],
			'block-type'         => 'elements/link',
			'master-block-state' => 'hover',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		[
			'root'     => 'a:not(.wp-element-button)',
			'fallback' => '.fallback-css-selector',
		],
		[
			'root'     => '.fallback-css-selector:hover a:not(.wp-element-button):hover',
			'fallback' => '.fallback-css-selector',
		],
	],
];
