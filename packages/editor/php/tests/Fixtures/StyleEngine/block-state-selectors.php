<?php

return [
	[
		// It Should retrieve selectors array with just fallback item because original block selectors array is empty!
		[
			'block-name'               => 'core/button',
			'inner-pseudo-class'       => 'normal',
			'root'                     => '.blockera-block.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'master',
			'pseudo-class'       => 'normal',
			'fallback'           => '.fallback-css-selector',
		],
		'.fallback-css-selector',
		'.fallback-css-selector',
	],
	[
		// It Should retrieve selectors array include merged fallback item with original block selectors array.
		[
			'block-name'               => 'core/button',
			'inner-pseudo-class'       => 'normal',
			'root'                     => '.blockera-block.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'master',
			'pseudo-class'       => 'normal',
			'fallback'           => '.fallback-css-selector',
		],
		'.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
		'.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
	],
	[
		// It Should retrieve selectors array with merged fallback item with original block selectors array.
		[
			'block-name'               => 'core/button',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'master',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'.wp-block-image img, .wp-block-image .components-placeholder',
		'.wp-block-image img:hover, .wp-block-image .components-placeholder:hover',
	],
];


//		[
//			'border' => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
//			'shadow' => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
//			'filter' => [
//				'duotone' => '.wp-block-image img, .wp-block-image .components-placeholder',
//			],
//		],
//		[
//			'border'   => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
//			'shadow'   => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
//			'filter'   => [
//				'duotone' => '.wp-block-image img, .wp-block-image .components-placeholder',
//			],
//			'fallback' => '.fallback-css-selector',
//		],


/// ====================

//		[
//			'border'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
//			'shadow'        => '.wp-block-image img, .wp-block-image .wp-block-image__crop-area, .wp-block-image .components-placeholder',
//			'filter'        => [
//				'duotone' => '.wp-block-image img, .wp-block-image .components-placeholder',
//			],
//			'blockera/elements/link' => [
//				'root' => 'a:not(.wp-element-button)',
//			],
//		],
//		[
//			'border'        => '.wp-block-image img:hover, .wp-block-image .wp-block-image__crop-area:hover, .wp-block-image .components-placeholder:hover',
//			'shadow'        => '.wp-block-image img:hover, .wp-block-image .wp-block-image__crop-area:hover, .wp-block-image .components-placeholder:hover',
//			'filter'        => [
//				'duotone' => '.wp-block-image img:hover, .wp-block-image .components-placeholder:hover',
//			],
//			'blockera/elements/link' => [
//				'root' => 'a:not(.wp-element-button)',
//			],
//			'fallback'      => '.fallback-css-selector:hover',
//		],