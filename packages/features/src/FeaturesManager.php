<?php

namespace Blockera\Features;

use Blockera\Features\Contracts\FeatureInterface;

class FeaturesManager {

    /**
     * The features array.
     *
     * @var array<string, FeatureInterface>
     */
    protected array $features = [];

	/**
	 * Get the registered features.
	 *
	 * @return array the registered features list.
	 */
	public function getRegisteredFeatures(): array {
		return $this->features;
	}

    /**
     * Register a feature.
     *
     * @param array<string, FeatureInterface> $features The features array.
     *
     * @return self the instance of self.
     */
    public function registerFeatures( array $features): self {
        foreach ($features as $key => $feature) {
			if (! $feature instanceof FeatureInterface) {
				continue;
			}

            $this->features[ $key ] = $feature;
            $feature->register();
        }

		return $this;
    }

    /**
     * Boot the registered and enabled features.
     *
     * @return self the instance of self.
     */
    public function bootFeatures(): self {
        foreach ($this->features as $feature) {
            if (! $feature->isEnabled()) {
                continue;
            }

            $feature->boot();
        }

		return $this;
    }

    /**
     * Get the feature instance with the given key.
     *
     * @param string $key The key of the feature.
     *
     * @return FeatureInterface|null The feature instance or null if not found.
     */
    public function getFeature( string $key): ?FeatureInterface {
        return $this->features[ $key ] ?? null;
    }
}
