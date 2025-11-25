<?php
/**
 * Setup for the navigation block.
 * 
 * @var string $post_content The post content.
 * @var BlockeraTest $this The test instance.
 * @var string $designName The design name.
 */

// Step 1: Load navigation content from navigation.html
$fixtures_path = dirname(__FILE__);
$navigation_file = $fixtures_path . '/navigation.html';

if (!file_exists($navigation_file)) {
	throw new \Exception('Navigation file not found: ' . $navigation_file);
}

$navigation_content = file_get_contents($navigation_file);
if ($navigation_content === false) {
	throw new \Exception('Failed to read navigation file: ' . $navigation_file);
}

// Step 2: Create navigation post with content
$navigation_post_id = $this->factory()->post->create([
	'post_title'   => 'Navigation',
	'post_content' => $navigation_content,
	'post_status'  => 'publish',
	'post_type'    => 'wp_navigation',
	'post_author'  => 1,
]);

// Step 3: Replace the ref ID in post_content with the actual navigation post ID
$post_content = preg_replace(
	'/"ref":\s*\d+/',
	'"ref":' . $navigation_post_id,
	$post_content
);

// Step 4: Create a post with the modified post_content
$post_id = $this->factory()->post->create([
	'post_title'   => 'Test Design: ' . $designName,
	'post_content' => $post_content,
	'post_status'  => 'publish',
	'post_type'    => blockera_test_get_post_type($designName),
]);

