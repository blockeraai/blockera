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
		'default' => [],
	],
	// Background.
	'blockeraBackground'                => [
		'type'    => 'object',
		'default' => [],
	],
	'blockeraBackgroundColor'           => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraBackgroundClip'            => [
		'type'    => 'string',
		'default' => 'none',
	],
	'blockeraOverlay'                   => [
		'type'    => 'object',
		'default' => [],
	],
	// Block states.
	'blockeraBlockStates'               => [
		'type'    => 'object',
		'default' => [],
	],
	// Border.
	'blockeraBorder'                    => [
		'type'    => 'object',
		'default' => [
			'type' => 'all',
			'all'  => [
				'width' => '',
				'style' => '',
				'color' => '',
			],
		],
	],
	'blockeraBorderRadius'              => [
		'type'    => 'object',
		'default' => [
			'type' => 'all',
			'all'  => '',
		],
	],
	'blockeraBoxShadow'                 => [
		'type'    => 'object',
		'default' => [],
	],
	'blockeraOutline'                   => [
		'type'    => 'object',
		'default' => [],
	],
	// Click animation.
	'blockeraClickAnimation'            => [
		'type'    => 'object',
		'default' => [],
	],
	// Conditions.
	'blockeraConditions'                => [
		'type'    => 'object',
		'default' => [],
	],
	// Custom Style.
	'blockeraCustomCSS'                 => [
		'type'    => 'string',
		'default' => ".block {\n    \n}\n",
	],
	// Effects.
	'blockeraOpacity'                   => [
		'type'    => 'string',
		'default' => '100%',
	],
	'blockeraTransform'                 => [
		'type'    => 'object',
		'default' => [],
	],
	'blockeraTransformSelfPerspective'  => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraTransformSelfOrigin'       => [
		'type'    => 'object',
		'default' => [
			'top'  => '',
			'left' => '',
		],
	],
	'blockeraBackfaceVisibility'        => [
		'type'    => 'string',
		'default' => 'visible',
	],
	'blockeraTransformChildPerspective' => [
		'type'    => 'string',
		'default' => '',
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
		'default' => [],
	],
	'blockeraFilter'                    => [
		'type'    => 'object',
		'default' => [],
	],
	'blockeraBackdropFilter'            => [
		'type'    => 'object',
		'default' => [],
	],
	'blockeraMask'                      => [
		'type'    => 'object',
		'default' => [],
	],
	'blockeraBlendMode'                 => [
		'type'    => 'string',
		'default' => 'normal',
	],
	'blockeraDivider'                   => [
		'type'    => 'object',
		'default' => [],
	],
	// Entrance animation.
	'blockeraEntranceAnimation'         => [
		'type'    => 'object',
		'default' => [],
	],
	// Flex Child.
	'blockeraFlexChildSizing'           => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraFlexChildGrow'             => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraFlexChildShrink'           => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraFlexChildBasis'            => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraFlexChildAlign'            => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraFlexChildOrder'            => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraFlexChildOrderCustom'      => [
		'type'    => 'string',
		'default' => '',
	],
	// Icon.
	'blockeraIcon'                      => [
		'type'    => 'object',
		'default' => [
			'icon'      => '',
			'library'   => '',
			'uploadSVG' => '',
		],
	],
	'blockeraIconPosition'              => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraIconGap'                   => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraIconSize'                  => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraIconColor'                 => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraIconLink'                  => [
		'type'    => 'object',
		'default' => [],
	],
	// Inner Blocks.
	'blockeraInnerBlocks'               => [
		'type'    => 'object',
		'default' => [],
	],
	// Layout.
	'blockeraDisplay'                   => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraFlexLayout'                => [
		'type'    => 'object',
		'default' => [
			'direction'      => 'row',
			'alignItems'     => '',
			'justifyContent' => '',
		],
	],
	'blockeraGap'                       => [
		'type'    => 'object',
		'default' => [
			'lock'    => true,
			'gap'     => '',
			'columns' => '',
			'rows'    => '',
		],
	],
	'blockeraFlexWrap'                  => [
		'type'    => 'object',
		'default' => [
			'value'   => '',
			'reverse' => false,
		],
	],
	'blockeraAlignContent'              => [
		'type'    => 'string',
		'default' => '',
	],
	// Mouse.
	'blockeraCursor'                    => [
		'type'    => 'string',
		'default' => 'default',
	],
	'blockeraUserSelect'                => [
		'type'    => 'string',
		'default' => 'auto',
	],
	'blockeraPointerEvents'             => [
		'type'    => 'string',
		'default' => 'auto',
	],
	// Position.
	'blockeraPosition'                  => [
		'type'    => 'object',
		'default' => [
			'type'     => 'static',
			'position' => [
				'top'    => '',
				'right'  => '',
				'bottom' => '',
				'left'   => '',
			],
		],
	],
	'blockeraZIndex'                    => [
		'type'    => 'string',
		'default' => '',
	],
	// Scroll animation.
	'blockeraScrollAnimation'           => [
		'type'    => 'object',
		'default' => [],
	],
	// Size.
	'blockeraWidth'                     => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraMinWidth'                  => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraMaxWidth'                  => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraHeight'                    => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraMinHeight'                 => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraMaxHeight'                 => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraOverflow'                  => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraRatio'                     => [
		'type'    => 'object',
		'default' => [
			'value'  => '',
			'width'  => '',
			'height' => '',
		],
	],
	'blockeraFit'                       => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraFitPosition'               => [
		'type'    => 'object',
		'default' => [
			'top'  => '',
			'left' => '',
		],
	],
	// Spacing.
	'blockeraSpacing'                   => [
		'type'    => 'object',
		'default' => [
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
	// Style variation.
	'blockeraStyleVariation'            => [
		'type'    => 'object',
		'default' => [],
	],
	// Typography.
	'blockeraFontColor'                 => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraFontSize'                  => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraLineHeight'                => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraTextAlign'                 => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraTextDecoration'            => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraFontStyle'                 => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraTextTransform'             => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraDirection'                 => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraTextShadow'                => [
		'type'    => 'object',
		'default' => [],
	],
	'blockeraLetterSpacing'             => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraWordSpacing'               => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraTextIndent'                => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraTextOrientation'           => [
		'type'    => 'string',
		'default' => '',
	],
	'blockeraTextColumns'               => [
		'type'    => 'object',
		'default' => [
			'columns' => '',
			'gap'     => '2.5rem',
			'divider' => [
				'width' => '',
				'color' => '',
				'style' => 'solid',
			],
		],
	],
	'blockeraTextStroke'                => [
		'type'    => 'object',
		'default' => [
			'color' => '',
			'width' => '1px',
		],
	],
	'blockeraWordBreak'                 => [
		'type'    => 'string',
		'default' => 'normal',
	],
];


