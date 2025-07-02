<?php

namespace Blockera\Features\Modules\Icon;

use Blockera\Features\Traits\Singleton;
use Blockera\Features\Contracts\FeatureInterface;
use Blockera\Features\Contracts\EditableBlockHTML;

class Icon implements FeatureInterface, EditableBlockHTML {

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
	 * Manipulate the html of the block.
	 *
	 * @param array $data the data of the block.
	 *
	 * @return string the manipulated html.
	 */
	public function htmlManipulate( array $data ): string {
		
		// If icon feature is experimental, check if it's enabled.
		if (isset($data['experimental-features-status']['icon']) && ! $data['experimental-features-status']['icon']) {
			
			return $data['html'] ?? '';
		}

		return $this->edit_block_html->htmlManipulate( $data );
	}
}
