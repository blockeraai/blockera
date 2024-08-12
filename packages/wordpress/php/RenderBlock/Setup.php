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
	 * The apply blockera setup on WordPress hooks.
	 *
	 * @return void
	 */
	public function apply(): void {

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

		if ( ! in_array( $block_type, blockera_get_available_blocks(), true ) ) {

			return $args;
		}

		// Merging blockera shared block attributes.
		$args = array_merge(
			$args,
			[
				'attributes' => array_merge(
					$args['attributes'] ?? [],
					blockera_get_shared_block_attributes()
				),
			]
		);

		return $this->getCustomizedBlock( $block_type, $args );
	}

	/**
	 * Get customized block type arguments.
	 *
	 * @param string $block_type the block type name.
	 * @param array  $args       the block type previous arguments.
	 *
	 * @return array the customized block type arguments.
	 */
	public function getCustomizedBlock( string $block_type, array $args ): array {

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
			case 'woocommerce':
				$this->block_dir_path = sprintf( 'woocommerce/%s', $parsedName[1] );
				break;
			// TODO: Implements other blocks in this here ...
		}
	}

}
