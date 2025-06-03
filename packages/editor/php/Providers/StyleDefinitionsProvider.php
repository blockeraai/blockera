<?php

namespace Blockera\Editor\Providers;

use Blockera\Bootstrap\Application;
use Blockera\Bootstrap\ServiceProvider;

/**
 * The StyleDefinitionsProvider class.
 *
 * @package Blockera\Editor\Providers\StyleDefinitionsProvider
 */
class StyleDefinitionsProvider extends ServiceProvider {

    /**
     * Registration Styles with Definitions.
     *
     * @return void
     */
    public function register(): void {
        $styleDefinitions = [
            'AspectRatio' => \Blockera\Editor\StyleDefinitions\AspectRatio::class,
			'BackdropFilter' => \Blockera\Editor\StyleDefinitions\BackdropFilter::class,
            'Background' => \Blockera\Editor\StyleDefinitions\Background::class,
            'BackgroundClip' => \Blockera\Editor\StyleDefinitions\BackgroundClip::class,
            'BackgroundColor' => \Blockera\Editor\StyleDefinitions\BackgroundColor::class,
            'Border' => \Blockera\Editor\StyleDefinitions\Border::class,
            'BorderRadius' => \Blockera\Editor\StyleDefinitions\BorderRadius::class,
            'BoxShadow' => \Blockera\Editor\StyleDefinitions\BoxShadow::class,
            'BoxSizing' => \Blockera\Editor\StyleDefinitions\BoxSizing::class,
            'Color' => \Blockera\Editor\StyleDefinitions\Color::class,
            'Direction' => \Blockera\Editor\StyleDefinitions\Direction::class,
            'Display' => \Blockera\Editor\StyleDefinitions\Display::class,
            'Divider' => \Blockera\Editor\StyleDefinitions\Divider::class,
            'Filter' => \Blockera\Editor\StyleDefinitions\Filter::class,
            'FlexDirection' => \Blockera\Editor\StyleDefinitions\FlexDirection::class,
            'FlexWrap' => \Blockera\Editor\StyleDefinitions\FlexWrap::class,
            'FontFamily' => \Blockera\Editor\StyleDefinitions\FontFamily::class,
            'FontSize' => \Blockera\Editor\StyleDefinitions\FontSize::class,
            'FontWeight' => \Blockera\Editor\StyleDefinitions\FontWeight::class,
            'Gap' => \Blockera\Editor\StyleDefinitions\Gap::class,
            'Height' => \Blockera\Editor\StyleDefinitions\Height::class,
            'LetterSpacing' => \Blockera\Editor\StyleDefinitions\LetterSpacing::class,
            'LineHeight' => \Blockera\Editor\StyleDefinitions\LineHeight::class,
            'Mask' => \Blockera\Editor\StyleDefinitions\Mask::class,
            'MaxHeight' => \Blockera\Editor\StyleDefinitions\MaxHeight::class,
            'MaxWidth' => \Blockera\Editor\StyleDefinitions\MaxWidth::class,
            'MinHeight' => \Blockera\Editor\StyleDefinitions\MinHeight::class,
            'MinWidth' => \Blockera\Editor\StyleDefinitions\MinWidth::class,
            'MixBlendMode' => \Blockera\Editor\StyleDefinitions\MixBlendMode::class,
            'ObjectFit' => \Blockera\Editor\StyleDefinitions\ObjectFit::class,
            'ObjectPosition' => \Blockera\Editor\StyleDefinitions\ObjectPosition::class,
            'Opacity' => \Blockera\Editor\StyleDefinitions\Opacity::class,
            'Overflow' => \Blockera\Editor\StyleDefinitions\Overflow::class,
            'Position' => \Blockera\Editor\StyleDefinitions\Position::class,
            'Spacing' => \Blockera\Editor\StyleDefinitions\Spacing::class,
            'TextAlign' => \Blockera\Editor\StyleDefinitions\TextAlign::class,
            'TextDecoration' => \Blockera\Editor\StyleDefinitions\TextDecoration::class,
            'TextOrientation' => \Blockera\Editor\StyleDefinitions\TextOrientation::class,
            'TextShadow' => \Blockera\Editor\StyleDefinitions\TextShadow::class,
            'TextTransform' => \Blockera\Editor\StyleDefinitions\TextTransform::class,
            'Transform' => \Blockera\Editor\StyleDefinitions\Transform::class,
            'Transition' => \Blockera\Editor\StyleDefinitions\Transition::class,
            'Width' => \Blockera\Editor\StyleDefinitions\Width::class,
            'ZIndex' => \Blockera\Editor\StyleDefinitions\ZIndex::class,
        ];

        foreach ($styleDefinitions as $key => $definition) {
            $this->app->singleton(
                $key,
                function ( Application $app, array $args) use ( $definition) {
                    return new $definition($args['supports']);
                }
            );
        }
    }
}
