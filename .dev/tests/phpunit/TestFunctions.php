<?php

namespace Blockera\Framework\Tests;

class TestFunctions extends AppTestCase {

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
			blockera_array_flat(
				[
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
				]
			),
		);
	}

	/**
	 * @dataProvider getCamelCaseJoinDataProvider
	 *
	 * @param string $string
	 * @param string $expected
	 *
	 * @return void
	 */
	public function testItShouldRetrieveCamelCaseText( string $string, string $expected ): void {

		$this->assertEquals(
			$expected,
			blockera_camel_case_join( $string )
		);
	}

	public function getCamelCaseJoinDataProvider(): array {

		return require __BLOCKERA_TEST_DIR__ . '/Fixtures/Functions/camel-case-join.php';
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

		$rootDir           = dirname( __BLOCKERA_TEST_DIR__, 3 );
		$blocks            = ( require $rootDir . '/config/app.php' )['blocks'];
		$postDynamicValues = require $rootDir . '/config/dynamic-values/post.php';
		$theme             = wp_get_theme();

		return [
			[
				'path'     => 'app.root_url',
				'expected' => 'http://example.org/wp-content/plugins/blockera-core',
			],
			[
				'path'     => 'app.root_path',
				'expected' => $rootDir,
			],
			[
				'path'     => 'app.url',
				'expected' => 'http://example.org/wp-content/plugins/blockera-core/app/',
			],
			[
				'path'     => 'app.version',
				'expected' => BLOCKERA_CORE_VERSION,
			],
			[
				'path'     => 'app.namespaces.controllers',
				'expected' => '\Blockera\Framework\Http\Controllers\\',
			],
			[
				'path'     => 'app.providers',
				'expected' => [
					\Blockera\Framework\Providers\StyleProviders::class,
					\Blockera\Framework\Providers\AssetsProvider::class,
					\Blockera\Framework\Providers\RestAPIProvider::class,
					\Blockera\Framework\Providers\AppServiceProvider::class,
				],
			],
			[
				'path'     => 'app.blocks',
				'expected' => $blocks,
			],
			[
				'path'     => 'app.debug',
				'expected' => true,
			],
			[
				'path'     => 'breakpoints.0',
				'expected' => [
					'type'       => 'extra-large',
					'force'      => false,
					'label'      => __( 'Extra Large Screen', 'blockera-core' ),
					'settings'   => [
						'min' => '2561px',
						'max' => '',
					],
					'attributes' => [],
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
			// Integration tests for blockera_core_config() and blockera_load() functions.
			[
				'path'     => 'valueAddon.dynamic-value-groups.post.items',
				'expected' => $postDynamicValues,
			],
		];
	}

	public function testItShouldRetrieveEnvVariableEqualsWithExpectedValue() {

		$this->assertSame(
			[
				'version'    => '1.0-alpha',
				'mode'       => 'development',
				'dir'        => 'blockera-core',
				'everything' => 'blockera-core',
			],
			[
				'version'    => blockera_core_env( 'BLOCKERA_CORE_VERSION' ),
				'mode'       => blockera_core_env( 'APP_MODE' ),
				'dir'        => blockera_core_env( 'BLOCKERA_DIR' ),
				'everything' => blockera_core_env( 'EVERYTHING', 'blockera-core' ),
			]
		);
	}

	public function testItShouldRetrieveRealValueOfRecievedValueAddon(): void {

		// TODO: add tests for dynamic value try to access real dynamic value.

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

		return require __BLOCKERA_TEST_DIR__ . '/Fixtures/Functions/sorted-repeater-items.php';
	}

}
