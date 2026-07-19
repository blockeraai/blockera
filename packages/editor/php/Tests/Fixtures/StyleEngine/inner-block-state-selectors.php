<?php

return [
	[
		[
			'block-name'               => 'core/image',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/image',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'img, .components-placeholder',
		'html:root body :where(.blockera-block--phggmy):hover img:hover, html:root body :where(.blockera-block--phggmy):hover .components-placeholder:hover',
	],
	[
		// It Should retrieve selectors array with appending pseudo-class as suffix to "elements/link" selectors.
		[
			'block-name'               => 'core/button',
			'inner-pseudo-class'       => 'normal',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'elements/link',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'a:not(.wp-element-button)',
		'html:root body :where(.blockera-block--phggmy):hover a:not(.wp-element-button)',
	],
	[
		[
			'block-name'               => 'core/button',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'elements/link',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'a:not(.wp-element-button)',
		'html:root body :where(.blockera-block--phggmy):hover a:not(.wp-element-button):hover',
	],
	[
		// Test: Master block state 'normal' with inner-pseudo-class 'hover'
		[
			'block-name'               => 'core/paragraph',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/paragraph',
			'pseudo-class'       => 'normal',
			'fallback'           => '.fallback-css-selector',
		],
		'p, span',
		'html:root body :where(.blockera-block--phggmy) p:hover, html:root body :where(.blockera-block--phggmy) span:hover',
	],
	[
		// Test: Master block state 'active' with inner-pseudo-class 'hover'
		[
			'block-name'               => 'core/heading',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/heading',
			'pseudo-class'       => 'active',
			'fallback'           => '.fallback-css-selector',
		],
		'h1, h2',
		'html:root body :where(.blockera-block--phggmy):active h1:hover, html:root body :where(.blockera-block--phggmy):active h2:hover',
	],
	[
		// Test: Master block state 'focus' with inner-pseudo-class 'active'
		[
			'block-name'               => 'core/input',
			'inner-pseudo-class'       => 'active',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/input',
			'pseudo-class'       => 'focus',
			'fallback'           => '.fallback-css-selector',
		],
		'input, textarea',
		'html:root body :where(.blockera-block--phggmy):focus input:active, html:root body :where(.blockera-block--phggmy):focus textarea:active',
	],
	[
		// Test: Master block state 'hover' with inner-pseudo-class 'normal'
		[
			'block-name'               => 'core/list',
			'inner-pseudo-class'       => 'normal',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/list',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'li, ul',
		'html:root body :where(.blockera-block--phggmy):hover li, html:root body :where(.blockera-block--phggmy):hover ul',
	],
	[
		// Test: Master block state 'parent-class' (should not add parent pseudo-class)
		[
			'block-name'               => 'core/group',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/group',
			'pseudo-class'       => 'parent-class',
			'fallback'           => '.fallback-css-selector',
		],
		'.wp-block-group__inner-container',
		'html:root body :where(.blockera-block--phggmy) .wp-block-group__inner-container:hover',
	],
	[
		// Test: Master block state 'custom-class' (should not add parent pseudo-class)
		[
			'block-name'               => 'core/columns',
			'inner-pseudo-class'       => 'active',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/columns',
			'pseudo-class'       => 'custom-class',
			'fallback'           => '.fallback-css-selector',
		],
		'.wp-block-columns',
		'html:root body :where(.blockera-block--phggmy) .wp-block-columns:active',
	],
	[
		// Test: Empty root selector
		[
			'block-name'               => 'core/quote',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '',
			'blockera-unique-selector' => '',
			'block-settings'     => [],
			'block-type'         => 'core/quote',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'blockquote, cite',
		'blockquote:hover, cite:hover',
	],
	[
		// Test: Selector with pseudo-class function :not()
		[
			'block-name'               => 'core/button',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'elements/link',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'a:not(.wp-element-button):not(.disabled)',
		'html:root body :where(.blockera-block--phggmy):hover a:not(.wp-element-button):not(.disabled):hover',
	],
	[
		// Test: Selector with pseudo-class function :is()
		[
			'block-name'               => 'core/navigation',
			'inner-pseudo-class'       => 'active',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/navigation',
			'pseudo-class'       => 'focus',
			'fallback'           => '.fallback-css-selector',
		],
		':is(.wp-block-navigation-item, .wp-block-navigation-link)',
		'html:root body :where(.blockera-block--phggmy):focus :is(.wp-block-navigation-item, .wp-block-navigation-link):active',
	],
	[
		// Test: Selector with pseudo-class function :where()
		[
			'block-name'               => 'core/social-links',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/social-links',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		':where(.wp-social-link, .wp-block-social-link)',
		'html:root body :where(.blockera-block--phggmy):hover :where(.wp-social-link, .wp-block-social-link):hover',
	],
	[
		// Test: Selector with & pattern
		[
			'block-name'               => 'core/cover',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/cover',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'& .wp-block-cover__background',
		'html:root body :where(.blockera-block--phggmy):hover .wp-block-cover__background:hover',
	],
	[
		// Test: Selector with && pattern and pseudo-class
		[
			'block-name'               => 'core/media-text',
			'inner-pseudo-class'       => 'active',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/media-text',
			'pseudo-class'       => 'focus',
			'fallback'           => '.fallback-css-selector',
		],
		'&&:before',
		// CSS selector rules:
		// Pseudo-elements (::before, ::after, etc.) must come at the end of a simple selector.
		// Pseudo-classes (:active, :hover, etc.) cannot come after pseudo-elements.
		// Valid order: :pseudo-class::pseudo-element (pseudo-class before pseudo-element).
		'html:root body :where(.blockera-block--phggmy):active::before',
	],
	[
		// Test: Multiple selectors with different patterns
		[
			'block-name'               => 'core/gallery',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/gallery',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'.wp-block-gallery img, .wp-block-gallery figure, .wp-block-gallery .wp-block-image',
		'html:root body :where(.blockera-block--phggmy):hover .wp-block-gallery img:hover, html:root body :where(.blockera-block--phggmy):hover .wp-block-gallery figure:hover, html:root body :where(.blockera-block--phggmy):hover .wp-block-gallery .wp-block-image:hover',
	],
	[
		// Test: Inner-pseudo-class 'visited'
		[
			'block-name'               => 'core/button',
			'inner-pseudo-class'       => 'visited',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'elements/link',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'a:not(.wp-element-button)',
		'html:root body :where(.blockera-block--phggmy):hover a:not(.wp-element-button):visited',
	],
	[
		// Test: Inner-pseudo-class 'focus'
		[
			'block-name'               => 'core/search',
			'inner-pseudo-class'       => 'focus',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/search',
			'pseudo-class'       => 'active',
			'fallback'           => '.fallback-css-selector',
		],
		'input[type="search"]',
		'html:root body :where(.blockera-block--phggmy):active input[type="search"]:focus',
	],
	[
		// Test: Both master and inner states are 'normal'
		[
			'block-name'               => 'core/spacer',
			'inner-pseudo-class'       => 'normal',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/spacer',
			'pseudo-class'       => 'normal',
			'fallback'           => '.fallback-css-selector',
		],
		'.wp-block-spacer',
		'html:root body :where(.blockera-block--phggmy) .wp-block-spacer',
	],
	[
		// Test: Using blockera-unique-selector when root is empty
		[
			'block-name'               => 'core/separator',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/separator',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'hr',
		'html:root body :where(.blockera-block--phggmy):hover hr:hover',
	],
	[
		// Test: Complex selector with child combinator
		[
			'block-name'               => 'core/table',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/table',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'table > tbody > tr > td',
		'html:root body :where(.blockera-block--phggmy):hover table > tbody > tr > td:hover',
	],
	[
		// Test: Selector with attribute selector
		[
			'block-name'               => 'core/audio',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/audio',
			'pseudo-class'       => 'hover',
			'fallback'           => '.fallback-css-selector',
		],
		'audio[controls]',
		'html:root body :where(.blockera-block--phggmy):hover audio[controls]:hover',
	],
	[
		// Test: current_state_has_selectors flag (should not append pseudo-class to selector)
		[
			'block-name'               => 'core/video',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'core/video',
			'pseudo-class'       => 'hover',
			'current_state_has_selectors' => true,
			'fallback'           => '.fallback-css-selector',
		],
		'video',
		'html:root body :where(.blockera-block--phggmy):hover video',
	],
	[
		// Test: Master block state 'visited' with inner-pseudo-class 'hover'
		[
			'block-name'               => 'core/button',
			'inner-pseudo-class'       => 'hover',
			'root'                     => '.blockera-block--phggmy',
			'blockera-unique-selector' => '.blockera-block--phggmy',
			'block-settings'     => [],
			'block-type'         => 'elements/link',
			'pseudo-class'       => 'visited',
			'fallback'           => '.fallback-css-selector',
		],
		'a:not(.wp-element-button)',
		'html:root body :where(.blockera-block--phggmy):visited a:not(.wp-element-button):hover',
	],
];
