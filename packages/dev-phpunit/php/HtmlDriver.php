<?php

namespace Blockera\Dev\PhpUnit;

use Spatie\Snapshots\Drivers\TextDriver;

class HtmlDriver extends TextDriver {

	public function extension(): string {
		return 'html';
	}
}

