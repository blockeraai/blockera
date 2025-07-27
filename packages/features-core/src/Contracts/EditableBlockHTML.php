<?php

namespace Blockera\Features\Core\Contracts;

interface EditableBlockHTML {

    /**
     * The html manipulate method.
     *
     * @param string $html The html to manipulate.
     * @param array  $data The data to manipulate.
     *
     * @return string The manipulated html.
     */
    public function htmlManipulate( string $html, array $data): string;
}
