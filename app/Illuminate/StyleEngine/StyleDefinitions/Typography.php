<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Typography extends BaseStyleDefinition {

	public function getProperties(): array {

		if ( empty( $this->settings['type'] ) ) {

			return $this->properties;
		}

		$cssProperty   = $this->settings['type'];
		$propertyValue = $this->settings[ $cssProperty ];
		
		if ( 'text-orientation' === $cssProperty ) {

			$this->setProperties(
				[
					'writing-mode' => $propertyValue['writing-mode'] . $this->getImportant(),
					$cssProperty   => $propertyValue['text-orientation'] . $this->getImportant(),
				]
			);

			return $this->properties;
		}

		if ( 'column-count' === $cssProperty ) {

			$propertyValue = 'none' === $propertyValue ? 'initial' : preg_replace( '/\b-columns\b/i', '', $propertyValue );
		}

		$this->setProperties(
			[
				$cssProperty => $propertyValue . $this->getImportant(),
			]
		);

		return $this->properties;
	}

}