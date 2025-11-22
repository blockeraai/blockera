<?php

namespace Blockera\Editor\StyleDefinitions;

class Mouse extends BaseStyleDefinition {

    protected function css( array $setting): array {

        $cssProperty = $setting['type'];

        if (empty($cssProperty)) {

            return [];
        }

        $this->setDeclaration($cssProperty, $setting[ $cssProperty ]);

        $this->setCss($this->declarations);

        return $this->css;
    }
}
