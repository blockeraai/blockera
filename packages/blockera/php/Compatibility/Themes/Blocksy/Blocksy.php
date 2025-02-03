<?php
/**
 * Class Blocksy theme compatibility class.
 *
 * @package Blockera
 */

namespace Blockera\Setup\Compatibility\Themes\Blocksy;

/**
 * A Blocksy theme compatibility class
 *
 * @package Blockera\Setup\Compatibility\Themes\Blocksy
 */
class Blocksy {

	/**
	 * Blocksy constructor.
	 */
	public function __construct() {

		// Check if "blocksy_manager" function exists.
		// If not, Then the theme is not Blocksy.
		if ( ! function_exists('blocksy_manager') ) {
			return;
		}

		add_filter(
            'blockera/variable/groups/registry',
            [ $this, 'registerVariableGroups' ]
        );

		add_filter(
			'blockera/variable/groups/blocksy-colors/items/registry',
			[ $this, 'registerColorVariables' ]
		);

		add_filter(
			'blockera/variable/groups/blocksy-width-size/items/registry',
			[ $this, 'registerWidthSizeVariables' ]
		);
	}


	/**
	 * Register variable groups.
	 *
	 * @param array $groups the groups.
	 *
	 * @return array the groups.
	 */
	public function registerVariableGroups( array $groups) {
		return array_merge(
			$groups,
			[
				'blocksy-colors'   => [
					'label' => sprintf(
					// translators: it's the product name (a theme or plugin name).
                        __(
                            '%s Colors',
                            'blockera' 
                        ),
                        // translators: Blocksy is a theme name.
                        __('Blocksy', 'blockera')
					),
					'type'  => 'color',
				],
				'blocksy-width-size'   => [
					'label' => sprintf(
						// translators: it's the product name (a theme or plugin name).
						__(
							'%s Width Size',
							'blockera' 
						),
						// translators: Blocksy is a theme name.
						__('Blocksy', 'blockera')
					),
					'type'  => 'width-size',
				],
			],
        );
	}

	/**
	 * Register width size variables.
	 */
	public function registerWidthSizeVariables( array $items ) {

		return array_merge(
			[
				[
					'name'      => __('Normal Container Max Width', 'blockera'),
					'id'        => 'normal-container-max-width',
					'value'     => blocksy_get_theme_mod( 'maxSiteWidth', 1290 ) . 'px',
					'type'      => 'width-size',
					'group'     => 'blocksy-width-size',
					'var'       => '--theme-normal-container-max-width',
					'label'     => __( 'Normal Container Max Width', 'blockera' ),
					'reference' => [
						'type' => 'theme',
						'theme' => 'blocksy',
					],
				],
				[
					'name'      => __('Narrow Container Max Width', 'blockera'),
					'id'        => 'narrow-container-max-width',
					'value'     => blocksy_get_theme_mod( 'narrowContainerWidth', 750 ) . 'px',
					'type'      => 'width-size',
					'group'     => 'blocksy-width-size',
					'var'       => '--theme-narrow-container-max-width',
					'label'     => __( 'Narrow Container Max Width', 'blockera' ),
					'reference' => [
						'type' => 'theme',
						'theme' => 'blocksy',
					],
				],

			],
			$items,
		);
	}


	/**
	 * Register color variables.
	 */
	public function registerColorVariables( array $items ) {

		// Set base color.
		$baseColor = blocksy_get_theme_mod('fontColor');
		if ( isset($baseColor['default']['color']) ) {
			$baseColor = $baseColor['default']['color'];
		} else {
			$baseColor = 'var(--theme-palette-color-3)';
		}

		// Set link color.
		$linkColor = blocksy_get_theme_mod('linkColor');
		if ( isset($linkColor['default']['color']) ) {
			$linkColor = $linkColor['default']['color'];
		} else {
			$linkColor = 'var(--theme-palette-color-1)';
		}

		// Set link hover color.
		$linkHoverColor = blocksy_get_theme_mod('linkColor');
		if ( isset($linkHoverColor['hover']['color']) ) {
			$linkHoverColor = $linkHoverColor['hover']['color'];
		} else {
			$linkHoverColor = 'var(--theme-palette-color-2)';
		}

		// Set border color.
		$borderColor = blocksy_get_theme_mod('borderColor');
		if ( isset($borderColor['default']['color']) ) {
			$borderColor = $borderColor['default']['color'];
		} else {
			$borderColor = 'var(--theme-palette-color-5)';
		}

		// Set headings color.
		$headingsColor = blocksy_get_theme_mod('headingsColor');
		if ( isset($headingsColor['default']['color']) ) {
			$headingsColor = $headingsColor['default']['color'];
		} else {
			$headingsColor = 'var(--theme-palette-color-4)';
		}

		// Set heading 1 color.
		$heading1Color = blocksy_get_theme_mod('heading1Color');
		if ( isset($heading1Color['default']['color']) ) {
			$heading1Color = $heading1Color['default']['color'];
		} else {
			$heading1Color = 'var(--theme-palette-color-4)';
		}

		// Set heading 2 color.
		$heading2Color = blocksy_get_theme_mod('heading2Color');
		if ( isset($heading2Color['default']['color']) ) {
			$heading2Color = $heading2Color['default']['color'];
		} else {
			$heading2Color = 'var(--theme-palette-color-4)';
		}

		// Set heading 3 color.
		$heading3Color = blocksy_get_theme_mod('heading3Color');
		if ( isset($heading3Color['default']['color']) ) {
			$heading3Color = $heading3Color['default']['color'];
		} else {
			$heading3Color = 'var(--theme-palette-color-4)';
		}

		// Set heading 4 color.
		$heading4Color = blocksy_get_theme_mod('heading4Color');
		if ( isset($heading4Color['default']['color']) ) {
			$heading4Color = $heading4Color['default']['color'];
		} else {
			$heading4Color = 'var(--theme-palette-color-4)';
		}

		// Set heading 5 color.
		$heading5Color = blocksy_get_theme_mod('heading5Color');
		if ( isset($heading5Color['default']['color']) ) {
			$heading5Color = $heading5Color['default']['color'];
		} else {
			$heading5Color = 'var(--theme-palette-color-4)';
		}

		// Set heading 6 color.
		$heading6Color = blocksy_get_theme_mod('heading6Color');
		if ( isset($heading6Color['default']['color']) ) {
			$heading6Color = $heading6Color['default']['color'];
		} else {
			$heading6Color = 'var(--theme-palette-color-4)';
		}

		return array_merge(
			[
				[
					'name'      => __('Base', 'blockera'),
					'id'        => 'base-color',
					'value'     => $baseColor,
					'type'      => 'color',
					'group'     => 'blocksy-colors',
					'var'       => '--theme-text-color',
					'label'     => __( 'Base', 'blockera' ),
					'reference' => [
						'type' => 'theme',
						'theme' => 'blocksy',
					],
				],
				[
					'name'      => __('Link', 'blockera'),
					'id'        => 'link-initial-color',
					'value'     => $linkColor,
					'type'      => 'color',
					'group'     => 'blocksy-colors',
					'var'       => '--theme-link-initial-color',
					'label'     => __( 'Link', 'blockera' ),
					'reference' => [
						'type' => 'theme',
						'theme' => 'blocksy',
					],
				],
				[
					'name'      => __('Link Hover', 'blockera'),
					'id'        => 'link-hover-color',
					'value'     => $linkHoverColor,
					'type'      => 'color',
					'group'     => 'blocksy-colors',
					'var'       => '--theme-link-hover-color',
					'label'     => __( 'Link Hover', 'blockera' ),
					'reference' => [
						'type' => 'theme',
						'theme' => 'blocksy',
					],
				],
				[
					'name'      => __('Border', 'blockera'),
					'id'        => 'border-color',
					'value'     => $borderColor,
					'type'      => 'color',
					'group'     => 'blocksy-colors',
					'var'       => '--theme-border-color',
					'label'     => __( 'Border', 'blockera' ),
					'reference' => [
						'type' => 'theme',
						'theme' => 'blocksy',
					],
				],
				[
					'name'      => __('Headings', 'blockera'),
					'id'        => 'headings-color',
					'value'     => $headingsColor,
					'type'      => 'color',
					'group'     => 'blocksy-colors',
					'var'       => '--theme-headings-color',
					'label'     => __( 'Headings', 'blockera' ),
					'reference' => [
						'type' => 'theme',
						'theme' => 'blocksy',
					],
				],
				[
					'name'      => __('Heading 1', 'blockera'),
					'id'        => 'heading-1-color',
					'value'     => $heading1Color,
					'type'      => 'color',
					'group'     => 'blocksy-colors',
					'var'       => '--theme-heading-1-color',
					'label'     => __( 'Heading 1', 'blockera' ),
				],
				[
					'name'      => __('Heading 2', 'blockera'),
					'id'        => 'heading-2-color',
					'value'     => $heading2Color,
					'type'      => 'color',
					'group'     => 'blocksy-colors',
					'var'       => '--theme-heading-2-color',
					'label'     => __( 'Heading 2', 'blockera' ),
				],
				[
					'name'      => __('Heading 3', 'blockera'),
					'id'        => 'heading-3-color',
					'value'     => $heading3Color,
					'type'      => 'color',
					'group'     => 'blocksy-colors',
					'var'       => '--theme-heading-3-color',
					'label'     => __( 'Heading 3', 'blockera' ),
				],
				[
					'name'      => __('Heading 4', 'blockera'),
					'id'        => 'heading-4-color',
					'value'     => $heading4Color,
					'type'      => 'color',
					'group'     => 'blocksy-colors',
					'var'       => '--theme-heading-4-color',
					'label'     => __( 'Heading 4', 'blockera' ),
				],
				[
					'name'      => __('Heading 5', 'blockera'),
					'id'        => 'heading-5-color',
					'value'     => $heading5Color,
					'type'      => 'color',
					'group'     => 'blocksy-colors',
					'var'       => '--theme-heading-5-color',
					'label'     => __( 'Heading 5', 'blockera' ),
				],
				[
					'name'      => __('Heading 6', 'blockera'),
					'id'        => 'heading-6-color',
					'value'     => $heading6Color,
					'type'      => 'color',
					'group'     => 'blocksy-colors',
					'var'       => '--theme-heading-6-color',
					'label'     => __( 'Heading 6', 'blockera' ),
				],
			],
			$items,
		);
	}
}
