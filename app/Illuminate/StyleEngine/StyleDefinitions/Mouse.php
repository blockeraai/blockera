<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Mouse extends BaseStyleDefinition {

	/**
	 * collect all css properties.
	 *
	 * @param array $setting the background settings.
	 *
	 * @return array
	 */
	public function collectProps( array $setting ): array {

		if ( empty( $setting['type'] ) ) {

			return $this->properties;
		}

		$cssProperty   = $setting['type'];
		$propertyValue = $setting[ $cssProperty ];

		$this->setProperties(
			array_merge(
				$this->properties,
				[
					$cssProperty => $propertyValue . $this->getImportant(),
				]
			)
		);

		return $this->properties;
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