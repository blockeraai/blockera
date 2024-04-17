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

		$rootDir = dirname( __PB_TEST_DIR__, 3 );
		$blocks  = ( require $rootDir . '/config/app.php' )['blocks'];
		$theme = wp_get_theme();

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
				'path' => 'breakpoints.0',
				'expected' => [
					'type' => 'extra-large',
					'force' => false,
					'label' => __('Extra Large Screen', 'publisher-core'),
					'settings' => [
						'min' => '2561px',
						'max' => '',
					],
					'attributes' => [],
				],
			],
			[
				'path' => 'entities.theme.name',
				'expected' => [
					'raw'      => $theme->template,
					'rendered' => $theme->get( 'Name' )
				],
			],
			[
				'path' => 'entities.theme.version',
				'expected' => $theme->get( 'Version' ),
			],
			[
				'path' => 'entities.theme.block_theme',
				'expected' => $theme->is_block_theme(),
			],
			[
				'path' => 'entities.theme.parent',
				'expected' => $theme->get( 'parent' ),
			],
			[
				'path' => 'entities.site.url',
				'expected' => home_url(),
			],
		];
	}


}
