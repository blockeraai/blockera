<?php

namespace Blockera\Feature\Icon;

use Blockera\Bootstrap\Application;
use Blockera\Utils\Adapters\DomParser;
use Blockera\Features\Core\Traits\Singleton;
use Blockera\Features\Core\Traits\ApplicationTrait;
use Blockera\Features\Core\Contracts\FeatureInterface;

class Icon implements FeatureInterface {

    use Singleton, ApplicationTrait;

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

	/**
	 * Register the feature.
	 *
	 * @param Application $app the application instance.
	 * @param array       $args the plugin args.
	 * 
	 * @return void
	 */
    public function register( Application $app, array $args = []): void {

		$this->setApp($app);
		$this->args = $args;
		
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

		$this->args['app'] = $this->app;
		$data              = array_merge($data, $this->args);

		return $this->edit_block_html->htmlManipulate( $html, $data );
	}
}
