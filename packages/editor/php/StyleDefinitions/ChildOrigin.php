<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class ChildOrigin extends BaseStyleDefinition {

    protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'child-origin' !== $cssProperty) {

            return $declaration;
        }

        $top  = $setting[ $cssProperty ]['top'] ?? '';
        $left = $setting[ $cssProperty ]['left'] ?? '';

        if (! empty($top) && ! empty($left)) {
            $this->setDeclaration('perspective-origin', "{$top} {$left}");
        }

        $this->setCss($this->declarations);

        return $this->css;
    }
}
