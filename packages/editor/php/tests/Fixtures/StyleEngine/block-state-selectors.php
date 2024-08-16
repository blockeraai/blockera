<?php

return [
	[
		// It Should retrieve selectors array with just fallback item because original block selectors array is empty!
		[
			'block-settings'     => [],
			'is-inner-block'     => false,
			'block-type'         => 'master',
			'master-block-state' => 'normal',
			'pseudo-class'       => 'normal',
			'fallback'           => '.fallback-css-selector',
		],
		[],
		[
			'fallback' => '.fallback-css-selector',
		],
	],
	[
		// It Should retrieve selectors array include merged fallback item with original block selectors array.
		[
			'block-settings'     => [],
			'is-inner-block'     => false,
			'block-type'         => 'master',
			'master-block-state' => 'normal',
			'pseudo-class'       => 'normal',
			'fallback'           => '.fallback-css-selector',
		],
		[
			'border' => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'shadow' => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'filter' => [
				'duotone' => '.wp-block-image img, .wp-block-image .components-placeholder',
			],
		],
		[
			'border'   => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'shadow'   => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'filter'   => [
				'duotone' => '.wp-block-image img, .wp-block-image .components-placeholder',
			],
			'fallback' => '.fallback-css-selector',
		],
	],
	[
		// It Should retrieve selectors array with appending pseudo-class as suffix to "elements/link" selectors.
		[
			'block-settings'     => [],
			'is-inner-block'     => true,
			'block-type'         => 'elements/link',
			'master-block-state' => 'normal',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		[
			'border'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'shadow'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'filter'        => [
				'duotone' => '.wp-block-image img, .wp-block-image .components-placeholder',
			],
			'blockera/elements/link' => [
				'root' => 'a:not(.wp-element-button)',
			],
		],
		[
			'border'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'shadow'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'filter'        => [
				'duotone' => '.wp-block-image img, .wp-block-image .components-placeholder',
			],
			'blockera/elements/link' => [
				'root' => '.fallback-css-selector a:not(.wp-element-button):hover',
			],
			'fallback'      => '.fallback-css-selector',
		],
	],
	[
		// It Should retrieve selectors array with merged fallback item with original block selectors array.
		[
			'block-settings'     => [],
			'is-inner-block'     => false,
			'block-type'         => 'master',
			'master-block-state' => 'hover',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		[
			'border'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'shadow'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'filter'        => [
				'duotone' => '.wp-block-image img, .wp-block-image .components-placeholder',
			],
			'blockera/elements/link' => [
				'root' => 'a:not(.wp-element-button)',
			],
		],
		[
			'border'        => '.wp-block-image img:hover, .wp-block-image .wp-block-image__crop-area:hover, .wp-block-image .components-placeholder:hover',
			'shadow'        => '.wp-block-image img:hover, .wp-block-image .wp-block-image__crop-area:hover, .wp-block-image .components-placeholder:hover',
			'filter'        => [
				'duotone' => '.wp-block-image img:hover, .wp-block-image .components-placeholder:hover',
			],
			'blockera/elements/link' => [
				'root' => 'a:not(.wp-element-button)',
			],
			'fallback'      => '.fallback-css-selector:hover',
		],
	],
	[
		[
			'block-settings'     => [],
			'is-inner-block'     => true,
			'block-type'         => 'elements/link',
			'master-block-state' => 'hover',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		[
			'border'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'shadow'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'filter'        => [
				'duotone' => '.wp-block-image img, .wp-block-image .components-placeholder',
			],
			'blockera/elements/link' => [
				'root' => 'a:not(.wp-element-button)',
			],
		],
		[
			'border'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'shadow'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'filter'        => [
				'duotone' => '.wp-block-image img, .wp-block-image .components-placeholder',
			],
			'blockera/elements/link' => [
				'root' => '.fallback-css-selector:hover a:not(.wp-element-button):hover',
			],
			'fallback'      => '.fallback-css-selector',
		],
	],
	[
		[
			'block-settings'     => [],
			'is-inner-block'     => true,
			'block-type'         => 'core/image',
			'master-block-state' => 'hover',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		[
			'root'          => '.wp-block-image',
			'border'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'shadow'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'filter'        => [
				'duotone' => '.wp-block-image img, .wp-block-image .components-placeholder',
			],
			'blockera/elements/link' => [
				'root' => 'a:not(.wp-element-button), a.example-secondary-class',
			],
			'blockera/core/image'    => [
				'root'   => 'img',
				'filter' => [
					'duotone' => 'img, .components-placeholder',
				],
			],
		],
		[
			'root'          => '.wp-block-image',
			'border'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'shadow'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
			'filter'        => [
				'duotone' => '.wp-block-image img, .wp-block-image .components-placeholder',
			],
			'blockera/elements/link' => [
				'root' => 'a:not(.wp-element-button), a.example-secondary-class',
			],
			'blockera/core/image'    => [
				'root'   => '.wp-block-image:hover img:hover',
				'filter' => [
					'duotone' => '.wp-block-image:hover img:hover, .wp-block-image:hover .components-placeholder:hover',
				],
			],
			'fallback'      => '.fallback-css-selector',
		],
	],
];
