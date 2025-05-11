<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;

class MinHeight extends BaseStyleDefinition {

    use SimpleDefinitionTrait;

    public function getCssProperty(): string {

        return 'min-height';
    }
}
