<?php

return [
	[
		[
			'block-name'               => 'core/image',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/image',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'img, .components-placeholder',
		'.blockera-block.blockera-block--phggmy:hover img:hover, .blockera-block.blockera-block--phggmy:hover .components-placeholder:hover',
	],
//	[
//		// It Should retrieve selectors array with appending pseudo-class as suffix to "elements/link" selectors.
//		[
//			'block-name'               => 'core/button',
//			'inner-pseudo-class'       => 'normal',
//			'root'                     => '.blockera-block.blockera-block--phggmy',
//			'blockera-unique-selector' => '.blockera-block.blockera-block--phggmy',
//			'block-settings'     => [],
//			'block-type'         => 'elements/link',
//			'pseudo-class'       => 'hover',
//			'fallback'           => '.fallback-css-selector',
//		],
//		'a:not(.wp-element-button)',
//		'.fallback-css-selector a:not(.wp-element-button):hover',
//	],
//	[
//		[
//			'block-name'               => 'core/button',
//			'inner-pseudo-class'       => 'hover',
//			'root'                     => '.blockera-block.blockera-block--phggmy',
//			'blockera-unique-selector' => '.blockera-block.blockera-block--phggmy',
//			'block-settings'     => [],
//			'block-type'         => 'elements/link',
//			'pseudo-class'       => 'hover',
//			'fallback'           => '.fallback-css-selector',
//		],
//		'a:not(.wp-element-button)',
//		'.fallback-css-selector:hover a:not(.wp-element-button):hover',
//	],
];


//		[
//			'root'       => 'img',
//			'filter'     => [
//				'duotone' => 'img, .components-placeholder',
//			],
//			'fallback'   => '.wp-block-image',
//			'parentRoot' => '.wp-block-image',
//		],
//		[
//			'root'       => '.wp-block-image:hover img:hover',
//			'filter'     => [
//				'duotone' => '.wp-block-image:hover img:hover, .wp-block-image:hover .components-placeholder:hover',
//			],
//			'fallback'   => '.wp-block-image',
//			'parentRoot' => '.wp-block-image',
//		],


//////////

//		[
//			'root'     => 'a:not(.wp-element-button)',
//			'fallback' => '.fallback-css-selector',
//		],
//		[
//			'root'     => '.fallback-css-selector a:not(.wp-element-button):hover',
//			'fallback' => '.fallback-css-selector',
//		],


//////////


//		[
//			'root'     => 'a:not(.wp-element-button)',
//			'fallback' => '.fallback-css-selector',
//		],
//		[
//			'root'     => '.fallback-css-selector:hover a:not(.wp-element-button):hover',
//			'fallback' => '.fallback-css-selector',
//		],