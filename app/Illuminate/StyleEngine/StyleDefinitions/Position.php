<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Position extends BaseStyleDefinition {

	public function getProperties(): array {

		if ( empty( $this->settings['type'] ) ) {

			return $this->properties;
		}

		$props = [];

		switch ( $this->settings['type'] ) {

			case 'position':
				$index   = $this->settings['type'];
				$setting = $this->settings[ $index ];
				[
					'type'     => $position,
					'position' => $value,
				] = $setting;


				$props['position'] = $position;

				$props = array_merge( $props, $value );

				break;
			case 'z-index':
				$props['z-index'] = $this->settings['z-index'];
				break;
		}

		$this->setProperties( $props );

		return $this->properties;
	}

}