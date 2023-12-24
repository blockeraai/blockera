<?php

namespace Publisher\Framework\Services\Render;

/**
 * External
 */

use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Internal
 */

use Publisher\Framework\Exceptions\BaseException;
use Publisher\Framework\Services\Render\Blocks\Icon;
use Publisher\Framework\Illuminate\Foundation\Application;
use Publisher\Framework\Services\Render\Styles\BorderStyle;
use Publisher\Framework\Services\Render\Styles\EffectsStyle;
use Publisher\Framework\Services\Render\Styles\LayoutStyle;
use Publisher\Framework\Services\Render\Styles\OutlineStyle;
use Publisher\Framework\Services\Render\Styles\BoxShadowStyle;
use Publisher\Framework\Services\Render\Styles\BackgroundStyle;
use Publisher\Framework\Services\Render\Styles\PositionStyle;
use Publisher\Framework\Services\Render\Styles\SizeStyle;
use Publisher\Framework\Services\Render\Styles\SpacingStyle;
use Publisher\Framework\Services\Render\Styles\Style;
use Publisher\Framework\Services\Render\Styles\TextShadowStyle;
use Publisher\Framework\Services\Render\Styles\TypographyStyle;
use Publisher\Framework\Services\Render\Styles\MouseStyle;

class Parser {

	/**
	 * hold the Application class instance
	 *
	 * @var Application $app
	 */
	protected Application $app;

	protected array $stylesMap = [
		'size'              => [
			'publisherWidth',
			'publisherHeight',
			'publisherMinWidth',
			'publisherMinHeight',
			'publisherMaxWidth',
			'publisherMaxHeight',
			'publisherOverflow',
			'publisherRatio',
			'publisherFit',
			'publisherFitPosition',
		],
		'effects'           => [
			'publisherCursor',
			'publisherFilter',
			'publisherOpacity',
			'publisherBlendMode',
			'publisherTransform',
			'publisherTransition',
			'publisherBackdropFilter',
		],
		'background'        => [
			'publisherBackground',
			'publisherBackgroundClip',
			'publisherBackgroundColor',
		],
		'typography'        => [
			'publisherFontSize',
			'publisherFontColor',
			'publisherTextAlign',
			'publisherFontStyle',
			'publisherDirection',
			'publisherWordBreak',
			'publisherLineHeight',
			'publisherTextIndent',
			'publisherWordSpacing',
			'publisherTextColumns',
			'publisherTextTransform',
			'publisherLetterSpacing',
			'publisherTextDecoration',
			'publisherTextOrientation',
			'publisherTextStroke',
		],
		'border-and-shadow' => [
			'publisherBorder',
			'publisherBorderRadius',
		],
		'position'          => [
			'publisherZIndex',
			'publisherPosition',
		],
		'layout'            => [
			'publisherGap',
			'publisherDisplay',
			'publisherFlexWrap',
			'publisherAlignItems',
			'publisherAlignContent',
			'publisherFlexDirection',
			'publisherJustifyContent',
			'publisherFlexChildAlign',
			'publisherFlexChildOrder',
			'publisherFlexChildSizing',
		],
		'mouse'            => [
			'publisherCursor',
			'publisherUserSelect',
			'publisherPointerEvents', 
		]
	];

	/**
	 * @param Application $app
	 */
	public function __construct( Application $app ) {

		$this->app = $app;
	}

	/**
	 * Retrieve combine css of current block.
	 *
	 * @param array $params {
	 *
	 * @throws BindingResolutionException
	 * @throws BaseException
	 * @return array array of css styles
	 */
	public function getCss( array $params ): array {

		[
			'block'           => $block,
			'uniqueClassname' => $uniqueClassname,
		] = $params;

		/**
		 * @var Render $block
		 */
		$render = $this->app->make( Render::class, [ 'blockName' => $block['blockName'] ] );

		$attributes = $block['attrs'];
		$selector   = $render->getSelector( $block, $uniqueClassname );


		//Stylers
		{
			$size            = $this->app->make( SizeStyle::class );
			$layout          = $this->app->make( LayoutStyle::class );
			$borderAndShadow = $this->app->make( BorderStyle::class );
			$outline         = $this->app->make( OutlineStyle::class );
			$effects         = $this->app->make( EffectsStyle::class );
			$spacing         = $this->app->make( SpacingStyle::class );
			$position        = $this->app->make( PositionStyle::class );
			$boxShadow       = $this->app->make( BoxShadowStyle::class );
			$typography      = $this->app->make( TypographyStyle::class );
			$textShadow      = $this->app->make( TextShadowStyle::class );
			$background      = $this->app->make( BackgroundStyle::class );
			$mouse           = $this->app->make( MouseStyle::class );
		}

		/**
		 * Create Chain of Styles 💡
		 * @var SizeStyle       $size
		 * @var LayoutStyle     $layout
		 * @var EffectsStyle    $effects
		 * @var SpacingStyle    $spacing
		 * @var OutlineStyle    $outline
		 * @var PositionStyle   $position
		 * @var BoxShadowStyle  $boxShadow
		 * @var TextShadowStyle $textShadow
		 * @var TypographyStyle $typography
		 * @var BackgroundStyle $background
		 * @var BorderStyle     $borderAndShadow
		 * @var MouseStyle      $mouse
		 */
		$textShadow
			->setNext( $size )
			->setNext( $layout )
			->setNext( $effects )
			->setNext( $spacing )
			->setNext( $outline )
			->setNext( $position )
			->setNext( $boxShadow )
			->setNext( $background )
			->setNext( $typography )
			->setNext( $borderAndShadow )
			->setNext( $mouse );

		//Usage of Styles
		{
			$setting = compact( 'attributes', 'selector' );

			$this->setGroupStyle( $setting, $size, 'size' );
			$this->setGroupStyle( $setting, $layout, 'layout' );
			$this->setGroupStyle( $setting, $effects, 'effects' );
			$this->setGroupStyle( $setting, $position, 'position' );
			$this->setGroupStyle( $setting, $background, 'background' );
			$this->setGroupStyle( $setting, $typography, 'typography' );
			$this->setGroupStyle( $setting, $borderAndShadow, 'border-and-shadow' );
			$this->setGroupStyle( $setting, $mouse, 'mouse' );

			$spacing->style( $setting );
			$outline->style( $setting );
			$boxShadow->style( $setting );
			$textShadow->style( $setting );
		}

		return array_merge(
			$typography->getCss(),
			$textShadow->getCss(),
			$background->getCss(),
		);
	}

	/**
	 * handle shared parsers in between all blocks!
	 *
	 * @param array $params {
	 *
	 * @throws BindingResolutionException
	 * @throws BaseException
	 * @return void
	 */
	public function customizeHTML( array $params ) {

		[
			'dom'             => $dom,
			'block'           => $block,
			'uniqueClassname' => $uniqueClassname,
		] = $params;

		/**
		 * @var Render $block
		 */
		$render = $this->app->make( Render::class, [ 'blockName' => $block['blockName'] ] );

		$selector     = $render->getSelector( $block );
		$blockElement = $dom->findOne( $selector );

		//add unique classname into block element
		$blockElement->classList->add( $uniqueClassname );

		//Block Instances
		{
			$iconCustomizer = $this->app->make( Icon::class );
		}

		/**
		 * TODO: Create Chain of HTML Customizers 💡
		 * @var Icon $iconCustomizer
		 */

		//Usage
		{
			$iconCustomizer->manipulate( compact( 'block', 'blockElement' ) );
		}
	}

	/**
	 * @param array  $settings
	 * @param Style  $styleInstance
	 * @param string $styleName
	 */
	protected function setGroupStyle( array $settings, Style $styleInstance, string $styleName ): void {

		foreach ( $this->stylesMap[ $styleName ] as $style ) {

			if ( empty( $style ) ) {

				continue;
			}

			$styleInstance->style(
				array_merge(
					$settings,
					[
						'key' => $style,
					]
				)
			);
		}
	}

}
