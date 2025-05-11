<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;
use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;
use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;

class BackfaceVisibility extends BaseStyleDefinition implements StandardDefinition {

    use SimpleDefinitionTrait;

    public function getCssProperty(): string {

        return 'backface-visibility';
    }
}
