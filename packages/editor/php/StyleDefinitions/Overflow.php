<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Traits\SimpleDefinitionTrait;

class Overflow extends BaseStyleDefinition {

    use SimpleDefinitionTrait;

    public function getCssProperty(): string {

        return 'overflow';
    }
}
