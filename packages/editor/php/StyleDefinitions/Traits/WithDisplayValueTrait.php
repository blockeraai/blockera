<?php

namespace Blockera\Editor\StyleDefinitions\Traits;

trait WithDisplayValueTrait {

	/**
	 * Resolve a display setting payload to a string when possible.
	 *
	 * @param mixed $val Raw setting value.
	 * @return string|null Resolved string, empty string for string payloads, or null when not resolved.
	 */
	private function resolveDisplaySettingValue( $val ): ?string {
		if ( is_string( $val ) ) {
			return $val;
		}

		if ( isset( $val['value'] ) && '' !== $val['value'] ) {
			return $val['value'];
		}

		return null;
	}

	/**
	 * Get display value from settings or default settings
	 *
	 * @param string $property Property name to check in settings.
	 * @return string Display value
	 */
	private function getDisplayValue( string $property = 'blockeraDisplay' ): string {
		if ( isset( $this->settings[ $property ] ) ) {
			$resolved = $this->resolveDisplaySettingValue( $this->settings[ $property ] );
			if ( null !== $resolved ) {
				return $resolved;
			}
		}

		if ( isset( $this->block['attrs'][ $property ] ) ) {
			$resolved = $this->resolveDisplaySettingValue( $this->block['attrs'][ $property ] );
			if ( null !== $resolved ) {
				return $resolved;
			}
		}

		$breakpointSettings = $this->getCurrentBreakpointSettings();
		if ( isset( $breakpointSettings[ $property ] ) ) {
			$resolved = $this->resolveDisplaySettingValue( $breakpointSettings[ $property ] );
			if ( null !== $resolved ) {
				return $resolved;
			}
		}

		$innerSettings = $this->getCurrentInnerBlockSettings();
		if ( isset( $innerSettings[ $property ] ) ) {
			$resolved = $this->resolveDisplaySettingValue( $innerSettings[ $property ] );
			if ( null !== $resolved ) {
				return $resolved;
			}
		}

		$breakpointSettings = $this->getCurrentBreakpointSettings( true );
		if ( isset( $breakpointSettings[ $property ] ) ) {
			$resolved = $this->resolveDisplaySettingValue( $breakpointSettings[ $property ] );
			if ( null !== $resolved ) {
				return $resolved;
			}
		}

		if ( isset( $this->default_settings[ $property ]['default']['value'] ) && '' !== $this->default_settings[ $property ]['default']['value'] ) {
			return $this->default_settings[ $property ]['default']['value'];
		}

		return '';
	}
}
