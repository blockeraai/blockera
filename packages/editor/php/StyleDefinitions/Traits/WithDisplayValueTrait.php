<?php

namespace Blockera\Editor\StyleDefinitions\Traits;

trait WithDisplayValueTrait {

	/**
	 * Get display value from settings or default settings
	 *
	 * @param string $property Property name to check in settings.
	 * @return string Display value
	 */
	private function getDisplayValue( string $property = 'blockeraDisplay'): string {

		// Get display value from current states and breakpoint.
		$value = $this->extractValueFromSource($this->settings, $property);
		if ('' !== $value) {
			return $value;
		}

		// Get display value from main attributes.
		$value = $this->extractValueFromSource($this->block['attrs'] ?? [], $property);
		if ('' !== $value) {
			return $value;
		}

		// Get display value from current breakpoint settings.
		$value = $this->extractValueFromSource($this->getCurrentBreakpointSettings(), $property);
		if ('' !== $value) {
			return $value;
		}

		// Get display value from current inner block settings.
		$value = $this->extractValueFromSource($this->getCurrentInnerBlockSettings(), $property);
		if ('' !== $value) {
			return $value;
		}

		// Get display value from current breakpoint settings (with fallback).
		$value = $this->extractValueFromSource($this->getCurrentBreakpointSettings(true), $property);
		if ('' !== $value) {
			return $value;
		}

		// Get display value from default settings.
		if (! empty($this->default_settings[ $property ]['default']['value'])) {
			return $this->default_settings[ $property ]['default']['value'];
		}

		return '';
	}

	/**
	 * Extract value from a source array for a given property
	 *
	 * @param array  $source Source array to check.
	 * @param string $property Property name to check in source.
	 * @return string Extracted value or empty string if not found.
	 */
	private function extractValueFromSource( array $source, string $property ): string {
		if (! isset($source[ $property ])) {
			return '';
		}

		$value = $source[ $property ];

		if (is_string($value)) {
			return $value;
		}

		if (! empty($value['value'])) {
			return $value['value'];
		}

		return '';
	}
}
