<?php

namespace Publisher\Framework\Tests\Providers;

use Publisher\Framework\Tests\AppTestCase;

class TestGetValueAddonRealValueFunction extends AppTestCase {

	/**
	 * @dataProvider dataProvider
	 *
	 * @param array $asset
	 *
	 * @return void
	 */
	public function test_pb_get_value_addon_real_value( array $asset ): void {

		$actual = pb_get_value_addon_real_value( $asset['input'] );

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
