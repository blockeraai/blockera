<?php

namespace Blockera\WordPress\RenderBlock;

/**
 * Class Setup to sets block arguments and any other configuration related with gutenberg blocks.
 *
 * @package Setup
 */
class Setup {

	/**
	 * Store block directory path.
	 *
	 * @var string $block_dir_path the block directory path.
	 */
	public string $block_dir_path = '';

	/**
	 * The Blockera\WordPress\RenderBlock\Setup constructor.
	 */
	public function __construct() {

		add_filter( 'register_block_type_args', [ $this, 'register_block' ], 9e2, 2 );
	}

	/**
	 * Register block extra arguments for third party block types.
	 *
	 * @param array  $args       The block args.
	 * @param string $block_type The block type name.
	 *
	 * @return array the registered block arguments.
	 */
	public function register_block( array $args, string $block_type ): array {

		$this->setBlockDirectoryPath( $block_type );

		$blockFile = sprintf(
			'%1$sblockera/blocks-core/php/%2$s/block.php',
			blockera_core_config( 'app.vendor_path' ),
			$this->getBlockDirectoryPath()
		);

		if ( ! file_exists( $blockFile ) ) {

			return $args;
		}

		return require $blockFile;
	}

	/**
	 * Get block directory relative path.
	 *
	 * @return string the block directory relative path includes in packages/blocks/
	 */
	public function getBlockDirectoryPath(): string {

		return $this->block_dir_path;
	}

	/**
	 * Set block directory path with blockType name.
	 *
	 * @param string $blockType The block type full name.
	 *
	 * @return void
	 */
	public function setBlockDirectoryPath( string $blockType ): void {

		$parsedName = explode( '/', $blockType );

		if ( count( $parsedName ) < 2 ) {

			$this->block_dir_path = $blockType;

			return;
		}

		switch ( $parsedName[0] ) {

			// WordPress Core Blocks.
			case 'core':
				$this->block_dir_path = sprintf( 'wordpress/%s', $parsedName[1] );
				break;
			// TODO: Implements other blocks in this here ...
		}
	}

}
