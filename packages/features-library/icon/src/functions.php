<?php

if ( ! function_exists('blockera_get_blockera_icon_attr_value')) {
	/**
	 * Normalize blockeraIcon attribute value from block attrs.
	 *
	 * @param array $block The block.
	 *
	 * @return array
	 */
	function blockera_get_blockera_icon_attr_value( array $block): array {
		$blockera_icon = $block['attrs']['blockeraIcon'] ?? null;

		if (! is_array($blockera_icon)) {
			return [];
		}

		if (isset($blockera_icon['value']) && is_array($blockera_icon['value'])) {
			return $blockera_icon['value'];
		}

		return $blockera_icon;
	}
}

if ( ! function_exists('blockera_is_stroke_icon_library')) {
	/**
	 * Stroke-based npm icon libraries (Feather, Lucide, Untitled UI).
	 *
	 * @param string $library Icon library id.
	 *
	 * @return bool
	 */
	function blockera_is_stroke_icon_library( string $library): bool {
		return in_array($library, [ 'feather', 'lucide', 'untitledui' ], true);
	}
}

if ( ! function_exists('blockera_normalize_stroke_icon_svg')) {
	/**
	 * Normalize stroke icon SVG for frontend output (fixes legacy saved fill).
	 *
	 * @param string $icon_html SVG markup.
	 * @param string $library   Icon library id.
	 *
	 * @return string
	 */
	function blockera_normalize_stroke_icon_svg( string $icon_html, string $library = ''): string {
		if ('' === $icon_html) {
			return '';
		}

		if (! blockera_is_stroke_icon_library($library) && ! blockera_is_stroke_svg_markup($icon_html)) {
			return $icon_html;
		}

		if (preg_match('/<svg[\s\S]*<\/svg>/i', $icon_html, $matches)) {
			$icon_html = $matches[0];
		}

		$icon_html = preg_replace_callback(
			'/(<svg[^>]*\sstyle=["\'])([^"\']*)(["\'])/i',
			static function ( array $matches): string {
				$style = preg_replace('/\bfill\s*:\s*[^;]+;?/i', '', $matches[2]);

				return $matches[1] . trim($style, '; ') . $matches[3];
			},
			$icon_html
		);

		if (preg_match('/<svg[^>]*\sfill=/i', $icon_html)) {
			$icon_html = preg_replace(
				'/(<svg[^>]*)\sfill=["\'][^"\']*["\']/i',
				'$1 fill="none"',
				$icon_html
			);
		} else {
			$icon_html = preg_replace('/<svg/i', '<svg fill="none"', $icon_html, 1);
		}

		if (! preg_match('/<svg[^>]*\sstroke=/i', $icon_html)) {
			$icon_html = preg_replace('/<svg/i', '<svg stroke="currentColor"', $icon_html, 1);
		}

		$shape_tags = [ 'path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon' ];

		foreach ($shape_tags as $tag) {
			$icon_html = preg_replace_callback(
				'/<(' . $tag . ')\b([^>]*?)(\/?)>/i',
				static function ( array $matches): string {
					$attrs = $matches[2];

					if (preg_match('/\sfill=/i', $attrs)) {
						$attrs = preg_replace('/\sfill=["\'][^"\']*["\']/i', ' fill="none"', $attrs);
					} else {
						$attrs .= ' fill="none"';
					}

					if (! preg_match('/\sstroke=/i', $attrs)) {
						$attrs .= ' stroke="currentColor"';
					}

					$attrs = preg_replace_callback(
						'/\sstyle=["\']([^"\']*)["\']/i',
						static function ( array $style_matches): string {
							$style = preg_replace('/\bfill\s*:\s*[^;]+;?/i', '', $style_matches[1]);

							return ' style="' . trim($style, '; ') . '"';
						},
						$attrs
					);

					return '<' . $matches[1] . $attrs . $matches[3] . '>';
				},
				$icon_html
			);
		}

		return $icon_html;
	}
}

if ( ! function_exists('blockera_is_stroke_svg_markup')) {
	/**
	 * Detect stroke SVG markup (fill="none" + stroke).
	 *
	 * @param string $svg SVG markup.
	 *
	 * @return bool
	 */
	function blockera_is_stroke_svg_markup( string $svg): bool {
		return '' !== $svg
			&& false !== stripos($svg, 'fill="none"')
			&& false !== stripos($svg, 'stroke');
	}
}

if ( ! function_exists('blockera_core_icon_has_renderable_blockera_icon')) {
	/**
	 * Whether core/icon should render Blockera icon output on the frontend.
	 *
	 * @param array $block The block.
	 *
	 * @return bool
	 */
	function blockera_core_icon_has_renderable_blockera_icon( array $block): bool {
		if ('core/icon' !== ( $block['blockName'] ?? '' )) {
			return false;
		}

		$value = blockera_get_blockera_icon_attr_value($block);

		if (! empty($value['renderedIcon']) || ! empty($value['uploadSVG'])) {
			return true;
		}

		return ! empty($value['icon']) && ! empty($value['library']);
	}
}

if ( ! function_exists('blockera_get_block_attr_value')) {
	/**
	 * Read a scalar block attribute (plain or Blockera { value } shape).
	 *
	 * @param array  $block The block.
	 * @param string $key   Attribute name.
	 *
	 * @return string
	 */
	function blockera_get_block_attr_value( array $block, string $key): string {
		$attr = $block['attrs'][ $key ] ?? '';

		if (is_array($attr) && array_key_exists('value', $attr)) {
			return (string) $attr['value'];
		}

		return is_string($attr) ? $attr : '';
	}
}

if ( ! function_exists('blockera_build_icon_transform')) {
	/**
	 * CSS transform for icon rotate + flip (mirrors JS getIconTransform).
	 *
	 * @param array $block The block.
	 *
	 * @return string
	 */
	function blockera_build_icon_transform( array $block): string {
		$transform = '';
		$rotate    = blockera_get_block_attr_value($block, 'blockeraIconRotate');

		if ('' !== $rotate) {
			$transform = 'rotate(' . $rotate . 'deg)';
		}

		if ('' !== blockera_get_block_attr_value($block, 'blockeraIconFlipHorizontal')) {
			$transform = trim($transform . ' scaleX(-1)');
		}

		if ('' !== blockera_get_block_attr_value($block, 'blockeraIconFlipVertical')) {
			$transform = trim($transform . ' scaleY(-1)');
		}

		return $transform;
	}
}

if ( ! function_exists('blockera_decode_rendered_icon')) {
	/**
	 * Decode blockeraIcon.renderedIcon (editor uses btoa(unescape(encodeURIComponent(svg)))).
	 *
	 * @param string $encoded Base64-encoded SVG markup.
	 *
	 * @return string Decoded SVG markup, or empty string on failure.
	 */
	function blockera_decode_rendered_icon( string $encoded): string {
		return \Blockera\Feature\Icon\RenderedIconCodec::decode($encoded);
	}
}

if ( ! function_exists('blockera_core_icon_get_wrapper_class_names')) {
	/**
	 * Class names for the core/icon wrapper div (matches get_block_wrapper_attributes align support).
	 *
	 * @param array $block The block.
	 *
	 * @return array
	 */
	function blockera_core_icon_get_wrapper_class_names( array $block): array {
		$class_names = [ 'wp-block-icon' ];

		if (blockera_core_icon_has_renderable_blockera_icon($block)) {
			$class_names[] = 'wp-block-icon-blockera';
		}

		if (! empty($block['attrs']['className'])) {
			$parts = preg_split('/\s+/', $block['attrs']['className'], -1, PREG_SPLIT_NO_EMPTY);

			foreach ($parts as $part) {
				// Inline icon layout classes must not apply to standalone core/icon.
				if (preg_match('/^blockera-has-icon-(start|end)$/', $part)) {
					continue;
				}

				$class_names[] = $part;
			}
		}

		$align = $block['attrs']['align'] ?? '';

		if (is_string($align) && in_array($align, [ 'left', 'center', 'right', 'wide', 'full' ], true)) {
			$class_names[] = 'align' . $align;
		}

		return array_values(array_unique($class_names));
	}
}

if ( ! function_exists('blockera_core_icon_apply_wrapper_classes')) {
	/**
	 * Ensure .wp-block-icon wrapper includes align + className from block attrs.
	 *
	 * @param string $html  Block HTML.
	 * @param array  $block The block.
	 *
	 * @return string
	 */
	function blockera_core_icon_apply_wrapper_classes( string $html, array $block): string {
		if (! str_contains($html, 'wp-block-icon')) {
			return $html;
		}

		$needed_classes = blockera_core_icon_get_wrapper_class_names($block);

		$updated = preg_replace_callback(
			'/<div\b([^>]*\bwp-block-icon\b[^>]*)>/i',
			static function ( array $matches ) use ( $needed_classes ): string {
				$attrs = $matches[1];

				if (preg_match('/\bclass="([^"]*)"/i', $attrs, $class_match)) {
					$existing  = preg_split('/\s+/', trim($class_match[1]), -1, PREG_SPLIT_NO_EMPTY);
					$merged    = array_unique(array_merge($existing, $needed_classes));
					$new_class = esc_attr(implode(' ', $merged));

					$attrs = preg_replace(
						'/\bclass="[^"]*"/i',
						'class="' . $new_class . '"',
						$attrs,
						1
					);
				} else {
					$attrs .= ' class="' . esc_attr(implode(' ', $needed_classes)) . '"';
				}

				return '<div' . $attrs . '>';
			},
			$html,
			1
		);

		return is_string($updated) ? $updated : $html;
	}
}

if ( ! function_exists('blockera_core_icon_seed_html')) {
	/**
	 * Minimal wrapper HTML for Blockera to inject SVG when core/icon renders nothing.
	 *
	 * @param array $block The block.
	 *
	 * @return string
	 */
	function blockera_core_icon_seed_html( array $block): string {
		return sprintf(
			'<div class="%s"></div>',
			esc_attr(implode(' ', blockera_core_icon_get_wrapper_class_names($block)))
		);
	}
}

if ( ! function_exists('blockera_get_icon_size_attr_name')) {
	/**
	 * Attribute id used for icon size (iconConfig.blockeraIconSize.config.attribute).
	 *
	 * @param array $block The block.
	 *
	 * @return string
	 */
	function blockera_get_icon_size_attr_name( array $block): string {
		static $cache = [];

		$block_name = $block['blockName'] ?? '';

		if (isset($cache[ $block_name ])) {
			return $cache[ $block_name ];
		}

		$registry   = \WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered($block_name);
		$attribute  = $block_type->supports['blockExtensions']['iconConfig']['blockeraIconSize']['config']['attribute'] ?? 'blockeraIconSize';

		$cache[ $block_name ] = $attribute;

		return $attribute;
	}
}

if ( ! function_exists('blockera_get_icon_size_attr_value')) {
	/**
	 * Resolved icon size value from the configured block attribute.
	 *
	 * @param array $block The block.
	 *
	 * @return string
	 */
	function blockera_get_icon_size_attr_value( array $block): string {
		$attr_name = blockera_get_icon_size_attr_name($block);
		$value     = $block['attrs'][ $attr_name ]['value'] ?? '';

		if ('' !== $value || 'blockeraIconSize' === $attr_name) {
			return $value;
		}

		// Legacy data saved on blockeraIconSize before attribute alias.
		return $block['attrs']['blockeraIconSize']['value'] ?? '';
	}
}

if ( ! function_exists('blockera_get_icon_color_attr_name')) {
	/**
	 * Attribute id used for icon color (iconConfig.blockeraIconColor.config.attribute).
	 *
	 * @param array $block The block.
	 *
	 * @return string
	 */
	function blockera_get_icon_color_attr_name( array $block): string {
		static $cache = [];

		$block_name = $block['blockName'] ?? '';

		if (isset($cache[ $block_name ])) {
			return $cache[ $block_name ];
		}

		$registry   = \WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered($block_name);
		$attribute  = $block_type->supports['blockExtensions']['iconConfig']['blockeraIconColor']['config']['attribute'] ?? 'blockeraIconColor';

		$cache[ $block_name ] = $attribute;

		return $attribute;
	}
}

if ( ! function_exists('blockera_get_icon_color_attr_value')) {
	/**
	 * Resolved icon color value from the configured block attribute.
	 *
	 * @param array $block The block.
	 *
	 * @return string
	 */
	function blockera_get_icon_color_attr_value( array $block): string {
		$attr_name = blockera_get_icon_color_attr_name($block);
		$value     = blockera_get_block_attr_value($block, $attr_name);

		if ('' !== $value || 'blockeraIconColor' === $attr_name) {
			return $value;
		}

		// Legacy data saved on blockeraIconColor before attribute alias.
		return blockera_get_block_attr_value($block, 'blockeraIconColor');
	}
}

if ( ! function_exists('blockera_block_has_icon')) {
	/**
	 * Check if the block has an icon.
	 * 
	 * @param array $block The block.
	 * 
	 * @return bool true if the block has an icon, false otherwise.
	 */
	function blockera_block_has_icon( array $block): bool {
		$has_class = str_contains($block['attrs']['className'] ?? '', 'blockera-has-icon');
		$has_icon  = ! empty(blockera_get_blockera_icon_attr_value($block));

		// Try to check if the block has an icon in the inner blocks.
		if (! $has_class && ! $has_icon) {
			foreach ($block['innerBlocks'] as $innerBlock) {
				if (blockera_block_has_icon($innerBlock)) {
					return true;
				}
			}
		}

		return $has_class && $has_icon;
	}
}

if ( ! function_exists('blockera_core_icon_is_navigation_child_render')) {
	/**
	 * Whether the current core/icon render is a direct child of core/navigation.
	 *
	 * Set via render_block_data; cleared after core/icon render.
	 *
	 * @return bool
	 */
	function blockera_core_icon_is_navigation_child_render(): bool {
		return ! empty($GLOBALS['blockera_core_icon_in_navigation_render']);
	}
}

if ( ! function_exists('blockera_core_icon_set_navigation_child_render')) {
	/**
	 * @param bool $in_navigation In navigation context.
	 */
	function blockera_core_icon_set_navigation_child_render( bool $in_navigation): void {
		$GLOBALS['blockera_core_icon_in_navigation_render'] = $in_navigation;
	}
}

if ( ! function_exists('blockera_core_icon_get_link_attrs')) {
	/**
	 * Normalized href / linkTarget / rel from block attrs.
	 *
	 * @param array $block The block.
	 *
	 * @return array{href: string, linkTarget: string, rel: string}
	 */
	function blockera_core_icon_get_link_attrs( array $block): array {
		$attrs = $block['attrs'] ?? [];

		return [
			'href'       => isset($attrs['href']) ? (string) $attrs['href'] : '',
			'linkTarget' => isset($attrs['linkTarget']) ? (string) $attrs['linkTarget'] : '',
			'rel'        => isset($attrs['rel']) ? (string) $attrs['rel'] : '',
		];
	}
}

if ( ! function_exists('blockera_core_icon_wrap_with_link')) {
	/**
	 * Wrap icon markup in an anchor when href is set (frontend + navigation styles).
	 *
	 * @param string $iconHTML SVG or icon HTML.
	 * @param array  $block    The block.
	 *
	 * @return string
	 */
	function blockera_core_icon_wrap_with_link( string $iconHTML, array $block): string {
		[
			'href'       => $href,
			'linkTarget' => $link_target,
			'rel'        => $rel,
		] = blockera_core_icon_get_link_attrs($block);

		if ('' === $href) {
			return $iconHTML;
		}

		$classes = [];

		if (blockera_core_icon_is_navigation_child_render()) {
			$classes[] = 'wp-block-navigation-item__content';
		}

		$class_attr = $classes ? sprintf(' class="%s"', esc_attr(implode(' ', $classes))) : '';

		return sprintf(
			'<a href="%1$s"%2$s%3$s%4$s>%5$s</a>',
			esc_url($href),
			$class_attr,
			$rel ? sprintf(' rel="%s"', esc_attr($rel)) : '',
			$link_target ? sprintf(' target="%s"', esc_attr($link_target)) : '',
			$iconHTML
		);
	}
}

if ( ! function_exists('blockera_core_icon_register_navigation_hooks')) {
	/**
	 * Navigation: list-item wrapper + render context for link class names.
	 */
	function blockera_core_icon_register_navigation_hooks(): void {
		add_filter(
			'block_core_navigation_listable_blocks',
			static function ( array $blocks): array {
				if (! in_array('core/icon', $blocks, true)) {
					$blocks[] = 'core/icon';
				}

				return $blocks;
			}
		);

		add_filter(
			'render_block_data',
			static function ( $parsed_block, $source_block, $parent_block ) {
				if ('core/icon' !== ( $parsed_block['blockName'] ?? '' )) {
					return $parsed_block;
				}

				$in_navigation = $parent_block && 'core/navigation' === ( $parent_block->name ?? '' );
				blockera_core_icon_set_navigation_child_render($in_navigation);

				return $parsed_block;
			},
			10,
			3
		);

		add_filter(
			'render_block_core/icon',
			static function ( $html ) {
				blockera_core_icon_set_navigation_child_render(false);

				return $html;
			},
			999,
			1
		);
	}
}
