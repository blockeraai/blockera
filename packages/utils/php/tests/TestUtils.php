<?php

namespace Blockera\Utils\tests;

use Blockera\Utils\Utils;

class UtilsTest extends \WP_UnitTestCase {

	public function testKebabCaseWithSimpleString() {

		$result = Utils::kebabCase( 'helloWorld' );
		$this->assertEquals( 'hello-world', $result );
	}

	public function testKebabCaseWithSpecialCharacters() {

		$result = Utils::kebabCase( 'Hello!World?123' );
		$this->assertEquals( 'hello-world-123', $result );
	}

	public function testKebabCaseWithEmptyString() {

		$result = Utils::kebabCase( '' );
		$this->assertEquals( '', $result );
	}

	public function testKebabCaseWithSingleWord() {

		$result = Utils::kebabCase( 'hello' );
		$this->assertEquals( 'hello', $result );
	}

	public function testKebabCaseWithLeadingAndTrailingHyphens() {

		$result = Utils::kebabCase( '-hello-world-' );
		$this->assertEquals( 'hello-world', $result );
	}

}
