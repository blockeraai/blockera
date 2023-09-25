<?php

namespace Publisher\Framework\Services\Render\Styles;

class SizeStyle extends SimpleStyle {

	protected function getStyleId(): string {

		return 'publisherSizing';
	}

	protected function getValidCssProp( string $propId ): string {

		$mappedProps = [
			'publisherWidth'    => 'width',
			'publisherHeight'   => 'height',
			'publisherOverflow' => 'overflow',
		];

		return $mappedProps[ $propId ] ?? $propId;
	}

	protected function beforeGenerate( string $propId ): void {

		if ( 'width' !== $propId ) {

			return;
		}

		$this->definition->setOptions( [ 'is-important' => true ] );
	}

}
