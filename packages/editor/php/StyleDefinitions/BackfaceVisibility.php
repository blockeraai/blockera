<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;
use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;

class BackfaceVisibility extends BaseStyleDefinition {

    use SimpleDefinitionTrait;

    public function getCssProperty(): string {

        return 'backface-visibility';
    }
}
