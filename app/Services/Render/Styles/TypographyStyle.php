<?php

namespace Publisher\Framework\Services\Render\Styles;

class TypographyStyle extends SimpleStyle {

	protected function getValidCssProp( string $propId ): string {

		$mappedProps = [
			'publisherFontColor'       => 'color',
			'publisherFontSize'        => 'font-size',
			'publisherDirection'       => 'direction',
			'publisherTextAlign'       => 'text-align',
			'publisherFontStyle'       => 'font-style',
			'publisherWordBreak'       => 'word-break',
			'publisherTextIndent'      => 'text-indent',
			'publisherLineHeight'      => 'line-height',
			'publisherWordSpacing'     => 'word-spacing',
			'publisherTextColumns'     => 'column-count',
			'publisherTextTransform'   => 'text-transform',
			'publisherLetterSpacing'   => 'letter-spacing',
			'publisherTextDecoration'  => 'text-decoration',
			'publisherTextOrientation' => 'text-orientation',
			'publisherTextStroke'      => '-webkit-text-stroke-color',
		];

		return $mappedProps[ $propId ] ?? $propId;
	}

	protected function getStyleId(): string {

		return 'publisherTypography';
	}

	protected function beforeGenerate( string $propId ): void {

		if ( 'color' !== $propId ) {

			return;
		}

		$this->definition->setOptions( [ 'is-important' => true ] );
	}

}
