<?php

namespace Publisher\Framework\Services\Render\Styles;

class PositionStyle extends SimpleStyle {

	public function getValidCssProp( string $propId ): string {

		$mappedProps = [
			'publisherPosition' => 'position',
			'publisherZIndex'   => 'z-index',
		];

		return $mappedProps[ $propId ] ?? $propId;
	}

	protected function getStyleId(): string {

		return 'publisherPosition';
	}

	protected function beforeGenerate( string $propId ): void {

	}

}
