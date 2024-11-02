<?php

namespace Blockera\Telemetry\DataProviders;

interface DataProvider {

	/**
	 * Retrieve data of provider,
	 * Example DebugDataProvider.
	 *
	 * @return array the provided data from specific data provider.
	 */
	public function getData(): array;
}
