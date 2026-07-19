<?php

use Blockera\Setup\Compatibility\JSONResolver;

if ( ! function_exists( 'blockera_get_fonts_from_theme_json' ) ) {
	/**
	 * Font families from merged theme.json settings via Blockera JSONResolver.
	 *
	 * @return array<int, array<int, array<string, mixed>>>
	 */
	function blockera_get_fonts_from_theme_json(): array {
		$settings = blockera_get_global_settings();

		if ( empty( $settings['typography']['fontFamilies'] ) ) {
			return array();
		}

		return blockera_font_face_parse_settings( $settings );
	}
}

if ( ! function_exists( 'blockera_get_fonts_from_style_variations' ) ) {
	/**
	 * Font families from theme style variations via Blockera JSONResolver.
	 *
	 * @return array<int, array<int, array<string, mixed>>>
	 */
	function blockera_get_fonts_from_style_variations(): array {
		$variations = JSONResolver::get_style_variations();
		$fonts      = array();

		if ( empty( $variations ) ) {
			return array();
		}

		foreach ( $variations as $variation ) {
			if ( ! empty( $variation['settings']['typography']['fontFamilies']['theme'] ) ) {
				$fonts = array_merge( $fonts, $variation['settings']['typography']['fontFamilies']['theme'] );
			}
		}

		if ( empty( $fonts ) ) {
			return array();
		}

		$settings = array(
			'typography' => array(
				'fontFamilies' => array(
					'theme' => $fonts,
				),
			),
		);

		return blockera_font_face_parse_settings( $settings );
	}
}

if ( ! function_exists( 'blockera_font_face_parse_settings' ) ) {
	/**
	 * Parse theme.json typography settings into WP_Font_Face input.
	 *
	 * @param array $settings Settings array containing typography.fontFamilies.
	 * @return array<int, array<int, array<string, mixed>>>
	 */
	function blockera_font_face_parse_settings( array $settings ): array {
		$fonts = array();

		foreach ( $settings['typography']['fontFamilies'] as $font_families ) {
			foreach ( $font_families as $definition ) {
				if ( empty( $definition['fontFace'] ) || empty( $definition['fontFamily'] ) ) {
					continue;
				}

				$font_family_name = blockera_font_face_parse_family_name( $definition['fontFamily'] );

				if ( empty( $font_family_name ) ) {
					continue;
				}

				$fonts[] = blockera_font_face_convert_properties( $definition['fontFace'], $font_family_name );
			}
		}

		return $fonts;
	}
}

if ( ! function_exists( 'blockera_font_face_parse_family_name' ) ) {
	/**
	 * @param string $font_family Font family value from theme.json.
	 * @return string
	 */
	function blockera_font_face_parse_family_name( $font_family ): string {
		if ( str_contains( $font_family, ',' ) ) {
			$font_family = explode( ',', $font_family )[0];
		}

		return trim( $font_family, "\"'" );
	}
}

if ( ! function_exists( 'blockera_font_face_convert_properties' ) ) {
	/**
	 * @param array  $font_face_definition Font face definitions from theme.json.
	 * @param string $font_family_property Value for the CSS font-family property.
	 * @return array<int, array<string, mixed>>
	 */
	function blockera_font_face_convert_properties( array $font_face_definition, $font_family_property ): array {
		$converted_font_faces = array();

		foreach ( $font_face_definition as $font_face ) {
			$font_face['font-family'] = $font_family_property;

			if ( ! empty( $font_face['src'] ) ) {
				$font_face['src'] = blockera_font_face_to_theme_file_uri( (array) $font_face['src'] );
			}

			$converted_font_faces[] = blockera_font_face_to_kebab_case( $font_face );
		}

		return $converted_font_faces;
	}
}

if ( ! function_exists( 'blockera_font_face_to_theme_file_uri' ) ) {
	/**
	 * @param array $src Font src list from theme.json.
	 * @return array
	 */
	function blockera_font_face_to_theme_file_uri( array $src ): array {
		$placeholder = 'file:./';

		foreach ( $src as $src_key => $src_url ) {
			if ( ! str_starts_with( $src_url, $placeholder ) ) {
				continue;
			}

			$src_file        = str_replace( $placeholder, '', $src_url );
			$src[ $src_key ] = get_theme_file_uri( $src_file );
		}

		return $src;
	}
}

if ( ! function_exists( 'blockera_font_face_to_kebab_case' ) ) {
	/**
	 * @param array $data Font face properties.
	 * @return array
	 */
	function blockera_font_face_to_kebab_case( array $data ): array {
		foreach ( $data as $key => $value ) {
			$kebab_case          = _wp_to_kebab_case( $key );
			$data[ $kebab_case ] = $value;
			if ( $kebab_case !== $key ) {
				unset( $data[ $key ] );
			}
		}

		return $data;
	}
}

if ( ! function_exists( 'blockera_get_font_faces_stylesheet' ) ) {
	/**
	 * Capture @font-face CSS from Blockera merged theme.json data.
	 *
	 * @return string
	 */
	function blockera_get_font_faces_stylesheet(): string {
		static $stylesheet = null;

		if ( null !== $stylesheet ) {
			return $stylesheet;
		}

		ob_start();
		blockera_print_font_faces();
		blockera_print_font_faces_from_style_variations();
		$stylesheet = ob_get_clean();

		if ( ! is_string( $stylesheet ) ) {
			$stylesheet = '';
		}

		return $stylesheet;
	}
}

if ( ! function_exists( 'blockera_print_font_faces' ) ) {
	/**
	 * Prints @font-face rules from Blockera merged theme.json settings.
	 *
	 * @param array[][] $fonts Optional. Pre-parsed font face groups.
	 * @return void
	 */
	function blockera_print_font_faces( $fonts = array() ) {
		if ( empty( $fonts ) ) {
			$fonts = blockera_get_fonts_from_theme_json();
		}

		if ( empty( $fonts ) ) {
			return;
		}

		$wp_font_face = new WP_Font_Face();
		$wp_font_face->generate_and_print( $fonts );
	}
}

if ( ! function_exists( 'blockera_print_font_faces_from_style_variations' ) ) {
	/**
	 * Prints @font-face rules from Blockera style variation partials.
	 *
	 * @return void
	 */
	function blockera_print_font_faces_from_style_variations(): void {
		$fonts = blockera_get_fonts_from_style_variations();

		if ( empty( $fonts ) ) {
			return;
		}

		blockera_print_font_faces( $fonts );
	}
}

if ( ! function_exists( 'blockera_append_font_faces_to_resolved_iframe_assets' ) ) {
	/**
	 * Injects Blockera @font-face rules into the block editor canvas iframe bundle.
	 *
	 * {@see _wp_get_iframed_editor_assets()} still calls core {@see wp_print_font_faces()}, which
	 * resolves via {@see WP_Theme_JSON_Resolver}. Append Blockera resolver output so canvas fonts
	 * match frontend merged theme.json (including Blockera-only settings).
	 *
	 * @param array $editor_settings Block editor settings.
	 * @return array
	 */
	function blockera_append_font_faces_to_resolved_iframe_assets( $editor_settings ) {
		if ( ! isset( $editor_settings['__unstableResolvedAssets'] ) || ! is_array( $editor_settings['__unstableResolvedAssets'] ) ) {
			return $editor_settings;
		}

		$css = blockera_get_font_faces_stylesheet();
		if ( '' === $css ) {
			return $editor_settings;
		}

		$styles = $editor_settings['__unstableResolvedAssets']['styles'] ?? '';
		if ( false === $styles ) {
			$styles = '';
		}

		$editor_settings['__unstableResolvedAssets']['styles'] = $styles . '<style id="blockera-font-faces-inline-css">' . $css . '</style>';

		return $editor_settings;
	}
}
