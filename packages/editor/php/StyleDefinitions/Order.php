<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\CustomStyle;

class Order extends BaseStyleDefinition implements CustomStyle {

    protected function css( array $setting): array {

        if (! isset($setting['type'])) {
            return [];
        }

        $cssProperty = $setting['type'];

        if ('order' !== $cssProperty || ! isset($setting[ $cssProperty ]) || empty($setting[ $cssProperty ])) {
            return [];
        }

        if (! isset($setting['order'])) {
            return [];
        }

        $orderType = $setting['order'];

        if ('first' === $orderType) {
            $this->declarations['order'] = '-1';
        } elseif ('last' === $orderType) {
            $this->declarations['order'] = '100';
        } elseif ('custom' === $orderType) {
            if (isset($setting['custom']) && $setting['custom']) {
                $this->declarations['order'] = blockera_get_value_addon_real_value($setting['custom']);
            } else {
                $this->declarations['order'] = '100';
            }
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

        $settings = blockera_get_sanitize_block_attributes($settings);

        if (isset($settings['value']) && 'custom' === $settings['value'] && 'order' === $cssProperty) {
            $currentBreakpointSettings = $this->getCurrentBreakpointSettings();
            $orderValue                = $currentBreakpointSettings['blockeraFlexChildOrder']['value'] ?? $currentBreakpointSettings['blockeraFlexChildOrder'] ?? 'custom';
            $customValue               = $currentBreakpointSettings['blockeraFlexChildOrderCustom']['value'] ?? $currentBreakpointSettings['blockeraFlexChildOrderCustom'] ?? '';

            return [
                [
                    'isVisible'  => true,
                    'type'       => $cssProperty,
                    $cssProperty => $orderValue,
                    'custom'     => $customValue,
                ],
            ];
        }

        return [
            [
                'isVisible'  => true,
                'type'       => $cssProperty,
                $cssProperty => $settings['value'] ?? [],
            ],
        ];
    }
}
