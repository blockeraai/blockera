<?php

namespace Blockera\Editor\StyleDefinitions;

class ColumnCount extends BaseStyleDefinition {

	protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'column-count' !== $cssProperty) {

            return $declaration;
		}
		
		if (! empty($setting[ $cssProperty ]['columns'])) {

			$this->setDeclaration('column-count', 'none' === $setting[ $cssProperty ]['columns'] ? 'initial' : preg_replace('/\b-columns\b/i', '', $setting[ $cssProperty ]['columns']));

			if ('initial' !== $declaration['column-count']) {
				if (! empty($setting[ $cssProperty ]['gap'])) {
					$this->setDeclaration('column-gap', $setting[ $cssProperty ]['gap']);
				}

				if (! empty($setting[ $cssProperty ]['divider']['width'])) {

					$color = blockera_get_value_addon_real_value($setting[ $cssProperty ]['divider']['color']);

					if ($color) {
						$this->setDeclaration('column-rule-color', $color);
					}

					$this->setDeclaration('column-rule-style', $setting[ $cssProperty ]['divider']['style'] ?? 'solid');
					$this->setDeclaration('column-rule-width', $setting[ $cssProperty ]['divider']['width']);
				}
			}
		}

		$this->setCss($this->declarations);

        return $this->css;
    }
}
