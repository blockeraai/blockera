<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;
use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;

class MaxHeight extends BaseStyleDefinition implements StandardDefinition {

    use SimpleDefinitionTrait;

    public function getCssProperty(): string {

        return 'max-height';
    }
}
