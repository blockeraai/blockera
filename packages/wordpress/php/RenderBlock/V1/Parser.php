<?php

namespace Blockera\WordPress\RenderBlock\V1;

use Blockera\Editor\StyleEngine;
use Blockera\Bootstrap\Application;
use Illuminate\Contracts\Container\BindingResolutionException;
use Blockera\SiteBuilder\StyleEngine as SiteBuilderStyleEngine;

/**
 * Class Parser after parsing block details manipulating html and css on WordPress core blocks.
 *
 * @package Parser
 */
class Parser {

    /**
     * Hold the Application class instance.
     *
     * @var Application $app
     */
    protected Application $app;

	/**
	 * Store the supports.
	 *
	 * @var array $supports
	 */
	protected array $supports;

    /**
     * The Parser class constructor.
     *
     * @param Application $app The application container object.
     */
    public function __construct( Application $app) { 
        $this->app = $app;
    }

	/**
	 * Set the supports.
	 *
	 * @param array $supports The supports.
	 *
	 * @return void
	 */
	public function setSupports( array $supports): void {

		$this->supports = apply_filters(
			'blockera.render.block.supports',
			$supports,
			$this->app
		);
	}

    /**
     * Retrieve combine css of current block.
     *
     * @param array $params The params array includes block and block selector.
     *
     * @throws BindingResolutionException The BindingResolutionException for not bonded object.
     *
     * @return string string of css styles.
     */
    public function getCss( array $params): string {

        [
            'block'             => $block,
            'unique_class_name' => $fallbackSelector,
        ] = $params;

        /**
         * Describe type of variable.
         *
         * @var StyleEngine $styleEngine The style-engine object.
         */
        $styleEngine = $this->app->make(class_exists(SiteBuilderStyleEngine::class) ? SiteBuilderStyleEngine::class : StyleEngine::class, compact('block', 'fallbackSelector'));
		$styleEngine->setSupports($this->supports);

        return $styleEngine->getStylesheet();
    }
}
