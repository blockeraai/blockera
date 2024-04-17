<?php

namespace Publisher\Framework\Tests;

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
				], 'pb_get_filter_empty_array_item' )
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
			pb_array_flat(
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
			pb_camel_case_join( $string )
		);
	}

	public function getCamelCaseJoinDataProvider(): array {

		return require __PB_TEST_DIR__ . '/Fixtures/Functions/camel-case-join.php';
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

		$this->assertSame( $expected, pb_core_config( $path ) );
	}

	public function coreConfigDataProvider(): array {

		$rootDir           = dirname( __PB_TEST_DIR__, 3 );
		$blocks            = ( require $rootDir . '/config/app.php' )['blocks'];
		$postDynamicValues = require $rootDir . '/config/dynamic-values/post.php';
		$theme             = wp_get_theme();

		return [
			[
				'path'     => 'app.root_url',
				'expected' => 'http://example.org/wp-content/plugins/publisher-core',
			],
			[
				'path'     => 'app.root_path',
				'expected' => $rootDir,
			],
			[
				'path'     => 'app.url',
				'expected' => 'http://example.org/wp-content/plugins/publisher-core/app/',
			],
			[
				'path'     => 'app.version',
				'expected' => PB_CORE_VERSION,
			],
			[
				'path'     => 'app.namespaces.controllers',
				'expected' => '\Publisher\Framework\Http\Controllers\\',
			],
			[
				'path'     => 'app.providers',
				'expected' => [
					\Publisher\Framework\Providers\StyleProviders::class,
					\Publisher\Framework\Providers\AssetsProvider::class,
					\Publisher\Framework\Providers\RestAPIProvider::class,
					\Publisher\Framework\Providers\AppServiceProvider::class,
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
					'label'      => __( 'Extra Large Screen', 'publisher-core' ),
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
			// Integration tests for pb_core_config() and pb_load() functions.
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
				'dir'        => 'publisher-core',
				'everything' => 'publisher-core',
			],
			[
				'version'    => pb_core_env( 'PB_CORE_VERSION' ),
				'mode'       => pb_core_env( 'APP_MODE' ),
				'dir'        => pb_core_env( 'PUBLISHER_DIR' ),
				'everything' => pb_core_env( 'EVERYTHING', 'publisher-core' ),
			]
		);
	}

	public function testItShouldRetrieveRealValueOfRecievedValueAddon(): void {

		// TODO: add tests for dynamic value try to access real dynamic value.

		$this->assertSame(
			'var(--wp--preset--color--contrast-2)',
			pb_get_value_addon_real_value(
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
			pb_get_sorted_repeater( $items ),
		);
	}

	public function sortingRepeaterDataProviders() {

		return require __PB_TEST_DIR__ . '/Fixtures/Functions/sorted-repeater-items.php';
	}

}
