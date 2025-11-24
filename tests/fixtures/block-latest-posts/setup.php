<?php
/**
 * Setup for the latest posts block.
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

// Create all posts before running tests
foreach ($data['posts'] as $post_data) {
	$post_id = $this->factory()->post->create([
		'post_title'   => $post_data['post_title'] ?? 'Test Post',
		'post_content' => $post_content,
		'post_status'  => $post_data['post_status'] ?? 'publish',
		'post_type'    => $post_data['post_type'] ?? 'post',
	]);
}
