<?php
/**
 * Configure block attributes.
 *
 * @package blockera/packages/blocks/php/attributes/block.php
 */

return [
	// Identifiers.
	'blockeraPropsId'                   => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraCompatId'                  => [
		'type'    => 'string',
		'default' => '',
	],
	// Advanced settings.
	'blockeraAttributes'                => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	// Background.
	'blockeraBackground'                => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	'blockeraBackgroundColor'           => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraBackgroundClip'            => [
		'type'    => 'object',
		'default' => [
			'value' => 'none',
		],
	],
	// Block states.
	'blockeraBlockStates'               => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	// Border.
	'blockeraBorder'                    => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'type' => 'all',
				'all'  => [
					'width' => '',
					'style' => '',
					'color' => '',
				],
			],
		],
	],
	'blockeraBorderRadius'              => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'type' => 'all',
				'all'  => '',
			],
		],
	],
	'blockeraBoxShadow'                 => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	'blockeraOutline'                   => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	// Click animation.
	'blockeraClickAnimation'            => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	// Conditions.
	'blockeraConditions'                => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	// Custom Style.
	'blockeraCustomCSS'                 => [
		'type'    => 'object',
		'default' => [
			'value' => ".block {\n    \n}\n",
		],
	],
	// Effects.
	'blockeraOpacity'                   => [
		'type'    => 'object',
		'default' => [
			'value' => '100%',
		],
	],
	'blockeraTransform'                 => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	'blockeraTransformSelfPerspective'  => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraTransformSelfOrigin'       => [
		'type'    => 'object',
		'default' => [
			'top'  => '',
			'left' => '',
		],
	],
	'blockeraBackfaceVisibility'        => [
		'type'    => 'object',
		'default' => [
			'value' => 'visible',
		],
	],
	'blockeraTransformChildPerspective' => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraTransformChildOrigin'      => [
		'type'    => 'object',
		'default' => [
			'top'  => '',
			'left' => '',
		],
	],
	'blockeraTransition'                => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	'blockeraFilter'                    => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	'blockeraBackdropFilter'            => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	'blockeraMask'                      => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	'blockeraBlendMode'                 => [
		'type'    => 'object',
		'default' => [
			'value' => 'normal',
		],
	],
	'blockeraDivider'                   => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	// Entrance animation.
	'blockeraEntranceAnimation'         => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	// Flex Child.
	'blockeraFlexChildSizing'           => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraFlexChildGrow'             => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraFlexChildShrink'           => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraFlexChildBasis'            => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraFlexChildAlign'            => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraFlexChildOrder'            => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraFlexChildOrderCustom'      => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	// Icon.
	'blockeraIcon'                      => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'icon'      => '',
				'library'   => '',
				'uploadSVG' => '',
			],
		],
	],
	'blockeraIconPosition'              => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraIconGap'                   => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraIconSize'                  => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraIconColor'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraIconLink'                  => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	// Inner Blocks.
	'blockeraInnerBlocks'               => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	// Layout.
	'blockeraDisplay'                   => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraFlexLayout'                => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'direction'      => 'row',
				'alignItems'     => '',
				'justifyContent' => '',
			],
		],
	],
	'blockeraGap'                       => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'lock'    => true,
				'gap'     => '',
				'columns' => '',
				'rows'    => '',
			],
		],
	],
	'blockeraFlexWrap'                  => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'value'   => '',
				'reverse' => false,
			],
		],
	],
	'blockeraAlignContent'              => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	// Mouse.
	'blockeraCursor'                    => [
		'type'    => 'object',
		'default' => [
			'value' => 'default',
		],
	],
	'blockeraUserSelect'                => [
		'type'    => 'object',
		'default' => [
			'value' => 'auto',
		],
	],
	'blockeraPointerEvents'             => [
		'type'    => 'object',
		'default' => [
			'value' => 'auto',
		],
	],
	// Position.
	'blockeraPosition'                  => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'type'     => 'static',
				'position' => [
					'top'    => '',
					'right'  => '',
					'bottom' => '',
					'left'   => '',
				],
			],
		],
	],
	'blockeraZIndex'                    => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	// Scroll animation.
	'blockeraScrollAnimation'           => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	// Size.
	'blockeraWidth'                     => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraMinWidth'                  => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraMaxWidth'                  => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraHeight'                    => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraMinHeight'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraMaxHeight'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraOverflow'                  => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraRatio'                     => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'value'  => '',
				'width'  => '',
				'height' => '',
			],
		],
	],
	'blockeraFit'                       => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraFitPosition'               => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'top'  => '',
				'left' => '',
			],
		],
	],
	// Spacing.
	'blockeraSpacing'                   => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'margin'  => [
					'top'    => '',
					'right'  => '',
					'bottom' => '',
					'left'   => '',
				],
				'padding' => [
					'top'    => '',
					'right'  => '',
					'bottom' => '',
					'left'   => '',
				],
			],
		],
	],
	// Style variation.
	'blockeraStyleVariation'            => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	// Typography.
	'blockeraFontFamily'                => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraFontWeight'                => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraFontColor'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraFontSize'                  => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraLineHeight'                => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraTextAlign'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraTextDecoration'            => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraFontStyle'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraTextTransform'             => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraDirection'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraTextShadow'                => [
		'type'    => 'object',
		'default' => [
			'value' => [],
		],
	],
	'blockeraLetterSpacing'             => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraWordSpacing'               => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraTextIndent'                => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraTextOrientation'           => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraTextColumns'               => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'columns' => '',
				'gap'     => '2.5rem',
				'divider' => [
					'width' => '',
					'color' => '',
					'style' => 'solid',
				],
			],
		],
	],
	'blockeraTextStroke'                => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'color' => '',
				'width' => '1px',
			],
		],
	],
	'blockeraWordBreak'                 => [
		'type'    => 'object',
		'default' => [
			'value' => 'normal',
		],
	],
];


