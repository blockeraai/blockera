<?php

namespace Blockera\Dev\PhpUnit;

use Spatie\Snapshots\Drivers\JsonDriver as SpatieJsonDriver;

class JsonDriver extends SpatieJsonDriver {

	public function extension(): string {
		return 'json';
	}
}
