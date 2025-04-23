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
		'label' => 'Normal',
		'breakpoints' => [],
	],
	'hover' => [
		'type' => 'hover', 
		'label' => 'Hover',
		'breakpoints' => [],
	],
	'active' => [
		'type' => 'active',
		'label' => __( 'Active', 'blockera' ),
		'breakpoints' => [],
		'disabled' => true,
	],
	'focus' => [
		'type' => 'focus',
		'label' => __( 'Focus', 'blockera' ),
		'breakpoints' => [],
		'disabled' => true,
	],
	'visited' => [
		'type' => 'visited',
		'label' => __( 'Visited', 'blockera' ),
		'breakpoints' => [],
		'disabled' => true,
	],
	'before' => [
		'type' => 'before',
		'label' => __( 'Before', 'blockera' ),
		'breakpoints' => [],
		'disabled' => true,
	],
	'after' => [
		'type' => 'after',
		'label' => __( 'After', 'blockera' ),
		'breakpoints' => [],
		'disabled' => true,
	],
	'custom-class' => [
		'type' => 'custom-class',
		'label' => __( 'Custom Class', 'blockera' ),
		'breakpoints' => [],
		'disabled' => true,
	],
	'parent-class' => [
		'type' => 'parent-class',
		'label' => __( 'Parent Class', 'blockera' ),
		'breakpoints' => [],
		'disabled' => true,
	],
	'parent-hover' => [
		'type' => 'parent-hover',
		'label' => __( 'Parent Hover', 'blockera' ),
		'breakpoints' => [],
		'disabled' => true,
	],
] );