<?php
/**
 * Publish or update the page-1 benchmark page from the complex-2 fixture. Prints the post ID.
 *
 * Usage (inside wp-env): wp eval-file wp-content/plugins/blockera/.github/performance/scripts/publish-page-1.php
 *
 * @package Blockera
 */

if ( ! defined( 'ABSPATH' ) ) {
	fwrite( STDERR, "ABSPATH not defined\n" );
	exit( 1 );
}

$fixture = ABSPATH . 'wp-content/plugins/blockera/tests/fixtures/complex-2/input.html';
$slug    = 'perf-page-1';
$title   = 'Perf Page 1';

if ( ! file_exists( $fixture ) ) {
	fwrite( STDERR, "Missing fixture: {$fixture}\n" );
	exit( 1 );
}

$content = file_get_contents( $fixture );
if ( false === $content ) {
	fwrite( STDERR, "Could not read fixture: {$fixture}\n" );
	exit( 1 );
}

$existing = get_posts(
	array(
		'name'           => $slug,
		'post_type'      => 'page',
		'post_status'    => 'any',
		'posts_per_page' => 1,
		'fields'         => 'ids',
	)
);

if ( ! empty( $existing[0] ) ) {
	$id     = (int) $existing[0];
	$result = wp_update_post(
		array(
			'ID'           => $id,
			'post_title'   => $title,
			'post_status'  => 'publish',
			'post_name'    => $slug,
			'post_content' => $content,
		),
		true
	);
	if ( is_wp_error( $result ) ) {
		fwrite( STDERR, $result->get_error_message() . "\n" );
		exit( 1 );
	}
	echo $id;
	exit( 0 );
}

$id = wp_insert_post(
	array(
		'post_type'    => 'page',
		'post_title'   => $title,
		'post_status'  => 'publish',
		'post_name'    => $slug,
		'post_content' => $content,
	),
	true
);

if ( is_wp_error( $id ) ) {
	fwrite( STDERR, $id->get_error_message() . "\n" );
	exit( 1 );
}

echo (int) $id;
