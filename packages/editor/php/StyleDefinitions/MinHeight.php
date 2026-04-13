<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\WidthDefinitionTrait;

class MinHeight extends BaseStyleDefinition {

    use WidthDefinitionTrait;

    public function getCssProperty(): string {

        return 'min-height';
    }
}
