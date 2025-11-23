<?php
/**
 * Setup for the comments block.
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
if (!is_array($data) || !isset($data['post']) || !isset($data['comment'])) {
	throw new \Exception('Invalid data file format: ' . $data_file);
}

// Step 1: Create post
$post_id = $this->factory()->post->create([
	'post_title'   => $data['post']['post_title'] ?? 'Test Post for Comments',
	'post_content' => $post_content,
	'post_status'  => $data['post']['post_status'] ?? 'publish',
	'post_type'    => $data['post']['post_type'] ?? 'post',
]);

// Step 2: Create comment
$comment_author_id = $data['comment']['comment_author'] ?? 1;
$comment_content = $data['comment']['comment_content'] ?? 'This is comment text.';

// Get user data for comment author
$user = get_userdata($comment_author_id);
if (!$user) {
	throw new \Exception('User with ID ' . $comment_author_id . ' not found');
}

$comment_id = $this->factory()->comment->create([
	'comment_post_ID' => $post_id,
	'comment_author' => $user->display_name,
	'comment_author_email' => $user->user_email,
	'comment_author_url' => $user->user_url,
	'comment_content' => $comment_content,
	'comment_approved' => 1,
	'user_id' => $comment_author_id,
]);

if (!$comment_id) {
	throw new \Exception('Failed to create comment');
}

