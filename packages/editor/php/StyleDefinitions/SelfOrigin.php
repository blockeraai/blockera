<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class SelfOrigin extends BaseStyleDefinition {

    protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'self-origin' !== $cssProperty) {

            return $declaration;
        }

        $top  = isset($setting[ $cssProperty ]['top']) ? blockera_get_value_addon_real_value($setting[ $cssProperty ]['top']) : '';
        $left = isset($setting[ $cssProperty ]['left']) ? blockera_get_value_addon_real_value($setting[ $cssProperty ]['left']) : '';

        if (! empty($top) && ! empty($left)) {

            $this->setDeclaration('transform-origin', "{$top} {$left}");
        }

        $this->setCss($this->declarations);

        return $this->css;
    }
}
