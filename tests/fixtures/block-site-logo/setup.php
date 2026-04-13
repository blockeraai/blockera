<?php
/**
 * Setup for the site logo block.
 * 
 * @var string $post_content The post content.
 * @var BlockeraTest $this The test instance.
 * @var string $designName The design name.
 */

// Create the post first
$post_id = $this->factory()->post->create([
	'post_title'   => 'Test Design: ' . $designName,
	'post_content' => $post_content,
	'post_status'  => 'publish',
	'post_type'    => blockera_test_get_post_type($designName),
]);

// Get the path to the logo image
$fixtures_path = dirname(__FILE__);
$logo_path = $fixtures_path . '/logo.png';

if (!file_exists($logo_path)) {
	throw new \Exception('Logo file not found: ' . $logo_path);
}

// Read the image file
$image_data = file_get_contents($logo_path);
if ($image_data === false) {
	throw new \Exception('Failed to read logo file: ' . $logo_path);
}

// Save image using wp_upload_bits (handles file operations properly)
$upload = wp_upload_bits('site-logo.png', null, $image_data);


if (!$upload['error']) {
	// Prepare attachment data
	$attachment = array(
		'post_mime_type' => 'image/png',
		'post_title'     => 'site-logo',
		'post_content'   => '',
		'post_status'    => 'inherit',
	);

	// Insert attachment
	require_once(ABSPATH . 'wp-admin/includes/file.php');
	require_once(ABSPATH . 'wp-admin/includes/image.php');
	$attachment_id = wp_insert_attachment($attachment, $upload['file']);

	if (!is_wp_error($attachment_id)) {
		// Generate attachment metadata
		$attachment_data = wp_generate_attachment_metadata($attachment_id, $upload['file']);
		if (!empty($attachment_data)) {
			wp_update_attachment_metadata($attachment_id, $attachment_data);
		}

		// Set as custom logo (site-logo block uses get_custom_logo() which reads custom_logo theme mod)
		// This will automatically sync to site_logo option via _sync_custom_logo_to_site_logo filter
		set_theme_mod('custom_logo', $attachment_id);
	} else {
		throw new \Exception('Failed to create attachment: ' . $attachment_id->get_error_message());
	}
} else {
	throw new \Exception('Failed to upload logo: ' . $upload['error']);
}
