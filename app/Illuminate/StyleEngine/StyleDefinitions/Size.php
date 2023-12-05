<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Size extends BaseStyleDefinition {

	public function getProperties(): array {

		if ( empty( $this->settings['type'] ) ) {

			return $this->properties;
		}

		$this->setProperties(
			[
				$this->settings['type'] => pb_get_value_addon_real_value( $this->settings[ $this->settings['type'] ] ) . $this->getImportant(),
			]
		);

		return $this->properties;
	}

}