<?php

namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue;

/**
 * Class Utility
 *
 * @since   1.0.0
 * @package Blockera\Framework\Illuminate\Foundation\Utility
 */
class Utility {

	/**
	 * Is empty value?
	 *
	 * @param array|string|bool $source the data source.
	 * @param string            $key    the key of source value.
	 *
	 * @return bool true on success, false on otherwise!
	 */
	public static function isEmpty( $source, string $key = '' ): bool {

		if ( empty( $key ) ) {

			return empty( $source );
		}

		return empty( $source[ $key ] );
	}

	/**
	 * Retrieve according to the page title ,include context.
	 *
	 * @param bool $include_context to include context value when value is true.
	 *
	 * @since 1.0.0
	 * @return string the page title
	 */
	public static function getPageTitle( bool $include_context = true ): string {

		$title = $page_type = $context = '';

		switch ( true ) {

			case is_singular():

				$page_type = 'singular';
				$title     = get_the_title();

				$title = self::getTitleWithTheContext( $title, $page_type, $include_context );

				break;

			case is_search():

				/* translators: %s: Search term. */
				$title = sprintf( __( 'Search Results for: %s', 'blockera-core' ), get_search_query() );

				if ( get_query_var( 'paged' ) ) {

					/* translators: %s is the page number. */
					$title .= sprintf( __( '&nbsp;&ndash; Page %s', 'blockera-core' ), get_query_var( 'paged' ) );
				}

				break;

			case  is_category():
			case  is_tag():

				$page_type = is_category() ? 'cat' : 'tag';
				$title     = call_user_func_array( sprintf( 'single_%s_title', $page_type ), [ '', false ] );

				$title = self::getTitleWithTheContext( $title, $page_type, $include_context );

				break;

			case is_author():

				$page_type = 'author';
				$title     = '<span class="in-card">' . get_the_author() . '</span>';
				$title     = self::getTitleWithTheContext( $title, $page_type, $include_context );

				break;

			case is_year() && $context = is_year() ? 'yearly' : false:
			case is_month() && $context = is_year() ? 'monthly' : false:
			case is_day() && $context = is_year() ? 'daily' : false:

				$formats = [
					'yearly'  => [
						_x( 'Y', 'yearly archives date format', 'blockera-core' ),
					],
					'monthly' => [
						_x( 'F Y', 'monthly archives date format', 'blockera-core' ),
					],
					'daily'   => [
						_x( 'F j, Y', 'daily archives date format', 'blockera-core' ),
					],
				];

				$title = get_the_date( $formats[ $context ][0] );
				$title = self::getTitleWithTheContext( $title, $page_type = $context, $include_context );

				unset( $formats );

				break;

			case is_tax( 'post_format' ):

				$terms = [
					'chat',
					'link',
					'aside',
					'video',
					'image',
					'audio',
					'quote',
					'status',
					'gallery',
				];

				foreach ( $terms as $term ) {

					if ( ! is_tax( 'post_format', sprintf( 'post-format-%s', $term ) ) ) {

						continue;
					}

					$term = self::pluralSuffix( $term );

					$title = sprintf( _x( '%s', 'post format archive title', 'blockera-core' ), ucfirst( $term ) );
				}

				break;

			case is_post_type_archive():

				$title = post_type_archive_title( '', false );

				$title = self::getTitleWithTheContext( $title, $page_type = 'post_type_archive', $include_context );

				break;

			case is_tax():

				$title = single_term_title( '', false );

				$title = self::getTitleWithTheContext( $title, $page_type = 'tax', $include_context );

				break;

			case is_archive():

				$title = __( 'Archives', 'blockera-core' );

				break;

			case is_404():

				$title = __( 'Page Not Found', 'blockera-core' );

				break;
		}

		/**
		 * The archive title.
		 *
		 * Filters the archive title.
		 * @hook  ''
		 *
		 * @param string $title Archive title to be displayed.
		 *
		 * @since 1.0.0
		 *
		 */
		return apply_filters( 'blockera-core/dynamic-value/utility/the_archive_title', $title, $page_type );
	}

	/**
	 * Retrieve title when $include_context is set true with the context otherwise result: original title.
	 *
	 * @param string $original_title  the original title.
	 * @param string $page_type       the page type.
	 * @param bool   $include_context to include context value.
	 *
	 *
	 * @since 1.0.0
	 * @return string|null string on success, null on otherwise!
	 */
	public static function getTitleWithTheContext( string $original_title, string $page_type = '', bool $include_context = true ): ?string {

		if ( ! $include_context || empty( $page_type ) ) {

			return $original_title;
		}

		switch ( $page_type ) {

			case 'singular':

				$post_type_object = get_post_type_object( get_post_type() );

				$original_title = sprintf( __( '%1$s: %2$s', 'blockera-core' ), $post_type_object->labels->singular_name, $original_title );

				break;

			case 'cat':
			case 'tag':

				$page = 'cat' === $page_type ? __( 'Category:', 'blockera-core' ) : __( 'Tag:', 'blockera-core' );

				/* translators: $page archive title. 1: $page name   ==>  $page = 'Category' OR 'Tag' */
				$original_title = sprintf( __( '%1$s %2$s', 'blockera-core' ), $page, $original_title );

				break;

			case 'yearly':
			case 'monthly':
			case 'daily':

				$page_type = str_replace( [ 'ly', 'i' ], [ '', 'y' ], $page_type );

				/* translators: (Yearly , Monthly , Daily) archive title. 1: (Year , Month , Day) */
				$original_title = sprintf( __( '%1$s: %2$s', 'blockera-core' ), ucfirst( $page_type ), $original_title );

				break;

			case 'post_type_archive':

				$original_title = sprintf( __( 'Archives: %1$s', 'blockera-core' ), $original_title );

				break;

			case 'tax' :

				$tax = get_taxonomy( get_queried_object()->taxonomy );

				/* translators: Taxonomy term archive title. 1: Taxonomy singular name, 2: Current taxonomy term */
				$original_title = sprintf( __( '%1$s: %2$s', 'blockera-core' ), $tax->labels->singular_name, $original_title );

				break;
		}

		return $original_title;
	}

	/**
	 * Add plural suffix ('s','es','ies') to string.
	 *
	 * @param string $string
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public static function pluralSuffix( string $string ): string {

		switch ( substr( $string, -1 ) ) {

			case 's':

				$string .= 'es';

				break;

			case 'y':

				$string = substr_replace( $string, 'ies', -1 );

				break;

			default:

				$string .= 's';

				break;
		}

		return $string;
	}

	public static function getTheArchiveURL(): string {

		$url = '';

		switch ( true ) {

			case is_category() || is_tag() || is_tax():

				$url = get_term_link( get_queried_object() );

				break;

			case is_author():

				$url = get_author_posts_url( get_queried_object_id() );

				break;

			case is_year():

				$url = get_year_link( get_query_var( 'year' ) );

				break;

			case is_month():

				$url = get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) );

				break;

			case is_day():

				$url = get_day_link( get_query_var( 'year' ), get_query_var( 'monthnum' ), get_query_var( 'day' ) );

				break;

			case is_post_type_archive():

				$url = get_post_type_archive_link( get_post_type() );

				break;

		}

		return $url;
	}

	public static function setupGlobalAuthorData() {

		global $authordata;

		if ( ! isset( $authordata->ID ) ) {

			$post = get_post();

			//phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			$authordata = get_userdata( $post->post_author );
		}
	}

	/**
	 * Used to overcome core bug when taxonomy is in more then one post type
	 *
	 * @see   https://core.trac.wordpress.org/ticket/27918
	 *
	 * @global array $wp_taxonomies The registered taxonomies.
	 *
	 *
	 * @param array  $args
	 * @param string $output
	 * @param string $operator
	 *
	 * @since 1.0.0
	 * @return array
	 */
	public static function get_taxonomies( array $args = [], string $output = 'names', string $operator = 'and' ): array {

		global $wp_taxonomies;

		$field = ( 'names' === $output ) ? 'name' : false;

		// Handle 'object_type' separately.
		if ( isset( $args['object_type'] ) ) {

			$object_type = (array) $args['object_type'];
			unset( $args['object_type'] );
		}

		$taxonomies = wp_filter_object_list( $wp_taxonomies, $args, $operator );

		if ( isset( $object_type ) ) {

			foreach ( $taxonomies as $tax => $tax_data ) {

				if ( array_intersect( $object_type, $tax_data->object_type ) ) {

					continue;
				}

				unset( $taxonomies[ $tax ] );
			}
		}

		if ( $field ) {

			$taxonomies = wp_list_pluck( $taxonomies, $field );
		}

		return $taxonomies;
	}

	/**
	 * Retrieve placeholder image src for site logo.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public static function getPlaceholderImage(): string {

		$placeholder_image = blockera_core_config( 'app.root_path' ) . 'images/placeholder.png';

		/**
		 * Get placeholder image source.
		 *
		 * Filters the source of the default placeholder image used by DynamicValues
		 *
		 * @param string $placeholder_image The source of the default placeholder image.
		 *
		 * @since 1.0.0
		 *
		 */
		return apply_filters( 'blockera-core/dynamic-value/utility/placeholder_image_logo', $placeholder_image );
	}

}
