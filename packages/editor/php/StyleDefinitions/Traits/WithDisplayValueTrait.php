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

		//
		// Get display value from current states and breakpoint.
		//
		if (isset($this->settings[ $property ]) ) {

			if (is_string($this->settings[ $property ]) ) {
				return $this->settings[ $property ];
			}

			if (! empty($this->settings[ $property ]['value'])) {
				return $this->settings[ $property ]['value'];
			} 
		}

		//
		// Get display value from main attributes.
		//
		if (isset($this->block['attrs'][ $property ]) ) {

			if (is_string(
				$this->block['attrs'][ $property ]
			) ) {
				return $this->block['attrs'][ $property ];
			}

			if (! empty(
				$this->block['attrs'][ $property ]
				['value']
			)) {
				return $this->block['attrs'][ $property ]['value'];
			}
		}

		$current_settings = $this->getCurrentBreakpointSettings();

		//
		// Get display value from current breakpoint settings.
		//
		if (isset($current_settings[ $property ])) {

			if (is_string(
				$current_settings[ $property ]
			) ) {
				return $current_settings[ $property ];
			}

			if (! empty(
				$current_settings[ $property ]
				['value']
			)) {
				return $current_settings[ $property ]['value'];
			}
		}

		//
		// Get display value from default settings.
		//
		if (! empty($this->default_settings[ $property ]['default']['value'])) {
			return $this->default_settings[ $property ]['default']['value'];
		}

		return '';
	}
}
