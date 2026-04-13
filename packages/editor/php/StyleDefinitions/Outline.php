<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class Outline extends BaseStyleDefinition implements Repeater {

    /**
     * @inheritDoc
     *
     * @param array $setting
     *
     * @return array
     */
    protected function css( array $setting): array {

        if ( ! isset( $setting['type'] ) || 'outline' !== $setting['type'] ) {
            return [];
        }

        $cssProperty = $setting['type'];

        if ( ! isset( $setting[ $cssProperty ] ) || '' === $setting[ $cssProperty ] ) {
            return [];
        }

        $sortedOutlines = blockera_get_sorted_repeater( $setting[ $cssProperty ] );

        if ( ! is_array( $sortedOutlines ) ) {
            return [];
        }

        $count      = count( $sortedOutlines );
        $firstValid = null;

        for ( $i = 0; $i < $count; $i++ ) {
            if ( isset( $sortedOutlines[ $i ]['isVisible'] ) && '' !== $sortedOutlines[ $i ]['isVisible'] ) {
                $firstValid = $sortedOutlines[ $i ];
                break;
            }
        }

        if ( null === $firstValid || ! isset( $firstValid['border'] ) ) {
            return [];
        }

        $border       = $firstValid['border'];
        $width        = $border['width'] ?? '';
        $style        = $border['style'] ?? '';
        $color        = isset( $border['color'] ) && '' !== $border['color'] ? blockera_get_value_addon_real_value( $border['color'] ) : '';
        $outlineValue = $width . ' ' . $style . ' ' . $color;

        $this->declarations['outline'] = $outlineValue;

        if ( isset( $firstValid['offset'] ) && '' !== $firstValid['offset'] ) {
            $this->declarations['outline-offset'] = blockera_get_value_addon_real_value( $firstValid['offset'] );
        }

        $this->setCss( $this->declarations );

        return $this->css;
    }

    /**
     * Check if the setting is valid.
     *
     * @param array $setting The setting.
     *
     * @return bool true if the setting is valid, false otherwise.
     */
    public function isValidSetting( array $setting): bool {

        return isset( $setting['isVisible'] ) && '' !== $setting['isVisible'];
    }
}
