<?php

namespace Publisher\Framework\Services\Render\Styles;

use Publisher\Framework\Exceptions\BaseException;

class LayoutStyle extends SimpleStyle {

	/**
	 * @throws BaseException
	 */
	public function style( array $request ): ?array {

		[
			'key'        => $key,
			'selector'   => $selector,
			'attributes' => $attributes,
		] = $request;

		if ( empty( $attributes[ $key ] ) ) {

			return null;
		}

		if ( is_array( $attributes[ $key ] ) ) {

			$style = $this->complexGenerate( $attributes[ $key ], $selector, $key );

		} else {

			if ( 'publisherFlexChildSizing' === $key ) {

				add_filter(
					'publisher-core/services/render/styles/share/settings-format',
					static function ( array $settings ) use ( $attributes ): array {

						$settings['flex-child'] = [
							'publisherFlexChildGrow'   => $attributes['publisherFlexChildGrow'] ?? 0,
							'publisherFlexChildBasis'  => $attributes['publisherFlexChildBasis'] ?? 0,
							'publisherFlexChildShrink' => $attributes['publisherFlexChildShrink'] ?? 'auto',
						];

						return $settings;
					}
				);
			}

			if ( 'publisherFlexChildOrder' === $key ) {

				add_filter(
					'publisher-core/services/render/styles/share/settings-format',
					static function ( array $settings ) use ( $attributes ): array {

						$settings['custom'] = $attributes['publisherFlexChildOrderCustom'] ?? '100';

						return $settings;
					}
				);
			}

			$style = $this->generate( $attributes[ $key ], $selector, $key );
		}


		if ( ! empty( $style['css'] ) ) {

			$this->css[] = $style['css'];
		}

		return empty( $style ) ? parent::style( $request ) : $style;
	}

	protected function getStyleId(): string {

		return 'publisherLayout';
	}

	protected function getValidCssProp( string $propId ): string {

		$mappedProps = [
			'publisherGap'             => 'gap',
			'publisherFlexChildSizing' => 'flex',
			'publisherFlexChildOrder'  => 'order',
			'publisherDisplay'         => 'display',
			'publisherGapRows'         => 'row-gap',
			'publisherFlexWrap'        => 'flex-wrap',
			'publisherFlexChildAlign'  => 'align-self',
			'publisherGapColumns'      => 'column-gap',
			'publisherAlignItems'      => 'align-items',
			'publisherAlignContent'    => 'align-content',
			'publisherFlexDirection'   => 'flex-direction',
			'publisherJustifyContent'  => 'justify-content',
		];

		return $mappedProps[ $propId ] ?? $propId;
	}

	protected function beforeGenerate( string $propId ): void {
		// TODO: Implement beforeGenerate() method.
	}

}