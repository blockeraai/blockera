<?php

return [
	'publisherSpacing'    => [
		'padding' => [
			'property_keys' => [
				'default'    => 'padding',
			],
			'path'          => [ 'publisherSpacing', 'padding' ],
			'css_vars'      => [
				'spacing' => '--publisher--preset--spacing--$slug',
			],
		],
		'padding-top' => [
			'property_keys' => [
				'default'    => 'padding-top',
			],
			'path'          => [ 'publisherSpacing', 'padding-top' ],
			'css_vars'      => [
				'spacing' => '--publisher--preset--spacing--$slug',
			],
		],
		'padding-right' => [
			'property_keys' => [
				'default'    => 'padding-right',
			],
			'path'          => [ 'publisherSpacing', 'padding-right' ],
			'css_vars'      => [
				'spacing' => '--publisher--preset--spacing--$slug',
			],
		],
		'padding-bottom' => [
			'property_keys' => [
				'default'    => 'padding-bottom',
			],
			'path'          => [ 'publisherSpacing', 'padding-bottom' ],
			'css_vars'      => [
				'spacing' => '--publisher--preset--spacing--$slug',
			],
		],
		'padding-left' => [
			'property_keys' => [
				'default'    => 'padding-left',
			],
			'path'          => [ 'publisherSpacing', 'padding-left' ],
			'css_vars'      => [
				'spacing' => '--publisher--preset--spacing--$slug',
			],
		],
		'margin'  => [
			'property_keys' => [
				'default'    => 'margin',
				'individual' => 'margin-%s',
			],
			'path'          => [ 'publisherSpacing', 'margin' ],
			'css_vars'      => [
				'spacing' => '--publisher--preset--spacing--$slug',
			],
		],
		'margin-top' => [
			'property_keys' => [
				'default'    => 'margin-top',
			],
			'path'          => [ 'publisherSpacing', 'margin-top' ],
			'css_vars'      => [
				'spacing' => '--publisher--preset--spacing--$slug',
			],
		],
		'margin-right' => [
			'property_keys' => [
				'default'    => 'margin-right',
			],
			'path'          => [ 'publisherSpacing', 'margin-right' ],
			'css_vars'      => [
				'spacing' => '--publisher--preset--spacing--$slug',
			],
		],
		'margin-bottom' => [
			'property_keys' => [
				'default'    => 'margin-bottom',
			],
			'path'          => [ 'publisherSpacing', 'margin-bottom' ],
			'css_vars'      => [
				'spacing' => '--publisher--preset--spacing--$slug',
			],
		],
		'margin-left' => [
			'property_keys' => [
				'default'    => 'margin-left',
			],
			'path'          => [ 'publisherSpacing', 'margin-left' ],
			'css_vars'      => [
				'spacing' => '--publisher--preset--spacing--$slug',
			],
		],
	],
	'publisherTextShadow' => [
		'text-shadow' => [
			'property_keys' => [
				'default' => 'text-shadow',
			],
			'path'          => [ 'publisherTextShadow', 'text-shadow' ],
			'css_vars'      => [
				'text-shadow' => '--publisher--preset--text-shadow--$slug',
			],
		],
	],
	'publisherBackground' => [
		'background-image'      => [
			'property_keys' => [
				'default' => 'background-image',
			],
			'path'          => [ 'publisherBackground', 'image' ],
			'css_vars'      => [],
			'classnames'    => [
				'has-background' => true,
			],
		],
		'background-size'       => [
			'property_keys' => [
				'default' => 'background-size',
			],
			'path'          => [ 'publisherBackground', 'size' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'background-position'   => [
			'property_keys' => [
				'default' => 'background-position',
			],
			'path'          => [ 'publisherBackground', 'position' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'background-repeat'     => [
			'property_keys' => [
				'default' => 'background-repeat',
			],
			'path'          => [ 'publisherBackground', 'repeat' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'background-attachment' => [
			'property_keys' => [
				'default' => 'background-attachment',
			],
			'path'          => [ 'publisherBackground', 'attachment' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'background-color'      => [
			'property_keys' => [
				'default' => 'background-color',
			],
			'path'          => [ 'publisherBackground', 'color' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'background-clip'       => [
			'property_keys' => [
				'default' => 'background-clip',
			],
			'path'          => [ 'publisherBackground', 'clip' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'-webkit-background-clip'       => [
			'property_keys' => [
				'default' => '-webkit-background-clip',
			],
			'path'          => [ 'publisherBackground', '-webkit-background-clip' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'-webkit-text-fill-color'       => [
			'property_keys' => [
				'default' => '-webkit-text-fill-color',
			],
			'path'          => [ 'publisherBackground', '-webkit-text-fill-color' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
	],
	'publisherTypography' => [
		'color'           => [
			'property_keys' => [
				'default' => 'color',
			],
			'path'          => [ 'publisherTypography', 'publisherFontColor' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'font-size'       => [
			'property_keys' => [
				'default' => 'font-size',
			],
			'path'          => [ 'publisherTypography', 'publisherFontSize' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'font-style'      => [
			'property_keys' => [
				'default' => 'font-style',
			],
			'path'          => [ 'publisherTypography', 'publisherFontStyle' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'line-height'     => [
			'property_keys' => [
				'default' => 'line-height',
			],
			'path'          => [ 'publisherTypography', 'publisherLineHeight' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'text-align'      => [
			'property_keys' => [
				'default' => 'text-align',
			],
			'path'          => [ 'publisherTypography', 'publisherTextAlign' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'text-transform'  => [
			'property_keys' => [
				'default' => 'text-transform',
			],
			'path'          => [ 'publisherTypography', 'publisherTextTransform' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'word-spacing'    => [
			'property_keys' => [
				'default' => 'word-spacing',
			],
			'path'          => [ 'publisherTypography', 'publisherWordSpacing' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'letter-spacing'    => [
			'property_keys' => [
				'default' => 'letter-spacing',
			],
			'path'          => [ 'publisherTypography', 'publisherLetterSpacing' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'text-decoration' => [
			'property_keys' => [
				'default' => 'text-decoration',
			],
			'path'          => [ 'publisherTypography', 'publisherTextDecoration' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'direction'       => [
			'property_keys' => [
				'default' => 'direction',
			],
			'path'          => [ 'publisherTypography', 'publisherDirection' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'text-indent'       => [
			'property_keys' => [
				'default' => 'text-indent',
			],
			'path'          => [ 'publisherTypography', 'publisherTextIndent' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'-webkit-text-stroke-width'       => [
			'property_keys' => [
				'default' => '-webkit-text-stroke-width',
			],
			'path'          => [ 'publisherTypography', '-webkit-text-stroke-width' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'-webkit-text-stroke-color'       => [
			'property_keys' => [
				'default' => '-webkit-text-stroke-color',
			],
			'path'          => [ 'publisherTypography', '-webkit-text-stroke-color' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'text-orientation'  => [
			'property_keys' => [
				'default' => 'text-orientation',
			],
			'path'          => [ 'publisherTypography', 'text-orientation' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'writing-mode'  => [
			'property_keys' => [
				'default' => 'writing-mode',
			],
			'path'          => [ 'publisherTypography', 'writing-mode' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'column-count'      => [
			'property_keys' => [
				'default' => 'column-count',
			],
			'path'          => [ 'publisherTypography', 'column-count' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'column-gap'        => [
			'property_keys' => [
				'default' => 'column-gap',
			],
			'path'          => [ 'publisherTypography', 'column-gap' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'column-rule-width' => [
			'property_keys' => [
				'default' => 'column-rule-width',
			],
			'path'          => [ 'publisherTypography', 'column-rule-width' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'column-rule-color' => [
			'property_keys' => [
				'default' => 'column-rule-color',
			],
			'path'          => [ 'publisherTypography', 'column-rule-color' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'column-rule-style' => [
			'property_keys' => [
				'default' => 'column-rule-style',
			],
			'path'          => [ 'publisherTypography', 'column-rule-style' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'word-break'        => [
			'property_keys' => [
				'default' => 'word-break',
			],
			'path'          => [ 'publisherTypography', 'publisherWordBreak' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
	],
	'publisherBoxShadow'  => [
		'box-shadow' => [
			'property_keys' => [
				'default' => 'box-shadow',
			],
			'path'          => [ 'publisherBoxShadow', 'box-shadow' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
	],
	'publisherOutline'    => [
		'outline'        => [
			'property_keys' => [
				'default' => 'outline',
			],
			'path'          => [ 'publisherOutline', 'outline' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'outline-offset' => [
			'property_keys' => [
				'default' => 'outline-offset',
			],
			'path'          => [ 'publisherOutline', 'outline-offset' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
	],
	'publisherEffects'    => [
		'opacity'             => [
			'property_keys' => [
				'default' => 'opacity',
			],
			'path'          => [ 'publisherEffects', 'publisherOpacity', 'opacity' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'transform'           => [
			'property_keys' => [
				'default' => 'transform',
			],
			'path'          => [ 'publisherEffects', 'publisherTransform', 'transform' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'transform-origin'    => [
			'property_keys' => [
				'default' => 'transform-origin',
			],
			'path'          => [ 'publisherEffects', 'publisherTransform', 'transform-origin' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'backface-visibility' => [
			'property_keys' => [
				'default' => 'backface-visibility',
			],
			'path'          => [ 'publisherEffects', 'publisherTransform', 'backface-visibility' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'perspective'         => [
			'property_keys' => [
				'default' => 'perspective',
			],
			'path'          => [ 'publisherEffects', 'publisherTransform', 'perspective' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'perspective-origin'  => [
			'property_keys' => [
				'default' => 'perspective-origin',
			],
			'path'          => [ 'publisherEffects', 'publisherTransform', 'perspective-origin' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'transition'          => [
			'property_keys' => [
				'default' => 'transition',
			],
			'path'          => [ 'publisherEffects', 'publisherTransition', 'transition' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'filter'              => [
			'property_keys' => [
				'default' => 'filter',
			],
			'path'          => [ 'publisherEffects', 'publisherFilter', 'filter' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'backdrop-filter'     => [
			'property_keys' => [
				'default' => 'backdrop-filter',
			],
			'path'          => [ 'publisherEffects', 'publisherBackdropFilter', 'backdrop-filter' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'cursor'              => [
			'property_keys' => [
				'default' => 'cursor',
			],
			'path'          => [ 'publisherEffects', 'publisherCursor', 'cursor' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'mix-blend-mode'      => [
			'property_keys' => [
				'default' => 'mix-blend-mode',
			],
			'path'          => [ 'publisherEffects', 'publisherBlendMode', 'mix-blend-mode' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
	],
	'publisherSizing'     => [
		'width'    => [
			'property_keys' => [
				'default' => 'width',
			],
			'path'          => [ 'publisherSizing', 'publisherWidth' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'height'   => [
			'property_keys' => [
				'default' => 'height',
			],
			'path'          => [ 'publisherSizing', 'publisherHeight' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'min-width'    => [
			'property_keys' => [
				'default' => 'min-width',
			],
			'path'          => [ 'publisherSizing', 'publisherMinWidth' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'min-height'   => [
			'property_keys' => [
				'default' => 'min-height',
			],
			'path'          => [ 'publisherSizing', 'publisherMinHeight' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'max-width'    => [
			'property_keys' => [
				'default' => 'max-width',
			],
			'path'          => [ 'publisherSizing', 'publisherMaxWidth' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'max-height'   => [
			'property_keys' => [
				'default' => 'max-height',
			],
			'path'          => [ 'publisherSizing', 'publisherMaxHeight' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'overflow' => [
			'property_keys' => [
				'default' => 'overflow',
			],
			'path'          => [ 'publisherSizing', 'publisherOverflow' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'aspect-ratio' => [
			'property_keys' => [
				'default' => 'aspect-ratio',
			],
			'path'          => [ 'publisherSizing', 'publisherRatio' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'object-fit' => [
			'property_keys' => [
				'default' => 'object-fit',
			],
			'path'          => [ 'publisherSizing', 'publisherFit' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'object-position' => [
			'property_keys' => [
				'default' => 'object-position',
			],
			'path'          => [ 'publisherSizing', 'publisherFitPosition' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
	],
	'publisherBorder'     => [
		'border'                     => [
			'property_keys' => [
				'default' => 'border',
			],
			'path'          => [ 'publisherBorder', 'publisherBorder' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'border-top'                 => [
			'property_keys' => [
				'default' => 'border-top',
			],
			'path'          => [ 'publisherBorder', 'border-top' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'border-right'               => [
			'property_keys' => [
				'default' => 'border-right',
			],
			'path'          => [ 'publisherBorder', 'border-right' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'border-bottom'              => [
			'property_keys' => [
				'default' => 'border-bottom',
			],
			'path'          => [ 'publisherBorder', 'border-bottom' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'border-left'                => [
			'property_keys' => [
				'default' => 'border-left',
			],
			'path'          => [ 'publisherBorder', 'border-left' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'border-radius'              => [
			'property_keys' => [
				'default' => 'border-radius',
			],
			'path'          => [ 'publisherBorder', 'publisherBorderRadius' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'border-top-left-radius'     => [
			'property_keys' => [
				'default' => 'border-top-left-radius',
			],
			'path'          => [ 'publisherBorder', 'border-top-left-radius' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'border-top-right-radius'    => [
			'property_keys' => [
				'default' => 'border-top-right-radius',
			],
			'path'          => [ 'publisherBorder', 'border-top-right-radius' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'border-bottom-right-radius' => [
			'property_keys' => [
				'default' => 'border-bottom-right-radius',
			],
			'path'          => [ 'publisherBorder', 'border-bottom-right-radius' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'border-bottom-left-radius'  => [
			'property_keys' => [
				'default' => 'border-bottom-left-radius',
			],
			'path'          => [ 'publisherBorder', 'border-bottom-left-radius' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
	],
	'publisherPosition'   => [
		'position' => [
			'property_keys' => [
				'default' => 'position',
			],
			'path'          => [ 'publisherPosition', 'position' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'top'      => [
			'property_keys' => [
				'default' => 'top',
			],
			'path'          => [ 'publisherPosition', 'top' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'right'    => [
			'property_keys' => [
				'default' => 'right',
			],
			'path'          => [ 'publisherPosition', 'right' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'bottom'   => [
			'property_keys' => [
				'default' => 'bottom',
			],
			'path'          => [ 'publisherPosition', 'bottom' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'left'     => [
			'property_keys' => [
				'default' => 'left',
			],
			'path'          => [ 'publisherPosition', 'left' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'z-index'  => [
			'property_keys' => [
				'default' => 'z-index',
			],
			'path'          => [ 'publisherPosition', 'publisherZIndex' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
	],
	'publisherLayout'     => [
		'display'         => [
			'property_keys' => [
				'default' => 'display',
			],
			'path'          => [ 'publisherLayout', 'publisherDisplay' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'gap'             => [
			'property_keys' => [
				'default' => 'gap',
			],
			'path'          => [ 'publisherLayout', 'publisherGap' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'row-gap'         => [
			'property_keys' => [
				'default' => 'row-gap',
			],
			'path'          => [ 'publisherLayout', 'row-gap' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'flex-wrap'       => [
			'property_keys' => [
				'default' => 'flex-wrap',
			],
			'path'          => [ 'publisherLayout', 'publisherFlexWrap', 'value' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'column-gap'      => [
			'property_keys' => [
				'default' => 'column-gap',
			],
			'path'          => [ 'publisherLayout', 'column-gap' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'align-items'     => [
			'property_keys' => [
				'default' => 'align-items',
			],
			'path'          => [ 'publisherLayout', 'publisherAlignItems' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'align-content'   => [
			'property_keys' => [
				'default' => 'align-content',
			],
			'path'          => [ 'publisherLayout', 'publisherAlignContent' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'flex-direction'  => [
			'property_keys' => [
				'default' => 'flex-direction',
			],
			'path'          => [ 'publisherLayout', 'publisherFlexDirection', 'value' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'justify-content' => [
			'property_keys' => [
				'default' => 'justify-content',
			],
			'path'          => [ 'publisherLayout', 'publisherJustifyContent' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'align-self'      => [
			'property_keys' => [
				'default' => 'align-self',
			],
			'path'          => [ 'publisherLayout', 'publisherFlexChildAlign' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'order'           => [
			'property_keys' => [
				'default' => 'order',
			],
			'path'          => [ 'publisherLayout', 'publisherFlexChildOrder' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
		'flex'            => [
			'property_keys' => [
				'default' => 'flex',
			],
			'path'          => [ 'publisherLayout', 'publisherFlexChildSizing' ],
			'css_vars'      => [],
			'classnames'    => [],
		],
	],
];
