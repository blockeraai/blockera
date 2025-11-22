<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\CustomStyle;

class Order extends BaseStyleDefinition implements CustomStyle {

    protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'order' !== $cssProperty) {

            return $declaration;
        }

        $orderType = $setting['order'];

        switch ($orderType) {
            case 'first':
                $this->setDeclaration('order', '-1');
                break;

            case 'last':
                $this->setDeclaration('order', '100');
                break;

            case 'custom':
                $this->setDeclaration('order', $setting['custom'] ? blockera_get_value_addon_real_value($setting['custom']) : '100');
                break;
        }

        $this->setCss($this->declarations);

        return $this->css;
    }

	/**
     * @inheritDoc
     *
     * @param array  $settings
     * @param string $settingName
     * @param string $cssProperty
     *
     * @return array
     */
    public function getCustomSettings( array $settings, string $settingName, string $cssProperty): array {

        $settings                  = blockera_get_sanitize_block_attributes($settings);
		$currentBreakpointSettings = $this->getCurrentBreakpointSettings();

        if (isset($settings['value']) && 'custom' === $settings['value'] && 'order' === $cssProperty) {

            $setting = [
                [
                    'isVisible'  => true,
                    'type'       => $cssProperty,
                    $cssProperty => $currentBreakpointSettings['blockeraFlexChildOrder']['value'] ?? $currentBreakpointSettings['blockeraFlexChildOrder'] ?? 'custom',
                    'custom'     => $currentBreakpointSettings['blockeraFlexChildOrderCustom']['value'] ?? $currentBreakpointSettings['blockeraFlexChildOrderCustom'] ?? '',
                ],
            ];

        } else {

            $setting = [
                [
                    'isVisible'  => true,
                    'type'       => $cssProperty,
                    $cssProperty => $settings['value'] ?? [],
                ],
            ];
        }

        return $setting;
    }
}
