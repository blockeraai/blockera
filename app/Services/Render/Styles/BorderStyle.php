<?php

namespace Publisher\Framework\Services\Render\Styles;

class BorderStyle extends SimpleStyle {

	protected function getStyleId(): string {

		return 'publisherBorder';
	}

	protected function getValidCssProp( string $propId ): string {

		$mappedProps = [
			'publisherBorder'       => 'border',
			'publisherBorderRadius' => 'border-radius',
		];

		return $mappedProps[ $propId ] ?? $propId;
	}

	protected function beforeGenerate( string $propId ): void {
		// TODO: Implement beforeGenerate() method.
	}

}