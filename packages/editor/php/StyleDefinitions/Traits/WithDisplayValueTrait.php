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
		if (isset($this->settings[ $property ])) {
			$val = $this->settings[ $property ];
			if (is_string($val)) {
				return $val;
			}
			if (isset($val['value']) && '' !== $val['value']) {
				return $val['value'];
			}
		}

		// Get display value from main attributes.
		if (isset($this->block['attrs'][ $property ])) {
			$val = $this->block['attrs'][ $property ];
			if (is_string($val)) {
				return $val;
			}
			if (isset($val['value']) && '' !== $val['value']) {
				return $val['value'];
			}
		}

		// Get display value from current breakpoint settings.
		$breakpointSettings = $this->getCurrentBreakpointSettings();
		if (isset($breakpointSettings[ $property ])) {
			$val = $breakpointSettings[ $property ];
			if (is_string($val)) {
				return $val;
			}
			if (isset($val['value']) && '' !== $val['value']) {
				return $val['value'];
			}
		}

		// Get display value from current inner block settings.
		$innerSettings = $this->getCurrentInnerBlockSettings();
		if (isset($innerSettings[ $property ])) {
			$val = $innerSettings[ $property ];
			if (is_string($val)) {
				return $val;
			}
			if (isset($val['value']) && '' !== $val['value']) {
				return $val['value'];
			}
		}

		// Get display value from current breakpoint settings (with fallback).
		$breakpointSettings = $this->getCurrentBreakpointSettings(true);
		if (isset($breakpointSettings[ $property ])) {
			$val = $breakpointSettings[ $property ];
			if (is_string($val)) {
				return $val;
			}
			if (isset($val['value']) && '' !== $val['value']) {
				return $val['value'];
			}
		}

		// Get display value from default settings.
		if (isset($this->default_settings[ $property ]['default']['value']) && '' !== $this->default_settings[ $property ]['default']['value']) {
			return $this->default_settings[ $property ]['default']['value'];
		}

		return '';
	}
}
