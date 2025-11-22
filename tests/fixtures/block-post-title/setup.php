<?php
/**
 * Setup for the post title block.
 * 
 * @var string $post_content The post content.
 * @var BlockeraTest $this The test instance.
 * @var string $designName The design name.
 */

// Load data from data.json
$fixtures_path = dirname(__FILE__);
$data_file = $fixtures_path . '/data.json';

if (!file_exists($data_file)) {
	throw new \Exception('Data file not found: ' . $data_file);
}

$data_content = file_get_contents($data_file);
if ($data_content === false) {
	throw new \Exception('Failed to read data file: ' . $data_file);
}

$data = json_decode($data_content, true);
if (!is_array($data) || !isset($data['post']) || !isset($data['title'])) {
	throw new \Exception('Invalid data file format: ' . $data_file);
}

$post_id = $this->factory()->post->create([
	'post_title'   => $data['post']['post_title'] ?? 'Test Post for Post Title',
	'post_content' => $post_content,
	'post_status'  => $data['post']['post_status'] ?? 'publish',
	'post_type'    => $data['post']['post_type'] ?? 'post',
]);

// Try direct database update to bypass WordPress filters for sanitization of title
global $wpdb;

// Update post_title directly in database
$update_result = $wpdb->update(
	$wpdb->posts,
	[
		'post_title' => $data['title'],
	],
	[
		'ID' => $post_id,
	],
	['%s'],
	['%d']
);

