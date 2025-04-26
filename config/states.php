<?php
/**
 * Blockera panel config.
 *
 * @package Blockera
 */

// direct access is not allowed.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable
return apply_filters( 'blockera.editor.extensions.blockStates.availableStates', [
	'normal' => [
		'type' => 'normal',
		'label' => __( 'Normal', 'blockera' ),
		'category' => 'essential',
		'category-label' => __( 'Essential', 'blockera' ),
		'breakpoints' => [],
		'priority' => 0,
	],
	'hover' => [
		'type' => 'hover', 
		'label' => __( 'Hover', 'blockera' ),
		'category' => 'essential',
		'category-label' => __( 'Essential', 'blockera' ),
		'breakpoints' => [],
		'priority' => 0,
	],
	'before' => [
		'type' => 'before',
		'label' => __( 'Before', 'blockera' ),
		'category' => 'pseudo-classes',
		'category-label' => __( 'Pseudo-classes', 'blockera' ),
		'breakpoints' => [],
		'disabled' => true,
		'priority' => 10,
	],
	'after' => [
		'type' => 'after',
		'label' => __( 'After', 'blockera' ),
		'category' => 'pseudo-classes',
		'category-label' => __( 'Pseudo-classes', 'blockera' ),
		'breakpoints' => [],
		'disabled' => true,
		'priority' => 10,
	],
	'empty' => [
		'type' => 'empty',
		'label' => __( 'Empty', 'blockera' ),
		'category' => 'pseudo-classes',
		'category-label' => __( 'Pseudo-classes', 'blockera' ),
		'breakpoints' => [],
		'disabled' => true,
		'priority' => 10,
	],
	'custom-class' => [
		'type' => 'custom-class',
		'label' => __( 'Custom Class', 'blockera' ),
		'category' => 'advanced',
		'category-label' => __( 'Advanced', 'blockera' ),
		'breakpoints' => [],
		'disabled' => true,
		'priority' => 10,
	],
] );