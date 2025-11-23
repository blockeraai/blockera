<?php
/**
 * Setup for the categories block.
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
if (!is_array($data) || !isset($data['categories'])) {
	throw new \Exception('Invalid data file format: ' . $data_file);
}

// Create categories
foreach ($data['categories'] as $category_name) {
	// Check if category already exists
	$term = get_term_by('name', $category_name, 'category');
	
	if (!$term) {
		// Create the category
		$term_result = wp_insert_term($category_name, 'category');
		
		if (is_wp_error($term_result)) {
			throw new \Exception('Failed to create category: ' . $term_result->get_error_message());
		}
	}
}

