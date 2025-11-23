<?php

namespace Blockera\Features\Core\Traits;

trait FeatureBlockStoreTrait {

	/**
	 * Store the block.
	 *
	 * @var array $block The block.
	 */
	protected array $block = [];

	/**
	 * Set the block.
	 *
	 * @param array $block The block.
	 *
	 * @return void
	 */
	public function setBlock( array $block): void {
		$this->block = $block;
	}

	/**
	 * Get the block.
	 *
	 * @return array the block.
	 */
	public function getBlock(): array {
		return $this->block;
	}
}
