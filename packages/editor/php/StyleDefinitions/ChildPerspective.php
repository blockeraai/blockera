<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class ChildPerspective extends BaseStyleDefinition {

    protected function css( array $setting): array {

        if (! isset($setting['type'])) {
            return [];
        }

        $cssProperty = $setting['type'];

        if ('child-perspective' !== $cssProperty || ! isset($setting[ $cssProperty ])) {
            return [];
        }

        $settingValue = $setting[ $cssProperty ];

        if ('' === $settingValue || null === $settingValue) {
            return [];
        }

        $childPerspective = blockera_get_value_addon_real_value($settingValue);

        if ('' !== $childPerspective && null !== $childPerspective) {
            $this->declarations['perspective'] = '0px' !== $childPerspective ? $childPerspective : 'none';
            $this->setCss($this->declarations);
        }

        return $this->css;
    }
}
