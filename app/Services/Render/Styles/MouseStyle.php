<?php

namespace Publisher\Framework\Services\Render\Styles;

class MouseStyle extends SimpleStyle {

	public function getValidCssProp( string $propId ): string {

		$mappedProps = [
			'publisherCursor' => 'cursor',
			'publisherUserSelect'   => 'user-select',
			'publisherPointerEvents'   => 'pointer-events',
		];

		return $mappedProps[ $propId ] ?? $propId;
	}

	protected function getStyleId(): string {

		return 'publisherMouse';
	}

	protected function beforeGenerate( string $propId ): void {

	}

}
