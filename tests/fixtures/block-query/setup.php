<?php
/**
 * Setup for the query block.
 *
 * Seeds static published posts first so Query Loop titles stay deterministic
 * (orderBy title desc), then creates the host page that contains the Query blocks.
 *
 * @var string $post_content The post content.
 * @var BlockeraTest $this The test instance.
 * @var string $designName The design name.
 */

// Load data from data.json
$fixtures_path = dirname(__FILE__);
$data_file     = $fixtures_path . '/data.json';

if (!file_exists($data_file)) {
	throw new \Exception('Data file not found: ' . $data_file);
}

$data_content = file_get_contents($data_file);
if ($data_content === false) {
	throw new \Exception('Failed to read data file: ' . $data_file);
}

$data = json_decode($data_content, true);
if (
	!is_array($data)
	|| !isset($data['posts'])
	|| !is_array($data['posts'])
	|| !isset($data['host_post'])
	|| !is_array($data['host_post'])
) {
	throw new \Exception('Invalid data file format: ' . $data_file);
}

// Step 1: Seed static posts that the Query Loop will list.
// Titles use a ZZZ prefix so they always win title-desc ordering over
// leftover posts from other fixtures.
foreach ($data['posts'] as $post_data) {
	$this->factory()->post->create(
		[
			'post_title'   => $post_data['post_title'] ?? 'Static Query Post',
			'post_name'    => $post_data['post_name'] ?? '',
			'post_content' => $post_data['post_content'] ?? '',
			'post_status'  => $post_data['post_status'] ?? 'publish',
			'post_type'    => $post_data['post_type'] ?? 'post',
			'post_date'    => $post_data['post_date'] ?? '2024-06-01 12:00:00',
			'post_author'  => 1,
		]
	);
}

// Step 2: Create the host page that contains the Query block markup.
$host_post = $data['host_post'];
$post_id   = $this->factory()->post->create(
	[
		'post_title'   => $host_post['post_title'] ?? ( 'Test Design: ' . $designName ),
		'post_name'    => $host_post['post_name'] ?? '',
		'post_content' => $post_content,
		'post_status'  => $host_post['post_status'] ?? 'publish',
		'post_type'    => $host_post['post_type'] ?? 'page',
		'post_author'  => 1,
	]
);
