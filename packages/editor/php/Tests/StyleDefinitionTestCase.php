<?php

namespace Blockera\Editor\Tests;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;
use ReflectionMethod;

/**
 * Shared helpers for StyleDefinition css() unit tests.
 *
 * Empty definition id keeps setCss() from resolving block selectors
 * (selector becomes ''), so returned css maps use the '' key.
 */
abstract class StyleDefinitionTestCase extends \Blockera\Dev\PHPUnit\AppTestCase {

	/**
	 * @var class-string<BaseStyleDefinition>
	 */
	protected string $definition_class;

	private ?ReflectionMethod $css_method = null;

	public function set_up(): void {
		parent::set_up();

		if ( ! isset( $this->definition_class ) || '' === $this->definition_class ) {
			$this->fail( static::class . ' must set $definition_class.' );
		}

		$this->css_method = new ReflectionMethod( $this->definition_class, 'css' );
		$this->css_method->setAccessible( true );
	}

	/**
	 * @param array<string, mixed> $supports
	 */
	protected function definition( array $supports = [] ): BaseStyleDefinition {
		$class = $this->definition_class;

		$definition = new $class( $supports );
		$definition->setBreakpoint( 'desktop' );
		$definition->setBlock(
			[
				'blockName' => 'core/group',
				'attrs'     => [],
			]
		);

		return $definition;
	}

	/**
	 * @param array<string, mixed> $setting
	 * @return array<string, mixed>
	 */
	protected function invokeCss( BaseStyleDefinition $definition, array $setting ): array {
		return $this->css_method->invoke( $definition, $setting );
	}

	/**
	 * @param array<string, mixed> $declarations
	 * @return array<string, array<string, mixed>>
	 */
	protected function cssMap( array $declarations ): array {
		return [ '' => $declarations ];
	}

	/**
	 * Standard setting envelope: type + value under that type key.
	 *
	 * @param mixed $value
	 * @return array<string, mixed>
	 */
	protected function typedSetting( string $type, $value ): array {
		return [
			'type' => $type,
			$type  => $value,
		];
	}

	/**
	 * Attach block context (blockName, attrs, etc.) before invoking css().
	 *
	 * @param array<string, mixed> $block
	 * @param array<string, mixed> $supports
	 */
	protected function definitionWithBlock( array $block, array $supports = [] ): BaseStyleDefinition {
		$definition = $this->definition( $supports );
		$definition->setBlock( $block );

		return $definition;
	}
}
