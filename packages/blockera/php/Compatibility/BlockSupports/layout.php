<?php

if (! function_exists('blockera_render_layout_support_flag')) {
	/**
	 * Renders the layout config to the block wrapper.
	 *
	 * @since 5.8.0
	 * @since 6.3.0 Adds compound class to layout wrapper for global spacing styles.
	 * @since 6.3.0 Check for layout support via the `layout` key with fallback to `__experimentalLayout`.
	 * @since 6.6.0 Removed duplicate container class from layout styles.
	 * @access private
	 *
	 * @param string $block_content Rendered block content.
	 * @param array  $block         Block object.
	 * @return string Filtered block content.
	 */
	function blockera_render_layout_support_flag( $block_content, $block ) {
		$block_type            = WP_Block_Type_Registry::get_instance()->get_registered( $block['blockName'] );
		$block_supports_layout = block_has_support( $block_type, 'layout', false ) || block_has_support( $block_type, '__experimentalLayout', false );
		$child_layout          = isset( $block['attrs']['style']['layout'] ) ? $block['attrs']['style']['layout'] : null;

		if ( ! $block_supports_layout && ! $child_layout ) {
			return $block_content;
		}

		$outer_class_names = array();

		// Child layout specific logic.
		if ( $child_layout ) {
			/*
			* Generates a unique class for child block layout styles.
			*
			* To ensure consistent class generation across different page renders,
			* only properties that affect layout styling are used. These properties
			* come from `$block['attrs']['style']['layout']` and `$block['parentLayout']`.
			*
			* As long as these properties coincide, the generated class will be the same.
			*/
			$container_content_class = wp_unique_id_from_values(
				array(
					'layout'       => array_intersect_key(
						$block['attrs']['style']['layout'] ?? array(),
						array_flip(
							array( 'selfStretch', 'flexSize', 'columnStart', 'columnSpan', 'rowStart', 'rowSpan' )
						)
					),
					'parentLayout' => array_intersect_key(
						$block['parentLayout'] ?? array(),
						array_flip(
							array( 'minimumColumnWidth', 'columnCount' )
						)
					),
				),
				'wp-container-content-'
			);

			$child_layout_declarations = array();
			$child_layout_styles       = array();

			$self_stretch = isset( $child_layout['selfStretch'] ) ? $child_layout['selfStretch'] : null;

			if ( 'fixed' === $self_stretch && isset( $child_layout['flexSize'] ) ) {
				$child_layout_declarations['flex-basis'] = $child_layout['flexSize'];
				$child_layout_declarations['box-sizing'] = 'border-box';
			} elseif ( 'fill' === $self_stretch ) {
				$child_layout_declarations['flex-grow'] = '1';
			}

			if ( isset( $child_layout['columnSpan'] ) ) {
				$column_span                              = $child_layout['columnSpan'];
				$child_layout_declarations['grid-column'] = "span $column_span";
			}
			if ( isset( $child_layout['rowSpan'] ) ) {
				$row_span                              = $child_layout['rowSpan'];
				$child_layout_declarations['grid-row'] = "span $row_span";
			}
			$child_layout_styles[] = array(
				'selector'     => ".$container_content_class",
				'declarations' => $child_layout_declarations,
			);

			/*
			* If columnSpan is set, and the parent grid is responsive, i.e. if it has a minimumColumnWidth set,
			* the columnSpan should be removed on small grids. If there's a minimumColumnWidth, the grid is responsive.
			* But if the minimumColumnWidth value wasn't changed, it won't be set. In that case, if columnCount doesn't
			* exist, we can assume that the grid is responsive.
			*/
			if ( isset( $child_layout['columnSpan'] ) && ( isset( $block['parentLayout']['minimumColumnWidth'] ) || ! isset( $block['parentLayout']['columnCount'] ) ) ) {
				$column_span_number  = floatval( $child_layout['columnSpan'] );
				$parent_column_width = isset( $block['parentLayout']['minimumColumnWidth'] ) ? $block['parentLayout']['minimumColumnWidth'] : '12rem';
				$parent_column_value = floatval( $parent_column_width );
				$parent_column_unit  = explode( $parent_column_value, $parent_column_width );

				/*
				* If there is no unit, the width has somehow been mangled so we reset both unit and value
				* to defaults.
				* Additionally, the unit should be one of px, rem or em, so that also needs to be checked.
				*/
				if ( count( $parent_column_unit ) <= 1 ) {
					$parent_column_unit  = 'rem';
					$parent_column_value = 12;
				} else {
					$parent_column_unit = $parent_column_unit[1];

					if ( ! in_array( $parent_column_unit, array( 'px', 'rem', 'em' ), true ) ) {
						$parent_column_unit = 'rem';
					}
				}

				/*
				* A default gap value is used for this computation because custom gap values may not be
				* viable to use in the computation of the container query value.
				*/
				$default_gap_value     = 'px' === $parent_column_unit ? 24 : 1.5;
				$container_query_value = $column_span_number * $parent_column_value + ( $column_span_number - 1 ) * $default_gap_value;
				$container_query_value = $container_query_value . $parent_column_unit;

				$child_layout_styles[] = array(
					'rules_group'  => "@container (max-width: $container_query_value )",
					'selector'     => ".$container_content_class",
					'declarations' => array(
						'grid-column' => '1/-1',
					),
				);
			}

			/*
			* Add to the style engine store to enqueue and render layout styles.
			* Return styles here just to check if any exist.
			*/
			$child_css = wp_style_engine_get_stylesheet_from_css_rules(
				$child_layout_styles,
				array(
					'context'  => 'block-supports',
					'prettify' => false,
				)
			);

			if ( $child_css ) {
				$outer_class_names[] = $container_content_class;
			}
		}

		// Prep the processor for modifying the block output.
		$processor = new WP_HTML_Tag_Processor( $block_content );

		// Having no tags implies there are no tags onto which to add class names.
		if ( ! $processor->next_tag() ) {
			return $block_content;
		}

		/*
		* A block may not support layout but still be affected by a parent block's layout.
		*
		* In these cases add the appropriate class names and then return early; there's
		* no need to investigate on this block whether additional layout constraints apply.
		*/
		if ( ! $block_supports_layout && ! empty( $outer_class_names ) ) {
			foreach ( $outer_class_names as $class_name ) {
				$processor->add_class( $class_name );
			}
			return $processor->get_updated_html();
		} elseif ( ! $block_supports_layout ) {
			// Ensure layout classnames are not injected if there is no layout support.
			return $block_content;
		}

		$global_settings = blockera_get_global_settings();
		$fallback_layout = isset( $block_type->supports['layout']['default'] )
			? $block_type->supports['layout']['default']
			: array();
		if ( empty( $fallback_layout ) ) {
			$fallback_layout = isset( $block_type->supports['__experimentalLayout']['default'] )
				? $block_type->supports['__experimentalLayout']['default']
				: array();
		}
		$used_layout = isset( $block['attrs']['layout'] ) ? $block['attrs']['layout'] : $fallback_layout;

		$class_names        = array();
		$layout_definitions = wp_get_layout_definitions();

		// Set the correct layout type for blocks using legacy content width.
		if ( isset( $used_layout['inherit'] ) && $used_layout['inherit'] || isset( $used_layout['contentSize'] ) && $used_layout['contentSize'] ) {
			$used_layout['type'] = 'constrained';
		}

		$root_padding_aware_alignments = isset( $global_settings['useRootPaddingAwareAlignments'] )
			? $global_settings['useRootPaddingAwareAlignments']
			: false;

		if (
			$root_padding_aware_alignments &&
			isset( $used_layout['type'] ) &&
			'constrained' === $used_layout['type']
		) {
			$class_names[] = 'has-global-padding';
		}

		/*
		* The following section was added to reintroduce a small set of layout classnames that were
		* removed in the 5.9 release (https://github.com/WordPress/gutenberg/issues/38719). It is
		* not intended to provide an extended set of classes to match all block layout attributes
		* here.
		*/
		if ( ! empty( $block['attrs']['layout']['orientation'] ) ) {
			$class_names[] = 'is-' . sanitize_title( $block['attrs']['layout']['orientation'] );
		}

		if ( ! empty( $block['attrs']['layout']['justifyContent'] ) ) {
			$class_names[] = 'is-content-justification-' . sanitize_title( $block['attrs']['layout']['justifyContent'] );
		}

		if ( ! empty( $block['attrs']['layout']['flexWrap'] ) && 'nowrap' === $block['attrs']['layout']['flexWrap'] ) {
			$class_names[] = 'is-nowrap';
		}

		// Get classname for layout type.
		if ( isset( $used_layout['type'] ) ) {
			$layout_classname = isset( $layout_definitions[ $used_layout['type'] ]['className'] )
				? $layout_definitions[ $used_layout['type'] ]['className']
				: '';
		} else {
			$layout_classname = isset( $layout_definitions['default']['className'] )
				? $layout_definitions['default']['className']
				: '';
		}

		if ( $layout_classname && is_string( $layout_classname ) ) {
			$class_names[] = sanitize_title( $layout_classname );
		}

		/*
		* Only generate Layout styles if the theme has not opted-out.
		* Attribute-based Layout classnames are output in all cases.
		*/
		if ( ! current_theme_supports( 'disable-layout-styles' ) ) {

			$gap_value = isset( $block['attrs']['style']['spacing']['blockGap'] )
				? $block['attrs']['style']['spacing']['blockGap']
				: null;

			/*
			* Skip if gap value contains unsupported characters.
			* Regex for CSS value borrowed from `safecss_filter_attr`, and used here
			* to only match against the value, not the CSS attribute.
			*/
			if ( is_array( $gap_value ) ) {
				foreach ( $gap_value as $key => $value ) {
					$gap_value[ $key ] = $value && preg_match( '%[\\\(&=}]|/\*%', $value ) ? null : $value;
				}
			} else {
				$gap_value = $gap_value && preg_match( '%[\\\(&=}]|/\*%', $gap_value ) ? null : $gap_value;
			}

			$fallback_gap_value = isset( $block_type->supports['spacing']['blockGap']['__experimentalDefault'] )
				? $block_type->supports['spacing']['blockGap']['__experimentalDefault']
				: '0.5em';
			$block_spacing      = isset( $block['attrs']['style']['spacing'] )
				? $block['attrs']['style']['spacing']
				: null;

			/*
			* If a block's block.json skips serialization for spacing or spacing.blockGap,
			* don't apply the user-defined value to the styles.
			*/
			$should_skip_gap_serialization = wp_should_skip_block_supports_serialization( $block_type, 'spacing', 'blockGap' );

			$block_gap             = isset( $global_settings['spacing']['blockGap'] )
				? $global_settings['spacing']['blockGap']
				: null;
			$has_block_gap_support = isset( $block_gap );

			/*
			* Generates a unique ID based on all the data required to obtain the
			* corresponding layout style. Keeps the CSS class names the same
			* even for different blocks on different places, as long as they have
			* the same layout definition. Makes the CSS class names stable across
			* paginations for features like the enhanced pagination of the Query block.
			*/
			$container_class = wp_unique_id_from_values(
				array(
					$used_layout,
					$has_block_gap_support,
					$gap_value,
					$should_skip_gap_serialization,
					$fallback_gap_value,
					$block_spacing,
				),
				'wp-container-' . sanitize_title( $block['blockName'] ) . '-is-layout-'
			);

			$style = wp_get_layout_style(
				".$container_class",
				$used_layout,
				$has_block_gap_support,
				$gap_value,
				$should_skip_gap_serialization,
				$fallback_gap_value,
				$block_spacing
			);

			// Only add container class and enqueue block support styles if unique styles were generated.
			if ( ! empty( $style ) ) {
				$class_names[] = $container_class;
			}
		}

		// Add combined layout and block classname for global styles to hook onto.
		$split_block_name = explode( '/', $block['blockName'] );
		$full_block_name  = 'core' === $split_block_name[0] ? end( $split_block_name ) : implode( '-', $split_block_name );
		$class_names[]    = 'wp-block-' . $full_block_name . '-' . $layout_classname;

		// Add classes to the outermost HTML tag if necessary.
		if ( ! empty( $outer_class_names ) ) {
			foreach ( $outer_class_names as $outer_class_name ) {
				$processor->add_class( $outer_class_name );
			}
		}

		/**
		 * Attempts to refer to the inner-block wrapping element by its class attribute.
		 *
		 * When examining a block's inner content, if a block has inner blocks, then
		 * the first content item will likely be a text (HTML) chunk immediately
		 * preceding the inner blocks. The last HTML tag in that chunk would then be
		 * an opening tag for an element that wraps the inner blocks.
		 *
		 * There's no reliable way to associate this wrapper in $block_content because
		 * it may have changed during the rendering pipeline (as inner contents is
		 * provided before rendering) and through previous filters. In many cases,
		 * however, the `class` attribute will be a good-enough identifier, so this
		 * code finds the last tag in that chunk and stores the `class` attribute
		 * so that it can be used later when working through the rendered block output
		 * to identify the wrapping element and add the remaining class names to it.
		 *
		 * It's also possible that no inner block wrapper even exists. If that's the
		 * case this code could apply the class names to an invalid element.
		 *
		 * Example:
		 *
		 *     $block['innerBlocks']  = array( $list_item );
		 *     $block['innerContent'] = array( '<ul class="list-wrapper is-unordered">', null, '</ul>' );
		 *
		 *     // After rendering, the initial contents may have been modified by other renderers or filters.
		 *     $block_content = <<<HTML
		 *         <figure>
		 *             <ul class="annotated-list list-wrapper is-unordered">
		 *                 <li>Code</li>
		 *             </ul><figcaption>It's a list!</figcaption>
		 *         </figure>
		 *     HTML;
		 *
		 * Although it is possible that the original block-wrapper classes are changed in $block_content
		 * from how they appear in $block['innerContent'], it's likely that the original class attributes
		 * are still present in the wrapper as they are in this example. Frequently, additional classes
		 * will also be present; rarely should classes be removed.
		 *
		 * @todo Find a better way to match the first inner block. If it's possible to identify where the
		 *       first inner block starts, then it will be possible to find the last tag before it starts
		 *       and then that tag, if an opening tag, can be solidly identified as a wrapping element.
		 *       Can some unique value or class or ID be added to the inner blocks when they process
		 *       so that they can be extracted here safely without guessing? Can the block rendering function
		 *       return information about where the rendered inner blocks start?
		 *
		 * @var string|null
		 */
		$inner_block_wrapper_classes = null;
		$first_chunk                 = isset( $block['innerContent'][0] ) ? $block['innerContent'][0] : null;
		if ( is_string( $first_chunk ) && count( $block['innerContent'] ) > 1 ) {
			$first_chunk_processor = new WP_HTML_Tag_Processor( $first_chunk );
			while ( $first_chunk_processor->next_tag() ) {
				$class_attribute = $first_chunk_processor->get_attribute( 'class' );
				if ( is_string( $class_attribute ) && ! empty( $class_attribute ) ) {
					$inner_block_wrapper_classes = $class_attribute;
				}
			}
		}

		/*
		* If necessary, advance to what is likely to be an inner block wrapper tag.
		*
		* This advances until it finds the first tag containing the original class
		* attribute from above. If none is found it will scan to the end of the block
		* and fail to add any class names.
		*
		* If there is no block wrapper it won't advance at all, in which case the
		* class names will be added to the first and outermost tag of the block.
		* For cases where this outermost tag is the only tag surrounding inner
		* blocks then the outer wrapper and inner wrapper are the same.
		*/
		do {
			if ( ! $inner_block_wrapper_classes ) {
				break;
			}

			$class_attribute = $processor->get_attribute( 'class' );
			if ( is_string( $class_attribute ) && str_contains( $class_attribute, $inner_block_wrapper_classes ) ) {
				break;
			}
		} while ( $processor->next_tag() );

		// Add the remaining class names.
		foreach ( $class_names as $class_name ) {
			$processor->add_class( $class_name );
		}

		return $processor->get_updated_html();
	}
}
