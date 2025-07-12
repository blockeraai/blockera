<?php

namespace Blockera\Setup\Tests;

class FunctionsTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	public function testItShouldFilterEmptyArrayItems(): void {

		$this->assertSame(
			[
				1,
				5,
			],
			array_values(
				array_filter( [
					1,
					0,
					5,
					[],
					''
				], 'blockera_get_filter_empty_array_item' )
			)
		);
	}

	public function testItShouldRetrieveFlatArray(): void {
		// Test case 1: Basic two-level array.
		$this->assertSame(
			[
				'a'  => 1,
				'b'  => 2,
				'c'  => 3,
				'd'  => 4,
				'e'  => 5,
				'aa' => 1,
				'bb' => 2,
				'cc' => 3,
				'dd' => 4,
				'ee' => 5,
			],
			blockera_array_flat([
				[
					'a' => 1,
					'b' => 2,
					'c' => 3,
					'd' => 4,
					'e' => 5,
				],
				[
					'aa' => 1,
					'bb' => 2,
					'cc' => 3,
					'dd' => 4,
					'ee' => 5,
				]
			])
		);

		// Test case 2: Empty array.
		$this->assertSame(
			[],
			blockera_array_flat([])
		);

		// Test case 3: Single array.
		$this->assertSame(
			['a' => 1, 'b' => 2],
			blockera_array_flat([['a' => 1, 'b' => 2]])
		);

		// Test case 4: Array with numeric keys.
		$this->assertSame(
			[1, 2, 3, 4, 5, 6],
			blockera_array_flat([[1, 2, 3], [4, 5, 6]])
		);

		// Test case 5: Mixed keys.
		$this->assertSame(
			[
				0 => 'value1',
				'key1' => 'value2',
				1 => 'value3',
				'key2' => 'value4'
			],
			blockera_array_flat([
				['value1', 'key1' => 'value2'],
				['value3', 'key2' => 'value4']
			])
		);

		// Test case 6: Nested arrays.
		$this->assertSame(
			[
				'.wp-block-list > li.blockera-block.blockera-block-bzarxt a:not(.wp-element-button):before' => [
					'margin-right' => '22px !important',
					'content' => '"Before "',
					'color' => '#0feb0b !important',
				]
			],
			blockera_array_flat([
				[
					'.wp-block-list > li.blockera-block.blockera-block-bzarxt a:not(.wp-element-button):before' => [
						'color' => '#0feb0b !important',
						'content' => '"Before "'
					]
				],
				[
					'.wp-block-list > li.blockera-block.blockera-block-bzarxt a:not(.wp-element-button):before' => [
						'margin-right' => '22px !important',
						'content' => '"Before "'
					]
				]
			])
		);
	}

	/**
	 * @dataProvider coreConfigDataProvider
	 *
	 * @param string $path
	 * @param        $expected
	 *
	 * @return void
	 */
	public function testItShouldRetrieveConfigValueWithName( string $path, $expected ): void {

		$this->assertSame( $expected, blockera_core_config( $path ) );
	}

	public function coreConfigDataProvider(): array {

		$rootDir = trailingslashit( dirname( __PACKAGES_DIR__ ) );
		$theme   = wp_get_theme();
		$home    = trailingslashit( home_url() );

		return [
			[
				'path'     => 'app.root_url',
				'expected' => $home . 'wp-content/plugins/blockera/',
			],
			[
				'path'     => 'app.root_path',
				'expected' => $rootDir,
			],
			[
				'path'     => 'app.version',
				'expected' => BLOCKERA_SB_VERSION,
			],
			[
				'path'     => 'app.namespaces.controllers',
				'expected' => '\Blockera\Setup\Http\Controllers\\',
			],
			[
				'path'     => 'app.providers',
				'expected' => [
					\Blockera\Admin\Providers\AdminProvider::class,
					\Blockera\Setup\Providers\EditorAssetsProvider::class,
					\Blockera\Setup\Providers\RestAPIProvider::class,
					\Blockera\Setup\Providers\AppServiceProvider::class,
					\Blockera\Editor\Providers\StyleDefinitionsProvider::class,
					\Blockera\Admin\Providers\AdminAssetsProvider::class,
				],
			],
			[
				'path'     => 'app.debug',
				'expected' => false,
			],
			[
				'path'     => 'breakpoints.list.desktop',
				'expected' => [
					'type'       => 'desktop',
					'base'       => true,
					'status'     => true,
					'label'      => __( 'Desktop', 'blockera' ),
					'settings'   => [
						'min' => '',
						'max' => '',
						'picked' => true,
						'iconType' => 'library',
						'icon' => [
							'icon' => 'device-desktop',
							'library' => 'ui',
							'uploadSVG' => '',
						],
					],
					'attributes' => [],
					'deletable' => false,
					'isDefault' => true,
				],
			],
			[
				'path'     => 'entities.theme.name',
				'expected' => [
					'raw'      => $theme->template,
					'rendered' => $theme->get( 'Name' )
				],
			],
			[
				'path'     => 'entities.theme.version',
				'expected' => $theme->get( 'Version' ),
			],
			[
				'path'     => 'entities.theme.block_theme',
				'expected' => $theme->is_block_theme(),
			],
			[
				'path'     => 'entities.theme.parent',
				'expected' => $theme->get( 'parent' ),
			],
			[
				'path'     => 'entities.site.url',
				'expected' => home_url(),
			],
		];
	}

	public function testItShouldRetrieveEnvVariableEqualsWithExpectedValue() {

		$this->assertSame(
			[
				'version'    => blockera_core_config( 'app.version' ),
				'mode'       => blockera_core_config( 'app.debug' ) ? 'development' : 'production',
				'everything' => 'blockera',
			],
			[
				'version'    => blockera_core_env( 'VERSION' ),
				'mode'       => blockera_core_env( 'APP_MODE' ),
				'everything' => blockera_core_env( 'EVERYTHING', 'blockera' ),
			]
		);
	}

	public function testItShouldRetrieveRealValueOfRecievedValueAddon(): void {

		$this->assertSame(
			'var(--wp--preset--color--contrast-2)',
			blockera_get_value_addon_real_value(
				[
					'settings'     => [
						'name'      => 'Contrast / Two',
						'id'        => 'contrast-2',
						'value'     => '#636363',
						'reference' => [ 'type' => 'theme', 'theme' => 'Twenty Twenty-Four', ],
						'type'      => 'color',
						'var'       => '--wp--preset--color--contrast-2',
					],
					'name'         => 'Contrast / Two',
					'isValueAddon' => true,
					'valueType'    => 'variable',
				]
			)
		);
	}

	/**
	 * @dataProvider sortingRepeaterDataProviders
	 *
	 * @param array $items
	 * @param array $expected
	 *
	 * @return void
	 */
	public function testItShouldRetrieveSortedRepeaterItemsEqualsWithExpectedValue( array $items, array $expected ): void {

		$this->assertSame(
			$expected,
			blockera_get_sorted_repeater( $items ),
		);
	}

	public function sortingRepeaterDataProviders() {

		return require __DIR__ . '/Fixtures/Functions/sorted-repeater-items.php';
	}

	/**
	 * @dataProvider dataProvider
	 *
	 * @param array $asset
	 *
	 * @return void
	 */
	public function test_blockera_get_value_addon_real_value( array $asset ): void {

		$actual = blockera_get_value_addon_real_value( $asset['input'] );

		$this->assertEquals(
			$asset['output'],
			$actual
		);
	}

	public function dataProvider(): array {

		return [
			[
				[
					'input'  => '',
					'output' => '',
				],
			],
			[
				[
					'input'  => 12,
					'output' => 12,
				],
			],
			[
				[
					'input'  => 'test',
					'output' => 'test',
				],
			],
			[
				[
					'input'  => '12px',
					'output' => '12px',
				],
			],
			[
				[
					'input'  => '12pxfunc',
					'output' => '12px',
				],
			],
			[
				[
					'input'  => 'func',
					'output' => '',
				],
			],
			[
				[
					'input'  => '12',
					'output' => '12',
				],
			],
		];
	}
}
