<?php
/**
 * Setup for the post featured image block.
 * 
 * @var string $post_content The post content.
 * @var BlockeraTest $this The test instance.
 * @var string $designName The design name.
 */
	
$post_id = $this->factory()->post->create([
	'post_title'   => 'Test Design: ' . $designName,
	'post_content' => $post_content,
	'post_status'  => 'publish',
	'post_type'    => blockera_test_get_post_type($designName),
]);

// Get the path to the featured image
$fixtures_path = dirname(__FILE__);
$image_path = $fixtures_path . '/featured-image.png';

if (!file_exists($image_path)) {
	throw new \Exception('Featured image file not found: ' . $image_path);
}

// Read the image file
$image_data = file_get_contents($image_path);
if ($image_data === false) {
	throw new \Exception('Failed to read featured image file: ' . $image_path);
}

// Get upload directory and create unique filename
$filename = 'featured-image.png';

// Save image using wp_upload_bits (handles file operations properly)
$upload = wp_upload_bits($filename, null, $image_data);

if (!$upload['error']) {
	// Prepare attachment data
	$attachment = array(
		'post_mime_type' => 'image/png',
		'post_title'     => sanitize_file_name(pathinfo($filename, PATHINFO_FILENAME)),
		'post_content'   => '',
		'post_status'    => 'inherit',
		'post_parent'    => $post_id,
	);

	// Insert attachment
	require_once(ABSPATH . 'wp-admin/includes/image.php');
	$attachment_id = wp_insert_attachment($attachment, $upload['file'], $post_id);

	if (!is_wp_error($attachment_id)) {
		// Generate attachment metadata (may not work for SVG, but safe to call)
		$attachment_data = wp_generate_attachment_metadata($attachment_id, $upload['file']);
		if (!empty($attachment_data)) {
			wp_update_attachment_metadata($attachment_id, $attachment_data);
		}

		// Set as featured image
		set_post_thumbnail($post_id, $attachment_id);
	}
}
