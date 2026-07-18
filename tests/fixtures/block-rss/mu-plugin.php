<?php
/**
 * Temporary mu-plugin for RSS block testing.
 *
 * Replaces core/rss server render with static items from the fixture feed so
 * editor (useServerSideRender) and frontend never hit the network or depend on
 * feed.xml path resolution after this file is installed under mu-plugins/.
 *
 * Pattern mirrors block-post-excerpt (render_callback override) and block-calendar
 * (deterministic markup). Markup shape follows render_block_core_rss in
 * source-code-block-editor/packages/block-library/src/rss/index.php.
 *
 * @phpstan-ignore-next-line
 */

/**
 * Static RSS items matching tests/fixtures/block-rss/feed.xml.
 *
 * @return array<int, array{title: string, link: string, date: string, author: string, excerpt: string}>
 */
function blockera_test_rss_static_items() {
	return array(
		array(
			'title'   => 'How to Create a WordPress Website in 2024',
			'link'    => 'https://www.wpbeginner.com/start-a-wordpress-blog/',
			'date'    => 'Mon, 01 Jan 2024 10:00:00 +0000',
			'author'  => 'Author',
			'excerpt' => 'This is the excerpt text. Learn how to create a WordPress website step by step with our comprehensive guide.',
		),
		array(
			'title'   => 'Best WordPress Plugins for Beginners',
			'link'    => 'https://www.wpbeginner.com/best-wordpress-plugins/',
			'date'    => 'Sun, 31 Dec 2023 15:30:00 +0000',
			'author'  => 'Author',
			'excerpt' => 'This is the excerpt text. Discover the essential WordPress plugins every beginner should install to enhance their website.',
		),
		array(
			'title'   => 'WordPress Security Tips for 2024',
			'link'    => 'https://www.wpbeginner.com/wordpress-security/',
			'date'    => 'Sat, 30 Dec 2023 09:15:00 +0000',
			'author'  => 'Author',
			'excerpt' => 'This is the excerpt text. Keep your WordPress site secure with these essential security tips and best practices.',
		),
		array(
			'title'   => 'How to Speed Up Your WordPress Site',
			'link'    => 'https://www.wpbeginner.com/wordpress-performance/',
			'date'    => 'Fri, 29 Dec 2023 14:20:00 +0000',
			'author'  => 'Author',
			'excerpt' => 'This is the excerpt text. Learn proven techniques to improve your WordPress site\'s loading speed and performance.',
		),
		array(
			'title'   => 'WordPress SEO Guide for Beginners',
			'link'    => 'https://www.wpbeginner.com/wordpress-seo/',
			'date'    => 'Thu, 28 Dec 2023 11:45:00 +0000',
			'author'  => 'Author',
			'excerpt' => 'This is the excerpt text. Master WordPress SEO with this comprehensive guide covering everything from keywords to technical SEO.',
		),
	);
}

/**
 * Whether this render should use the static fixture feed.
 *
 * @param array $attributes Block attributes.
 * @return bool
 */
function blockera_test_rss_is_fixture_feed( $attributes ) {
	$feed_url = isset( $attributes['feedURL'] ) ? (string) $attributes['feedURL'] : '';

	return $feed_url !== '' && strpos( $feed_url, 'www.wpbeginner.com/feed' ) !== false;
}

/**
 * Render core/rss from embedded fixture items (no fetch_feed / HTTP).
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content (unused).
 * @param WP_Block $block      Block instance (unused).
 * @return string
 */
function blockera_test_render_block_core_rss( $attributes, $content = '', $block = null ) {
	if ( ! blockera_test_rss_is_fixture_feed( $attributes ) && function_exists( 'render_block_core_rss' ) ) {
		return render_block_core_rss( $attributes );
	}

	$items_to_show = isset( $attributes['itemsToShow'] ) ? (int) $attributes['itemsToShow'] : 5;
	if ( $items_to_show < 1 ) {
		$items_to_show = 5;
	}

	$items = array_slice( blockera_test_rss_static_items(), 0, $items_to_show );

	$open_in_new_tab = ! empty( $attributes['openInNewTab'] );
	$rel             = ! empty( $attributes['rel'] ) ? trim( (string) $attributes['rel'] ) : '';
	$link_attributes = '';

	if ( $open_in_new_tab ) {
		$link_attributes .= ' target="_blank"';
	}
	if ( $rel !== '' ) {
		$link_attributes .= ' rel="' . esc_attr( $rel ) . '"';
	}

	$list_items = '';
	foreach ( $items as $item ) {
		$title = esc_html( $item['title'] );
		$link  = esc_url( $item['link'] );

		if ( $link ) {
			$title = "<a href='{$link}'{$link_attributes}>{$title}</a>";
		}
		$title = "<div class='wp-block-rss__item-title'>{$title}</div>";

		$date_markup = '';
		if ( ! empty( $attributes['displayDate'] ) ) {
			$timestamp = strtotime( $item['date'] );
			if ( $timestamp ) {
				$gmt_offset = get_option( 'gmt_offset' );
				$timestamp += (int) ( (float) $gmt_offset * HOUR_IN_SECONDS );

				$date_markup = sprintf(
					'<time datetime="%1$s" class="wp-block-rss__item-publish-date">%2$s</time> ',
					esc_attr( date_i18n( 'c', $timestamp ) ),
					esc_html( date_i18n( get_option( 'date_format' ), $timestamp ) )
				);
			}
		}

		$author = '';
		if ( ! empty( $attributes['displayAuthor'] ) && $item['author'] !== '' ) {
			$author = '<span class="wp-block-rss__item-author">' . sprintf(
				/* translators: byline. %s: author. */
				__( 'by %s' ),
				esc_html( $item['author'] )
			) . '</span>';
		}

		$excerpt = '';
		if ( ! empty( $attributes['displayExcerpt'] ) && $item['excerpt'] !== '' ) {
			$excerpt_length = isset( $attributes['excerptLength'] ) ? (int) $attributes['excerptLength'] : 55;
			$excerpt_text   = $item['excerpt'];
			$excerpt_text   = esc_attr( wp_trim_words( $excerpt_text, $excerpt_length, ' [&hellip;]' ) );

			if ( '[...]' === substr( $excerpt_text, -5 ) ) {
				$excerpt_text = substr( $excerpt_text, 0, -5 ) . '[&hellip;]';
			}

			$excerpt = '<div class="wp-block-rss__item-excerpt">' . esc_html( $excerpt_text ) . '</div>';
		}

		$list_items .= "<li class='wp-block-rss__item'>{$title}{$date_markup}{$author}{$excerpt}</li>";
	}

	$classnames = array();
	if ( isset( $attributes['blockLayout'] ) && 'grid' === $attributes['blockLayout'] ) {
		$classnames[] = 'is-grid';
	}
	if ( isset( $attributes['columns'] ) && isset( $attributes['blockLayout'] ) && 'grid' === $attributes['blockLayout'] ) {
		$classnames[] = 'columns-' . (int) $attributes['columns'];
	}
	if ( ! empty( $attributes['displayDate'] ) ) {
		$classnames[] = 'has-dates';
	}
	if ( ! empty( $attributes['displayAuthor'] ) ) {
		$classnames[] = 'has-authors';
	}
	if ( ! empty( $attributes['displayExcerpt'] ) ) {
		$classnames[] = 'has-excerpts';
	}

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classnames ) ) );

	return sprintf( '<ul %s>%s</ul>', $wrapper_attributes, $list_items );
}

/**
 * Swap core/rss render_callback for the static fixture renderer.
 *
 * @return void
 */
function blockera_test_override_rss_render_callback() {
	if ( ! class_exists( 'WP_Block_Type_Registry' ) ) {
		return;
	}

	$block_registry = WP_Block_Type_Registry::get_instance();
	if ( ! $block_registry->is_registered( 'core/rss' ) ) {
		return;
	}

	$block_type = $block_registry->get_registered( 'core/rss' );
	if ( $block_type && is_object( $block_type ) ) {
		$block_type->render_callback = 'blockera_test_render_block_core_rss';
	}
}

if ( function_exists( 'did_action' ) && did_action( 'init' ) ) {
	blockera_test_override_rss_render_callback();
} else {
	add_action( 'init', 'blockera_test_override_rss_render_callback', 9999 );
}

add_filter(
	'register_block_type_args',
	static function ( $args, $block_type ) {
		if ( 'core/rss' === $block_type ) {
			$args['render_callback'] = 'blockera_test_render_block_core_rss';
		}

		return $args;
	},
	100,
	2
);
