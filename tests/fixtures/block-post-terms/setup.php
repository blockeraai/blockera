<?php
/**
 * Setup for the post terms block.
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
if (!is_array($data) || !isset($data['post']) || !isset($data['categories'])) {
	throw new \Exception('Invalid data file format: ' . $data_file);
}

// Step 1: Create categories
$category_ids = [];
foreach ($data['categories'] as $category_name) {
	// Check if category already exists
	$term = get_term_by('name', $category_name, 'category');
	
	if (!$term) {
		// Create the category
		$term_result = wp_insert_term($category_name, 'category');
		
		if (is_wp_error($term_result)) {
			throw new \Exception('Failed to create category: ' . $term_result->get_error_message());
		}
		
		$category_ids[] = $term_result['term_id'];
	} else {
		$category_ids[] = $term->term_id;
	}
}

// Step 2: Create post
$post_id = $this->factory()->post->create([
	'post_title'   => $data['post']['post_title'] ?? 'Test Post for Post Terms',
	'post_content' => $post_content,
	'post_status'  => $data['post']['post_status'] ?? 'publish',
	'post_type'    => $data['post']['post_type'] ?? 'post',
]);

// Step 3: Assign categories to post
if (!empty($category_ids)) {
	$result = wp_set_object_terms($post_id, $category_ids, 'category');
	
	if (is_wp_error($result)) {
		throw new \Exception('Failed to assign categories to post: ' . $result->get_error_message());
	}
}

