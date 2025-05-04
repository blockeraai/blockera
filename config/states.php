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
		'force' => true,
		'color' => 'var(--blockera-controls-primary-color-bk)',
	],
	'hover' => [
		'type' => 'hover', 
		'label' => __( 'Hover', 'blockera' ),
		'category' => 'essential',
		'category-label' => __( 'Essential', 'blockera' ),
		'breakpoints' => [],
		'priority' => 0,
		'force' => true,
		'color' => 'var(--blockera-controls-states-color)',
	],
	'before' => [
		'type' => 'before',
		'label' => __( 'Before', 'blockera' ),
		'category' => 'pseudo-classes',
		'category-label' => __( 'Pseudo-classes', 'blockera' ),
		'breakpoints' => [],
		'native' => true,
		'priority' => 10,
		'force' => false,
		'color' => 'var(--blockera-controls-states-color)',
	],
	'after' => [
		'type' => 'after',
		'label' => __( 'After', 'blockera' ),
		'category' => 'pseudo-classes',
		'category-label' => __( 'Pseudo-classes', 'blockera' ),
		'breakpoints' => [],
		'native' => true,
		'priority' => 10,
		'force' => false,
		'color' => 'var(--blockera-controls-states-color)',
	],
	'empty' => [
		'type' => 'empty',
		'label' => __( 'Empty', 'blockera' ),
		'category' => 'pseudo-classes',
		'category-label' => __( 'Pseudo-classes', 'blockera' ),
		'breakpoints' => [],
		'native' => true,
		'priority' => 10,
		'force' => false,
		'color' => 'var(--blockera-controls-states-color)',
	],
	'custom-class' => [
		'type' => 'custom-class',
		'label' => __( 'Custom Class', 'blockera' ),
		'category' => 'advanced',
		'category-label' => __( 'Advanced', 'blockera' ),
		'breakpoints' => [],
		'native' => true,
		'priority' => 10,
		'force' => false,
		'color' => 'var(--blockera-controls-states-color)',
	],
] );