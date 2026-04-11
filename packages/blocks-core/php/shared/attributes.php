<?php
/**
 * Configure block attributes.
 *
 * Optional `changesetGraphPreview` (per attribute): client-only metadata for the editor
 * advanced-label state graph. Not part of WordPress block attribute schema.
 * Shape: array with `type` (editor-recognized preview kind; unknown = no preview).
 * For `type` = color, optional `indicatorType` maps to ColorIndicator (`color`, `gradient`, `image`, or '').
 * For `type` = string, the resolved control value is shown as text in the changeset graph.
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
		'type'              => 'object',
		'default'           => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'color',
		],
	],
	'blockeraBackgroundClip'            => [
		'type'    => 'object',
		'default' => [
			'value' => 'none',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
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
			'value' => "& {\n    \n}\n",
		],
	],
	// Effects.
	'blockeraOpacity'                   => [
		'type'                  => 'object',
		'default'               => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
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
		'changesetGraphPreview' => [
			'type' => 'string',
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
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraTransformChildPerspective' => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
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
		'changesetGraphPreview' => [
			'type' => 'string',
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
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraFlexChildGrow'             => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraFlexChildShrink'           => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraFlexChildBasis'            => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraFlexChildAlign'            => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraFlexChildOrder'            => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraFlexChildOrderCustom'      => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	// Grid Child.
	'blockeraGridChildColumnSpan'       => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraGridChildRowSpan'          => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
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
				'renderedIcon' => '',
			],
		],
	],
	'blockeraIconPosition'              => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraIconGap'                   => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraIconSize'                  => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraIconColor'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'color',
		],
	],
	'blockeraIconRotate'                => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraIconFlipHorizontal'        => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
	],
	'blockeraIconFlipVertical'          => [
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
		'changesetGraphPreview' => [
			'type' => 'string',
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
				'val'   => '',
				'reverse' => false,
			],
		],
	],
	'blockeraAlignContent'              => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraGridMinimumColumnWidth'    => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraGridColumnCount'           => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	// Mouse.
	'blockeraCursor'                    => [
		'type'    => 'object',
		'default' => [
			'value' => 'default',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraUserSelect'                => [
		'type'    => 'object',
		'default' => [
			'value' => 'auto',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraPointerEvents'             => [
		'type'    => 'object',
		'default' => [
			'value' => 'auto',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
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
		'changesetGraphPreview' => [
			'type' => 'string',
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
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraMinWidth'                  => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraMaxWidth'                  => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraHeight'                    => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraMinHeight'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraMaxHeight'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraOverflow'                  => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraRatio'                     => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'val'  => '',
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
	'blockeraBoxSizing'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
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
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraFontAppearance'            => [
		'type'    => 'object',
		'default' => [
			'value' => [
				'weight' => '',
				'style'  => '',
			],
		],
	],
	'blockeraFontColor'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'color',
		],
	],
	'blockeraFontSize'                  => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraLineHeight'                => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraTextAlign'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraTextDecoration'            => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraTextTransform'             => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraDirection'                 => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
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
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraWordSpacing'               => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraTextIndent'                => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
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
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
	'blockeraTextWrap'                  => [
		'type'    => 'object',
		'default' => [
			'value' => '',
		],
		'changesetGraphPreview' => [
			'type' => 'string',
		],
	],
];
