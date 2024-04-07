<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

use Publisher\Framework\Exceptions\BaseException;
use Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions\Contracts\Style;

abstract class BaseStyleDefinition implements Style {

	/**
	 * hold style definition settings from consumer request.
	 *
	 * @var array
	 */
	protected array $settings = [];

	/**
	 * hold collection of properties of current style definition.
	 *
	 * @var array
	 */
	protected array $properties = [];

	/**
	 * hold collection of options to generate style
	 *
	 * @var array
	 */
	protected array $options = [
		'is-important' => false,
	];

	public function setOptions( array $options ): void {

		$this->options = array_merge(
			$this->options,
			$options
		);
	}

	/**
	 * Check is important style property value?
	 *
	 * @return bool true on success, false when otherwise.
	 */
	protected function isImportant(): bool {

		return $this->options['is-important'];
	}

	/**
	 * Retrieve important css property value or empty string when was not important!
	 *
	 * @return string
	 */
	protected function getImportant(): string {

		return $this->isImportant() ? ' !important' : '';
	}

	/**
	 * @param array $props
	 *
	 * @return void
	 */
	protected function setProperties( array $props ): void {

		$this->properties = $props;
	}

	/**
	 * @param string $id
	 * @param        $value
	 *
	 *
	 * @return void
	 */
	protected function setProperty( string $id, $value ): void {

		$this->properties[ $id ] = $value;
	}

	/**
	 * @param array $settings
	 *
	 * @return void
	 */
	public function setSettings( array $settings ): void {

		$this->settings = $settings;
	}

	/**
	 * Setup css cache.
	 *
	 * @param mixed|array $cacheValue the cache value as array {$css}
	 * @param string      $cacheKey   the cache key to read and write in database.
	 *
	 * @throws BaseException
	 * @return bool true on success updated cache value in database, false when otherwise!
	 */
	protected function setCache( $cacheValue, string $cacheKey = '' ): bool {

		if ( empty( $cacheKey ) ) {

			$cacheKey = $this->getCacheKey();
		}

		$updated = update_option( $cacheKey, $cacheValue );

		if ( ! $updated ) {

			throw new BaseException( __( "Please check invalid css property name in " . __CLASS__ . ", There was an in StyleEngine::filter_safe_style_css() , Error!", 'publisher-core' ) );
		}

		return $updated;
	}

	/**
	 * Setup css cache.
	 *
	 * @param string $cacheKey the cache key to read and write in database.
	 *
	 * @return mixed|false css older generated if is exists in database!
	 *                     when return false means {$cacheKey} was not exists!
	 */
	protected function getCache( string $cacheKey = '' ) {

		if ( empty( $cacheKey ) ) {

			$cacheKey = $this->getCacheKey();
		}

		return get_option( $cacheKey );
	}

	protected function getCacheKey( string $suffix = '' ): string {

		return 'CssData' . $suffix;
	}

	/**
	 * Get allowed reserved properties.
	 *
	 * @return array
	 */
	abstract public function getAllowedProperties(): array;

	/**
	 * Get valid css property by reserved name.
	 *
	 * @param string $reservedName the setting reserved name.
	 *
	 * @return string|null string on access to available css property, null when not found related css property with setting reserved name.
	 */
	protected function getValidCssProp( string $reservedName ): ?string {

		$allowedProps = $this->getAllowedProperties();

		if ( ! empty( $allowedProps[ $reservedName ] ) ) {

			return $allowedProps[ $reservedName ];
		}

		return null;
	}

	/**
	 * Retrieve css properties.
	 *
	 * @return array the css properties.
	 */
	public function getProperties(): array {

		foreach ( $this->getPrepareSettings() as $name => $setting ) {

			$type = $this->getValidCssProp( $name );

			if ( ! $type ) {

				continue;
			}

			$setting = [
				[
					'isVisible' => true,
					'type'      => $type,
					$type       => $setting,
				]
			];

			array_map( [ $this, 'collectProps' ], $setting );
		}

		return array_filter( $this->properties, 'pb_get_filter_empty_array_item' );
	}

	/**
	 * Get settings.
	 *
	 * @return array The prepared needs settings.
	 */
	protected function getPrepareSettings(): array {

		$preparedSettings = [];

		foreach ( $this->settings as $name => $setting ) {

			// Not available number properties!
			if ( ! is_string( $name ) ) {

				continue;
			}

			// Assume current setting not allowed to handle on this definition.
			if ( ! array_key_exists( $name, $this->getAllowedProperties() ) ) {

				continue;
			}

			// Check is registered setting?
			if ( ! empty( $preparedSettings[ $name ] ) ) {

				continue;
			}

			$preparedSettings[ $name ] = $setting;
		}

		return $preparedSettings;
	}

	/**
	 * collect all css props.
	 *
	 * @param array $setting the background settings.
	 *
	 * @return array
	 */
	abstract protected function collectProps( array $setting ): array;

	/**
	 * Flush all properties.
	 *
	 * @return void
	 */
	public function flushProperties(): void {

		$this->properties = [];
	}

}
