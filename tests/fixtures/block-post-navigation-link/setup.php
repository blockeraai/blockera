<?php
/**
 * Setup for the post navigation link block.
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
if (!is_array($data) || !isset($data['posts']) || !is_array($data['posts'])) {
	throw new \Exception('Invalid data file format: ' . $data_file);
}

// Create all posts with 10 seconds difference in time
// Post 1 (oldest) -> Post 2 (middle, test post) -> Post 3 (newest)
$post_ids = [];
foreach ($data['posts'] as $index => $post_data) {
	// Calculate post date: Post 1 is 20 seconds ago, Post 2 is 10 seconds ago, Post 3 is now
	// This ensures 10 seconds difference between each post
	$seconds_ago = (count($data['posts']) - 1 - $index) * 10;
	$post_date = date('Y-m-d H:i:s', strtotime("-{$seconds_ago} seconds"));
	$post_date_gmt = gmdate('Y-m-d H:i:s', strtotime("-{$seconds_ago} seconds"));

	$post_id = $this->factory()->post->create([
		'post_title'   => $post_data['post_title'] ?? 'Test Post',
		'post_content' => $post_content,
		'post_status'  => $post_data['post_status'] ?? 'publish',
		'post_type'    => $post_data['post_type'] ?? 'post',
		'post_date'    => $post_date,
		'post_date_gmt' => $post_date_gmt,
	]);

	$post_ids[] = $post_id;
}

// Use post number 2 (index 1) as the test post
$post_id = $post_ids[1];

