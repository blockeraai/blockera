<?php

namespace Blockera\WordPress\RenderBlock;

/**
 * Class Setup to sets block arguments and any other configuration related with gutenberg blocks.
 *
 * @package Setup
 */
class Setup {

	/**
	 * Store instance.
	 *
	 * @var self|null $instance the instance.
	 */
	static $instance = null;

	/**
	 * Store plugin path.
	 *
	 * @var string $plugin_path the plugin path.
	 */
	protected string $plugin_path;

	/**
	 * Request-level cache of block.php customization overlays keyed by block type.
	 *
	 * Null means no block.php; array means selectors/supports/attributes to merge.
	 *
	 * @var array<string, array<string, array>|null>
	 */
	private array $block_overlays = [];

	/**
	 * Get instance.
	 *
	 * @return self the instance.
	 */
	public static function getInstance(): self {

		if (null === self::$instance) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Protected constructor.
	 */
	protected function __construct() {
		
	}

	/**
	 * Set plugin path.
	 *
	 * @param string $plugin_path the plugin path.
	 *
	 * @return void
	 */
	public function setPluginPath( string $plugin_path): void {

		$this->plugin_path = $plugin_path;
	}

    /**
     * Store block directory path.
     *
     * @var string $block_dir_path the block directory path.
     */
    public string $block_dir_path = '';

	/**
	 * Store available blocks.
	 *
	 * @var array $available_blocks the available blocks.
	 */
	protected $available_blocks = [];

	/**
	 * Set available blocks.
	 *
	 * @param array $blocks the available blocks.
	 *
	 * @return void
	 */
	public function setAvailableBlocks( array $blocks): void {

		$this->available_blocks = $blocks;
	}

    /**
     * Register block extra arguments for third party block types.
     *
     * @param array  $args       The block args.
     * @param string $block_type The block type name.
     *
     * @return array the registered block arguments.
     */
    public function registerBlock( array $args, string $block_type): array {
        if (! isset($this->available_blocks[ $block_type ])) {
            return $args;
        }

        // Merging blockera shared block attributes.
        $sharedAttributes   = blockera_get_shared_block_attributes();
        $args['attributes'] = array_merge($args['attributes'] ?? [], $sharedAttributes);
        return $this->getCustomizedBlock($block_type, $args);
    }

    /**
     * Get customized block type arguments.
     *
     * Loads each block.php once, caches the Blockera overlay (selectors/supports/attributes),
     * then merges into the live $args. Avoids re-executing block.php / shared inners on
     * repeated register_block_type_args / editor attribute registration calls.
     *
     * @param string $block_type the block type name.
     * @param array  $args       the block type previous arguments.
     *
     * @return array the customized block type arguments.
     */
    public function getCustomizedBlock( string $block_type, array $args): array {
		$overlay = $this->getBlockCustomizationOverlay( $block_type );

		if ( null === $overlay || [] === $overlay ) {
			return $args;
		}

		foreach ( $overlay as $key => $values ) {
			$args[ $key ] = array_merge( $args[ $key ] ?? [], $values );
		}

		return $args;
    }

	/**
	 * Load and memoize the Blockera-only arg overlay for a block type.
	 *
	 * @param string $block_type Block name (e.g. core/paragraph).
	 * @return array<string, array>|null Overlay keys, or null when block.php is missing.
	 */
	private function getBlockCustomizationOverlay( string $block_type ): ?array {
		if ( array_key_exists( $block_type, $this->block_overlays ) ) {
			$this->setBlockDirectoryPath( $block_type );
			return $this->block_overlays[ $block_type ];
		}

		$this->setBlockDirectoryPath( $block_type );
		$block_file = $this->plugin_path . 'blockera/blocks-core/php/' . $this->block_dir_path . '/block.php';

		if ( ! is_file( $block_file ) ) {
			$this->block_overlays[ $block_type ] = null;
			return null;
		}

		/*
		 * Require in an isolated scope with empty base args so block.php returns only
		 * Blockera additions (all current block.php files merge attributes/selectors/supports).
		 */
		$overlay = ( static function ( string $block_file ): array {
			$args = [
				'attributes' => [],
				'selectors'  => [],
				'supports'   => [],
			];

			$result = require $block_file;

			if ( ! is_array( $result ) ) {
				return [];
			}

			$overlay = [];
			foreach ( [ 'attributes', 'selectors', 'supports' ] as $key ) {
				if ( ! empty( $result[ $key ] ) && is_array( $result[ $key ] ) ) {
					$overlay[ $key ] = $result[ $key ];
				}
			}

			return $overlay;
		} )( $block_file );

		$this->block_overlays[ $block_type ] = $overlay;

		return $overlay;
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
    public function setBlockDirectoryPath( string $blockType): void {
        $parsedName = explode('/', $blockType, 3);
        
		if (! isset($parsedName[1])) {
            $this->block_dir_path = $blockType;
            return;
        }

        $prefix = $parsedName[0];
        
		// WordPress Core Blocks.
        if ('core' === $prefix) {
            $this->block_dir_path = 'libs/wordpress/' . $parsedName[1];
            return;
        }

        if ('woocommerce' === $prefix) {
            $this->block_dir_path = 'libs/woocommerce/' . $parsedName[1];
            return;
        }

        if ('blocksy' === $prefix) {
            $this->block_dir_path = 'libs/third-party/' . str_replace('/', '-', $blockType);
            return;
        }
        // TODO: Implements other blocks in this here ...
    }

}
