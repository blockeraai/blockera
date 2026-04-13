<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\StandardDefinition;
use Blockera\Editor\StyleDefinitions\Traits\WidthDefinitionTrait;

class MaxHeight extends BaseStyleDefinition {

    use WidthDefinitionTrait;

    public function getCssProperty(): string {

        return 'max-height';
    }
}
