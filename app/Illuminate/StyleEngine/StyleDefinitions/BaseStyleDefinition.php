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

}
