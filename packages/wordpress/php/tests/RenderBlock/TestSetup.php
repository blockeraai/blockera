<?php

namespace Blockera\WordPress\Tests\RenderBlock;

use Blockera\WordPress\RenderBlock\Setup;

class TestSetup extends \WP_UnitTestCase {

	/**
	 * Test the constructor
	 */
	public function testItShouldFireUpRegisterBlockTypeArgsHook() {

		// Mock add_filter function
		global $wp_filter;
		$wp_filter = [];
		$this->assertEmpty( $wp_filter );

		tests_add_filter('register_block_type_args', function(array $args, string $block_type): array {
			return Setup::getInstance()->registerBlock($args, $block_type);
		}, 
		10,
		 2
		);

		// Ensure the filter is added
		$this->assertInstanceOf( \WP_Hook::class, $wp_filter['register_block_type_args'] );
	}

	/**
	 * Test the getBlockDirectoryPath method
	 */
	public function testGetBlockDirectoryPath() {

		$setup = Setup::getInstance();

		// Test core block type
		$setup->setBlockDirectoryPath( 'core/paragraph' );
		$this->assertEquals( 'libs/wordpress/paragraph', $setup->getBlockDirectoryPath() );

		// Test invalid block type
		$setup->setBlockDirectoryPath( 'invalid-block' );
		$this->assertEquals( 'invalid-block', $setup->getBlockDirectoryPath() );

		// Test block type with single segment
		$setup->setBlockDirectoryPath( 'core' );
		$this->assertEquals( 'core', $setup->getBlockDirectoryPath() );
	}

	/**
	 * Overlay cache must merge Blockera selectors into live args without dropping them.
	 */
	public function testGetCustomizedBlockMergesSelectorsAndIsStableAcrossCalls() {
		$setup = Setup::getInstance();
		$setup->setPluginPath( blockera_core_config( 'app.vendor_path' ) );

		$args = [
			'attributes' => [ 'content' => [ 'type' => 'string' ] ],
			'selectors'  => [ 'root' => '.existing' ],
		];

		$first  = $setup->getCustomizedBlock( 'core/paragraph', $args );
		$second = $setup->getCustomizedBlock( 'core/paragraph', $args );

		$this->assertSame( $first, $second );
		$this->assertSame( '.existing', $first['selectors']['root'] );
		$this->assertArrayHasKey( 'blockera/elements/link', $first['selectors'] );
		$this->assertSame( [ 'type' => 'string' ], $first['attributes']['content'] );
	}

}
