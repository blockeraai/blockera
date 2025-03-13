<?php

namespace Blockera\Dev\PHPUnit;

abstract class AppTestCase extends \WP_UnitTestCase {

	public static bool $is_dev_mode = false;

	public function set_up():void {

		parent::set_up();

		self::$is_dev_mode = true;
	}

	/**
     * Helper method to invoke private/protected methods
     */
    protected function invokeMethod($object, string $methodName, array $parameters = [])
    {
        $reflection = new \ReflectionClass(get_class($object));
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);

        return $method->invokeArgs($object, $parameters);
    }
}
