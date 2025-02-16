<?php 

class Render {

	/**
	 * Render block icon element.
	 *
	 * @param string $html   The block html output.
	 * @param Parser $parser The block parser instance.
	 * @param array  $args   The extra arguments to render block icon element.
	 *
	 * @throws BindingResolutionException|BaseException Exception for binding parser service into app container problems.
	 * @return string The block html include icon element if icon is existing.
	 */
	protected function renderIcon( string $html, Parser $parser, array $args ): string {

		// blockera active experimental icon extension?
		$is_enable_icon_extension = blockera_get_experimental( [ 'editor', 'extensions', 'iconExtension' ] );

		// phpcs:disable
		// TODO: add into cache mechanism.
		//manipulation HTML of block content
		if ( $is_enable_icon_extension ) {

			$dom = $this->app->make(DomParser::class)::str_get_html($html);

			[
				'block'             => $block,
				'unique_class_name' => $uniqueClassname,
			] = $args;

			$selector     = $this->getSelector( $block );
			$blockElement = $dom->findOne( $selector );

			// add unique classname into block element.
			// phpcs:ignore
			$blockElement->classList->add( $uniqueClassname );

			$iconCustomizer = $this->app->make( Icon::class );
			$iconCustomizer->manipulate( compact( 'block', 'blockElement' ) );

			//retrieve final html of block content
			$html = preg_replace( [ '/(<[^>]+) style=".*?"/i', '/wp-block-\w+__(\w+|\w+-\w+)-\d+(\w+|%)/i' ], [ '$1', '' ], $dom->html() );
		}

		// phpcs:enable

		return $html;
	}
}