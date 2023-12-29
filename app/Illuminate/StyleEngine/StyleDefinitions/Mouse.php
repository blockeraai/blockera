<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Mouse extends BaseStyleDefinition {

	public function getProperties(): array {

		if ( empty( $this->settings['type'] ) ) {

			return $this->properties;
		}

		$cssProperty   = $this->settings['type'];
		$propertyValue = $this->settings[ $cssProperty ];

		$this->setProperties(
			[
				$cssProperty =>  $propertyValue  . $this->getImportant(),
			]
		);
	 
		return $this->properties;
	}

}