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

        if (! in_array($block_type, $this->available_blocks, true)) {

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

        return $this->getCustomizedBlock($block_type, $args);
    }

    /**
     * Get customized block type arguments.
     *
     * @param string $block_type the block type name.
     * @param array  $args       the block type previous arguments.
     *
     * @return array the customized block type arguments.
     */
    public function getCustomizedBlock( string $block_type, array $args): array {

        $this->setBlockDirectoryPath($block_type);

        $blockFile = sprintf(
            '%1$sblockera/blocks-core/php/%2$s/block.php',
            $this->plugin_path,
            $this->getBlockDirectoryPath()
        );

        if (! file_exists($blockFile)) {

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
    public function setBlockDirectoryPath( string $blockType): void {

        $parsedName = explode('/', $blockType);

        if (count($parsedName) < 2) {

            $this->block_dir_path = $blockType;

            return;
        }

        switch ($parsedName[0]) {

            // WordPress Core Blocks.
            case 'core':
                $this->block_dir_path = sprintf('libs/wordpress/%s', $parsedName[1]);
                break;
            case 'woocommerce':
                $this->block_dir_path = sprintf('libs/woocommerce/%s', $parsedName[1]);
                break;
			case 'blocksy':
				$this->block_dir_path = sprintf( 'libs/third-party/%s', str_replace( '/', '-', $blockType ) );
				break;
                // TODO: Implements other blocks in this here ...
        }
    }

}
