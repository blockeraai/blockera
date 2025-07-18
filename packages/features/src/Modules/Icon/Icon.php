<?php

namespace Blockera\Features\Modules\Icon;

use Blockera\Utils\Adapters\DomParser;
use Blockera\Features\Traits\Singleton;
use Blockera\Features\Contracts\FeatureInterface;

class Icon implements FeatureInterface {

    use Singleton;

	/**
	 * Store the configuration.
	 *
	 * @var array $config The configuration.
	 */
	protected array $config;

	/**
	 * Store the edit block html instance.
	 *
	 * @var EditBlockHTML $edit_block_html The edit block html instance.
	 */
	protected EditBlockHTML $edit_block_html;

    public function register(): void {
		
		$config_file = __DIR__ . '/icon.schema.json';

		if (! file_exists($config_file)) {
			return;
		}

		$this->config = json_decode(file_get_contents($config_file), true);
    }

    public function boot(): void {

        $this->edit_block_html = new EditBlockHTML( $this->config['blocks'] ?? [] );
    }

    public function isEnabled(): bool {
        
		return true;
    }

	/**
	 * Manipulate the html of document.
	 *
	 * @param DomParser $dom_parser the dom parser of document.
	 * @param array     $data the data of document.
	 *
	 * @return string the manipulated html.
	 */
	public function htmlManipulate( DomParser $dom_parser, array $data ): string {
		
		// Get the html of the document.
		$html = $data['origin_html'] ?? '';

		// If icon feature is experimental, check if it's enabled.
		if (isset($data['experimental-features-status']['icon']) && ! $data['experimental-features-status']['icon']) {
			
			return $html;
		}

		return $this->edit_block_html->htmlManipulate( $html, $data );
	}
}
