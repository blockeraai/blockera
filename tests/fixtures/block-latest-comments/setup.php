<?php
/**
 * Setup for the latest comments block.
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
if (!is_array($data) || !isset($data['post']) || !isset($data['comments']) || !is_array($data['comments'])) {
	throw new \Exception('Invalid data file format: ' . $data_file);
}

$post_title = $data['post']['post_title'] ?? 'Test Post for Latest Comments';

// Latest Comments is site-wide — remove approved comments that could leak in.
$existing_comment_ids = get_comments(
	[
		'status' => 'approve',
		'fields' => 'ids',
		'number' => 0,
	]
);
if (is_array($existing_comment_ids)) {
	foreach ($existing_comment_ids as $existing_comment_id) {
		wp_delete_comment((int) $existing_comment_id, true);
	}
}

// Match snapshot/frontend.html author label regardless of site user profile.
wp_update_user(
	[
		'ID' => 1,
		'display_name' => 'admin',
	]
);

// Step 1: Create post
$post_id = $this->factory()->post->create([
	'post_title'   => $post_title,
	'post_content' => $post_content,
	'post_status'  => $data['post']['post_status'] ?? 'publish',
	'post_type'    => $data['post']['post_type'] ?? 'post',
]);

// Step 2: Create all comments
$comment_count = count($data['comments']);
foreach ($data['comments'] as $index => $comment_data) {
	$comment_author_id = $comment_data['comment_author'] ?? 1;
	$comment_content = $comment_data['comment_content'] ?? 'This is comment text.';

	// Get user data for comment author
	$user = get_userdata($comment_author_id);
	if (!$user) {
		throw new \Exception('User with ID ' . $comment_author_id . ' not found');
	}

	// Fixed future epoch keeps ordering stable and above any leftover site data.
	$seconds_ago = $index * 5;
	$comment_date = gmdate('Y-m-d H:i:s', strtotime('2099-06-15 12:00:00 UTC') - $seconds_ago);
	$comment_date_gmt = $comment_date;

	$comment_id = $this->factory()->comment->create([
		'comment_post_ID' => $post_id,
		'comment_author' => $user->display_name,
		'comment_author_email' => $user->user_email,
		'comment_author_url' => $user->user_url,
		'comment_content' => $comment_content,
		'comment_approved' => 1,
		'user_id' => $comment_author_id,
		'comment_date' => $comment_date,
		'comment_date_gmt' => $comment_date_gmt,
	]);

	if (!$comment_id) {
		throw new \Exception('Failed to create comment');
	}
}

