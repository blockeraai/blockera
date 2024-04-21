<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Mouse extends BaseStyleDefinition {

	/**
	 * collect all css selectors and declarations.
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	public function css( array $setting ): array {

		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return [];
		}

		$this->setSelector( $cssProperty );

		$this->setCss(
			[
				$cssProperty => $setting[ $cssProperty ] . $this->getImportant(),
			]
		);

		return $this->css;
	}

	/**
	 * @inheritdoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'publisherCursor'        => 'cursor',
			'publisherUserSelect'    => 'user-select',
			'publisherPointerEvents' => 'pointer-events',
		];
	}

}