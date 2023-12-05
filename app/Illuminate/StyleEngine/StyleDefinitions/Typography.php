<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Typography extends BaseStyleDefinition {

	public function getProperties(): array {

		if ( empty( $this->settings['type'] ) ) {

			return $this->properties;
		}

		$cssProperty   = $this->settings['type'];
		$propertyValue = $this->settings[ $cssProperty ];

		switch ( $cssProperty ) {

			case 'text-orientation':

				$this->setProperties(
					[
						'writing-mode' => $propertyValue['writing-mode'] . $this->getImportant(),
						$cssProperty   => $propertyValue['text-orientation'] . $this->getImportant(),
					]
				);

				return $this->properties;

			case 'column-count':
				$propertyValue = 'none' === $propertyValue ? 'initial' : preg_replace( '/\b-columns\b/i', '', $propertyValue );
				break;


			case 'color':
			case '-webkit-text-stroke-width':
			case 'letter-spacing':
			case 'word-spacing':
			case 'line-height':
			case 'text-indent':
			case 'column-gap':
			case 'font-size':
				$propertyValue = $propertyValue ? pb_get_value_addon_real_value( $propertyValue ) : '';
				break;

		}

		if ( $propertyValue ) {
			$this->setProperties(
				[
					$cssProperty => $propertyValue . $this->getImportant(),
				]
			);
		}

		return $this->properties;
	}

}