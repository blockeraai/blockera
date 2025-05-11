<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;

/**
 * Class MixBlendMode definition to generate css rules.
 *
 * @package MixBlendMode
 */
class MixBlendMode extends BaseStyleDefinition {

    use SimpleDefinitionTrait;

    public function getCssProperty(): string {

        return 'mix-blend-mode';
    }
}
