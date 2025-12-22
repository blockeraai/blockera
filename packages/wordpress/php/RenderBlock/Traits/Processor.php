<?php

namespace Blockera\WordPress\RenderBlock\Traits;

use Blockera\WordPress\RenderBlock\HTMLProcessor;

trait Processor {

	/**
	 * Store the HTML processor object.
	 *
	 * @var HTMLProcessor $html_processor The HTML processor object.
	 */
	protected HTMLProcessor $html_processor;

	/**
	 * Store the blocks order.
	 *
	 * @var array $blocks_order the blocks order array.
	 */
	protected static array $blocks_order = [];

	/**
	 * Store the processed html.
	 *
	 * @var array $processed_html the processed html array.
	 */
	protected static array $processed_html = [];

	/**
	 * Store the generated css.
	 *
	 * @var array $generated_css the generated css array.
	 */
	protected static array $generated_css = [];

	/**
	 * Store the is doing transpiling loop flag property.
	 *
	 * @var bool $is_doing_transpile_loop
	 */
	protected bool $is_doing_transpile_loop = false;

	/**
	 * The classname for the transpiled block.
	 *
	 * @var string
	 */
	protected string $transpile_classname = 'be-transpiled';

	/**
     * Store styles.
     *
     * @var array
     */
    protected array $styles = [];

	/**
	 * Store inline styles collected from the block html.
	 *
	 * @var string $inline_styles the inline styles string.
	 */
	protected string $inline_styles = '';

	/**
	 * Set the HTML processor object.
	 *
	 * @param HTMLProcessor $html_processor The HTML processor object.
	 *
	 * @return void
	 */
	public function setHtmlProcessor( HTMLProcessor $html_processor): void {
		$this->html_processor = $html_processor;
	}

	/**
	 * Update the processed html.
	 *
	 * @param string $html the html to update.
	 *
	 * @return void
	 */
	protected function updateProcessedHTML( string $html): void {
		static::$processed_html[]['origin'] = $html;
	}

	/**
	 * Get the processed html.
	 *
	 * @return void
	 */
	public static function resetProcessedHTML(): void {
		static::$processed_html = [];
	}

	/**
	 * Reset the generated css.
	 *
	 * @return void
	 */
	public static function resetGeneratedCSS(): void {
		static::$generated_css = [];
	}

	/**
	 * Update the generated css.
	 *
	 * @param string $css The css to update.
	 *
	 * @return void
	 */
	public function updateGeneratedCSS( string $css): void {
		self::$generated_css[] = $css;
	}

	/**
	 * Get the generated css.
	 *
	 * @return array The generated css.
	 */
	public function getGeneratedCSS(): array {
		return static::$generated_css;
	}

	/**
	 * Get the styles.
	 *
	 * @return string the styles string.
	 */
	public function getStyles(): string {
		return implode(PHP_EOL, array_unique($this->styles));
	}

	/**
	 * Cleanup the html and inline styles.
	 *
	 * @param string $html The html to cleanup.
	 * @param string $classname The classname to cleanup.
	 *
	 * @return string The cleaned html.
	 */
	protected function cleanup( string $html, string $classname, string $unique_selector): string {
		// TODO: wrap the selector with :where() to ensure it has highest specificity than Blockera styles.
		$selector = $unique_selector;
		$html     = $this->html_processor->updateWrapperClassname($html, $classname);

		$this->html_processor->setRootSelector($selector);
		
		[
			'html' => $html, // Replace html with the updated html.
			'css' => $css,
		] = $this->html_processor->cleanupHTML($html, $this->global_css_props_classes);	

		$this->inline_styles = $css;

		return $html;
	}

	/**
	 * Replace the processed html with the placeholders.
	 *
	 * @param string $html The html to replace the placeholders.
	 *
	 * @return string The html with the placeholders replaced.
	 */
	protected function replaceHTML( string $html): string {
		foreach (static::$processed_html as $key => $processed_html) {
			$replace_data                                  = $this->html_processor->replaceHtmlWithPlaceholder($html, $processed_html['origin']);
			static::$processed_html[ $key ]['placeholder'] = $replace_data['placeholder'];
			$html = $replace_data['html'];
		}

		return $html;
	}

	/**
	 * Replace the placeholders with the processed html.
	 *
	 * @param string $html The html to replace the placeholders.
	 *
	 * @return string The html with the placeholders replaced.
	 */
	protected function replacePlaceholders( string $html): string {
		foreach (static::$processed_html as $processed_html) {
			$html = $this->html_processor->replacePlaceholderWithHtml($html, $processed_html['origin'], $processed_html['placeholder']);
		}

		return $html;
	}
}
