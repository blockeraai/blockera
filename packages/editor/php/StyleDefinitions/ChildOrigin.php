<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class ChildOrigin extends BaseStyleDefinition {

    protected function css( array $setting): array {

        if (! isset($setting['type']) || 'child-origin' !== $setting['type']) {
            return $this->css;
        }

        $cssProperty = $setting['type'];

        if (! isset($setting[ $cssProperty ]) || ! is_array($setting[ $cssProperty ])) {
            return $this->css;
        }

        $childOrigin = $setting[ $cssProperty ];

        if (! isset($childOrigin['top'], $childOrigin['left'])) {
            return $this->css;
        }

        $top  = $childOrigin['top'];
        $left = $childOrigin['left'];

        if ('' !== $top && '' !== $left) {
            $this->setDeclaration('perspective-origin', $top . ' ' . $left);
        }

        $this->setCss($this->declarations);

        return $this->css;
    }
}
