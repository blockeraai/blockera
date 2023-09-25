<?php

namespace Publisher\Framework\Services\Render\Styles;

class TypographyStyle extends SimpleStyle {

	protected function getValidCssProp( string $propId ): string {

		$mappedProps = [
			'publisherFontColor'      => 'color',
			'publisherFontSize'       => 'font-size',
			'publisherDirection'      => 'direction',
			'publisherTextAlign'      => 'text-align',
			'publisherFontStyle'      => 'font-style',
			'publisherLineHeight'     => 'line-height',
			'publisherWordSpacing'    => 'word-spacing',
			'publisherTextTransform'  => 'text-transform',
			'publisherLetterSpacing'  => 'letter-spacing',
			'publisherTextDecoration' => 'text-decoration',
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
