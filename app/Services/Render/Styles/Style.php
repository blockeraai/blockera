<?php

namespace Publisher\Framework\Services\Render\Styles;

use Publisher\Framework\Services\Render\Styles\Contracts\Styler;
use \Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions\Contracts\Style as StyleDefinition;

/**
 * The default chaining behavior can be implemented inside a base Style class.
 */
abstract class Style implements Styler {

	/**
	 * @var Styler|null
	 */
	private $nextStyler = null;

	/**
	 * @var array
	 */
	protected array $css = [];

	/**
	 * @var StyleDefinition
	 */
	protected StyleDefinition $definition;

	/**
	 * @param StyleDefinition $styleDefinition
	 */
	public function __construct( StyleDefinition $styleDefinition ) {

		$this->definition = $styleDefinition;
	}

	public function setNext( Styler $styler ): Styler {

		$this->nextStyler = $styler;

		return $styler;
	}

	public function style( array $request ): ?array {

		if ( $this->nextStyler ) {
			return $this->nextStyler->style( $request );
		}

		return null;
	}

	public function getCss(): array {

		return $this->css;
	}

}
