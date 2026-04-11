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
        $styleDefinitions = apply_filters(
            'blockera.editor.style.definitions',
            [
				'BackfaceVisibility' => \Blockera\Editor\StyleDefinitions\BackfaceVisibility::class,
				'ChildOrigin' => \Blockera\Editor\StyleDefinitions\ChildOrigin::class,
				'SelfOrigin' => \Blockera\Editor\StyleDefinitions\SelfOrigin::class,
				'ChildPerspective' => \Blockera\Editor\StyleDefinitions\ChildPerspective::class,
				'ColumnCount' => \Blockera\Editor\StyleDefinitions\ColumnCount::class,
				'Content' => \Blockera\Editor\StyleDefinitions\Content::class,
				'AlignContent' => \Blockera\Editor\StyleDefinitions\AlignContent::class,
				'AlignSelf' => \Blockera\Editor\StyleDefinitions\AlignSelf::class,
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
				'GridLayout' => \Blockera\Editor\StyleDefinitions\GridLayout::class,
				'Height' => \Blockera\Editor\StyleDefinitions\Height::class,
				'LetterSpacing' => \Blockera\Editor\StyleDefinitions\LetterSpacing::class,
				'LineHeight' => \Blockera\Editor\StyleDefinitions\LineHeight::class,
				'Mask' => \Blockera\Editor\StyleDefinitions\Mask::class,
				'MaxHeight' => \Blockera\Editor\StyleDefinitions\MaxHeight::class,
				'MaxWidth' => \Blockera\Editor\StyleDefinitions\MaxWidth::class,
				'MinHeight' => \Blockera\Editor\StyleDefinitions\MinHeight::class,
				'MinWidth' => \Blockera\Editor\StyleDefinitions\MinWidth::class,
				'MixBlendMode' => \Blockera\Editor\StyleDefinitions\MixBlendMode::class,
				'Mouse' => \Blockera\Editor\StyleDefinitions\Mouse::class,
				'ObjectFit' => \Blockera\Editor\StyleDefinitions\ObjectFit::class,
				'ObjectPosition' => \Blockera\Editor\StyleDefinitions\ObjectPosition::class,
				'Opacity' => \Blockera\Editor\StyleDefinitions\Opacity::class,
				'Order' => \Blockera\Editor\StyleDefinitions\Order::class,
				'Overflow' => \Blockera\Editor\StyleDefinitions\Overflow::class,
				'Outline' => \Blockera\Editor\StyleDefinitions\Outline::class,
				'WordBreak' => \Blockera\Editor\StyleDefinitions\WordBreak::class,
				'TextIndent' => \Blockera\Editor\StyleDefinitions\TextIndent::class,
				'TextWrap' => \Blockera\Editor\StyleDefinitions\TextWrap::class,
				'Flex' => \Blockera\Editor\StyleDefinitions\Flex::class,
				'Position' => \Blockera\Editor\StyleDefinitions\Position::class,
				'Margin' => \Blockera\Editor\StyleDefinitions\Margin::class,
				'Padding' => \Blockera\Editor\StyleDefinitions\Padding::class,
				'TextAlign' => \Blockera\Editor\StyleDefinitions\TextAlign::class,
				'TextDecoration' => \Blockera\Editor\StyleDefinitions\TextDecoration::class,
				'TextOrientation' => \Blockera\Editor\StyleDefinitions\TextOrientation::class,
				'TextShadow' => \Blockera\Editor\StyleDefinitions\TextShadow::class,
				'TextTransform' => \Blockera\Editor\StyleDefinitions\TextTransform::class,
				'Transform' => \Blockera\Editor\StyleDefinitions\Transform::class,
				'Transition' => \Blockera\Editor\StyleDefinitions\Transition::class,
				'Width' => \Blockera\Editor\StyleDefinitions\Width::class,
				'WebkitTextStrokeColor' => \Blockera\Editor\StyleDefinitions\WebkitTextStrokeColor::class,
				'WebkitTextStrokeWidth' => \Blockera\Editor\StyleDefinitions\WebkitTextStrokeWidth::class,
				'WordSpacing' => \Blockera\Editor\StyleDefinitions\WordSpacing::class,
				'ZIndex' => \Blockera\Editor\StyleDefinitions\ZIndex::class,
			]
        );

        // Pre-build closures array to avoid creating closures in loop (reduces opcode overhead and memory allocations).
        // This eliminates closure creation overhead per iteration and reduces zval refcount operations.
        $definitions_count = count($styleDefinitions);
        $keys              = array_keys($styleDefinitions);
        for ($i = 0; $i < $definitions_count; ++$i) {
            $key        = $keys[ $i ];
            $definition = $styleDefinitions[ $key ];

            $this->app->singleton(
                $key,
                static function ( Application $app, array $args) use ( $definition) {
                    return new $definition($args['supports']);
                }
            );
        }
    }
}
