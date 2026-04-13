<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;
use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;

class WebkitTextStrokeWidth extends BaseStyleDefinition {

    protected function css( array $setting): array {

        if (! isset($setting['type'])) {
            return [];
        }

        $cssProperty = $setting['type'];

        if ('' === $cssProperty || '-webkit-text-stroke-width' !== $cssProperty || ! isset($setting[ $cssProperty ])) {
            return [];
        }

        $strokeData = $setting[ $cssProperty ];

        if (! isset($strokeData['width'])) {
            $this->setCss($this->declarations);
            return $this->css;
        }

        $width = blockera_get_value_addon_real_value($strokeData['width']);

        if (empty($width)) {
            $this->setCss($this->declarations);
            return $this->css;
        }

        $this->setDeclaration('-webkit-text-stroke-width', $width);
        $this->setDeclaration('text-stroke-width', $width);

        $this->setCss($this->declarations);

        return $this->css;
    }
}
