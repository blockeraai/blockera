<?php

namespace Blockera\Editor\StyleDefinitions;

class WebkitTextStrokeColor extends BaseStyleDefinition {

    protected function css( array $setting): array {

        if (! isset($setting['type'])) {
            return [];
        }

        $cssProperty = $setting['type'];

        if ('' === $cssProperty || '-webkit-text-stroke-color' !== $cssProperty || ! isset($setting[ $cssProperty ])) {
            return [];
        }

        $strokeData = $setting[ $cssProperty ];

        if (! isset($strokeData['color'])) {
            $this->setCss($this->declarations);
            return $this->css;
        }

        $color = blockera_get_value_addon_real_value($strokeData['color']);

        if (empty($color)) {
            $this->setCss($this->declarations);
            return $this->css;
        }

        $this->setDeclaration('-webkit-text-stroke-color', $color);
        $this->setDeclaration('text-stroke-color', $color);

        if (isset($strokeData['width']) && ! empty($strokeData['width'])) {
            $this->setDeclaration('-webkit-text-stroke-width', $strokeData['width']);
            $this->setDeclaration('text-stroke-width', $strokeData['width']);
        }

        $this->setCss($this->declarations);

        return $this->css;
    }
}
