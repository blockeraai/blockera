<?php

namespace Blockera\Dev\PhpUnit;

use Spatie\Snapshots\Drivers\TextDriver;

class CssDriver extends TextDriver {

	public function extension(): string {
		return 'css';
	}
}
