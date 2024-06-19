<?php

namespace Blockera\Dev\PHPUnit;

abstract class AppTestCase extends \WP_UnitTestCase {

	public static bool $is_dev_mode = false;

	public function set_up():void {

		parent::set_up();

		self::$is_dev_mode = true;
	}
}
