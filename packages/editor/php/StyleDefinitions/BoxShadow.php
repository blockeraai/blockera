<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class BoxShadow definition to generate css rule.
 *
 * @package BoxShadow
 */
class BoxShadow extends BaseStyleDefinition {

	/**
	 * Check is valid setting for style?
	 *
	 * @param array $setting array of style setting.
	 *
	 * @return bool true on success, false on otherwise.
	 */
	public function isValidSetting( array $setting ): bool {

		if ( empty( $setting['type'] ) ) {

			return false;
		}

		if ( ! in_array( $setting['type'], [ 'inner', 'outer' ], true ) ) {

			return false;
		}

		return ! empty( $setting['isVisible'] );
	}

	/**
	 * @inheritdoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'box-shadow' !== $cssProperty ) {

			return $declaration;
		}

		$filteredBoxShadows = array_values(array_filter(blockera_get_sorted_repeater($setting[ $cssProperty ]), [ $this, 'isValidSetting' ]));

		if (empty($filteredBoxShadows)) {

			return $declaration;
		}

		$boxShadow = $this->getBoxShadow( $filteredBoxShadows[0] );

		$this->setCss( [ $cssProperty => $boxShadow ] );

		return $this->css;
	}

	/**
	 * Get calculated box shadow.
	 *
	 * @param array $setting The setting.
	 *
	 * @return string the box shadow css property value.
	 */
	protected function getBoxShadow( array $setting): string {

		return sprintf(
			'%s %s %s %s %s %s',
			'inner' === $setting['type'] ? 'inset' : '',
			! empty($setting['x']) ? blockera_get_value_addon_real_value($setting['x']) : '',
			! empty($setting['y']) ? blockera_get_value_addon_real_value($setting['y']) : '',
			! empty($setting['blur']) ? blockera_get_value_addon_real_value($setting['blur']) : '',
			! empty($setting['spread']) ? blockera_get_value_addon_real_value($setting['spread']) : '',
			! empty($setting['color']) ? blockera_get_value_addon_real_value($setting['color']) : ''
		);
	}
}
