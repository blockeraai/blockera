<?php
/**
 * Setup for the footnotes block.
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

// Try direct database insert to bypass WordPress filters for sanitization of footnotes
global $wpdb;

// Insert directly into database
$insert_result = $wpdb->insert(
	$wpdb->postmeta,
	[
		'post_id'    => $post_id,
		'meta_key'   => 'footnotes',
		'meta_value' => '[{"content":"This is a test <a href=\"#a\">link</a> element. It include<br><strong>strong</strong>, <em>italic</em> , <span>span</span>, <kbd>CMD + K</kbd> key, <code>const $akbar</code><br>inline code and <mark>highlight</mark> elements.","id":"446c523d-801e-4020-b4d3-733ca3f55404"},{"content":"Goot note 2","id":"e527f2d5-aa41-4500-93ae-30a5d4f1b463"}]',
	],
	['%d', '%s', '%s']
);

