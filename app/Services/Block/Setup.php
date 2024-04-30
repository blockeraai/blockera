<?php

namespace Blockera\Framework\Services\Block;

/**
 * Class Setup to sets block arguments and any other configuration related with gutenberg blocks.
 *
 * @package Setup
 */
class Setup {

	public function __construct() {

		add_filter( 'register_block_type_args', [ $this, 'register_block' ], 9e2, 2 );
	}

	/**
	 * Register block extra arguments.
	 *
	 * @param array  $args       The block args.
	 * @param string $block_type The block type name.
	 *
	 * @return array the registered block arguments.
	 */
	public function register_block( array $args, string $block_type ): array {

		$relativePathDir = $this->getBlockDirectoryPath( $block_type );
		$blockFile       = sprintf(
			'%1$sblocks/src/%2$s/block.php',
			blockera_core_config( 'app.packages_path' ),
			$relativePathDir
		);

		if ( ! file_exists( $blockFile ) ) {

			return $args;
		}

		return require $blockFile;
	}

	/**
	 * Get block directory path with blockType name.
	 *
	 * @param string $blockType The block type full name.
	 *
	 * @return string the block directory relative path includes in packages/blocks/src/
	 */
	protected function getBlockDirectoryPath( string $blockType ): string {

		$parsedName = explode( '/', $blockType );

		if ( count( $parsedName ) < 2 ) {

			return $blockType;
		}

		$directoryPath = '';

		switch ( $parsedName[0] ) {

			// WordPress Core Blocks
			case 'core':
				$directoryPath = sprintf( 'wordpress/%s', $parsedName[1] );
				break;
			// TODO: Implements other blocks in this here ...
		}

		return $directoryPath;
	}

}
