<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

use Publisher\Framework\Exceptions\BaseException;

class BoxShadow extends BaseStyleDefinition {

	/**
	 * @return array
	 */
	public function getProperties(): array {

		return array_map( static function ( array $prop ) {

			if ( ! isset( $prop['isVisible'] ) || ! $prop['isVisible'] ) {
				return null;
			}

			return sprintf(
				'%1$s %2$s %3$s %4$s %5$s %6$s',
				$prop['type'] === 'inner' ? 'inset' : '',
				$prop['x'] ?? '',
				$prop['y'] ?? '',
				$prop['blur'] ?? '',
				$prop['spread'] ?? '',
				$prop['color'] ?? ''
			);
		}, $this->settings );
	}

	protected function getCacheKey( string $suffix = '' ): string {

		return getClassname( __NAMESPACE__, __CLASS__ ) . parent::getCacheKey( $suffix );
	}

}
