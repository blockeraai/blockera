<?php

namespace Blockera\WordPress\Tests\Patterns;

use Blockera\WordPress\Patterns\DirectoryRegistrar;

/**
 * Full coverage for DirectoryRegistrar with fixture pattern files.
 */
class DirectoryRegistrarTest extends \WP_UnitTestCase {

	/**
	 * Absolute path to Fixtures directory.
	 *
	 * @var string
	 */
	protected string $fixtures_dir;

	/**
	 * Temporary working directory for isolated scans.
	 *
	 * @var string
	 */
	protected string $temp_dir;

	/**
	 * Registrar under test.
	 *
	 * @var DirectoryRegistrar
	 */
	protected DirectoryRegistrar $registrar;

	/**
	 * Slugs registered during a test (for cleanup).
	 *
	 * @var string[]
	 */
	protected array $registered_slugs = array();

	/**
	 * Set up each test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$this->fixtures_dir = __DIR__ . '/Fixtures';
		$this->temp_dir     = sys_get_temp_dir() . '/blockera-pattern-registrar-' . uniqid( '', true );
		$this->registrar    = new DirectoryRegistrar();

		mkdir( $this->temp_dir, 0777, true );
	}

	/**
	 * Tear down each test.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		$registry = \WP_Block_Patterns_Registry::get_instance();

		foreach ( $this->registered_slugs as $slug ) {
			if ( $registry->is_registered( $slug ) ) {
				$registry->unregister( $slug );
			}
		}

		$this->registered_slugs = array();

		if ( is_dir( $this->temp_dir ) ) {
			$this->registrar->delete_pattern_cache( $this->temp_dir );
			$this->remove_directory( $this->temp_dir );
		}

		$this->registrar->delete_pattern_cache( $this->fixtures_dir );

		parent::tear_down();
	}

	/**
	 * Scans fixtures and parses headers (arrays, ints, bools).
	 */
	public function test_get_patterns_parses_headers_from_fixtures(): void {
		// Invalid fixtures (missing slug / title) intentionally trigger _doing_it_wrong().
		$this->setExpectedIncorrectUsage( DirectoryRegistrar::class . '::get_patterns' );

		$patterns = $this->registrar->get_patterns(
			$this->fixtures_dir,
			array(
				'version'        => '1.0.0',
				'can_use_cached' => false,
			)
		);

		$this->assertArrayHasKey( 'valid-pattern.php', $patterns );
		$this->assertArrayHasKey( 'nested/nested-pattern.php', $patterns );
		$this->assertArrayHasKey( 'hidden-inserter.php', $patterns );
		$this->assertArrayNotHasKey( 'missing-slug.php', $patterns );
		$this->assertArrayNotHasKey( 'missing-title.php', $patterns );

		$valid = $patterns['valid-pattern.php'];

		$this->assertSame( 'blockera-test/valid-pattern', $valid['slug'] );
		$this->assertSame( 'Valid Fixture Pattern', $valid['title'] );
		$this->assertSame(
			array( 'featured', 'text' ),
			$valid['categories']
		);
		$this->assertSame( array( 'sample', 'fixture' ), $valid['keywords'] );
		$this->assertSame( array( 'core/post-content' ), $valid['blockTypes'] );
		$this->assertSame( array( 'page' ), $valid['postTypes'] );
		$this->assertSame( array( 'front-page' ), $valid['templateTypes'] );
		$this->assertSame( 1200, $valid['viewportWidth'] );
		$this->assertTrue( $valid['inserter'] );

		$this->assertFalse( $patterns['hidden-inserter.php']['inserter'] );
		$this->assertSame(
			'blockera-test/nested-pattern',
			$patterns['nested/nested-pattern.php']['slug']
		);
	}

	/**
	 * Registers patterns with filePath and expected metadata.
	 */
	public function test_register_registers_patterns_with_filepath(): void {
		$this->copy_fixture( 'valid-pattern.php' );
		$this->copy_fixture( 'nested/nested-pattern.php' );

		$this->registrar->register(
			$this->temp_dir,
			array(
				'text_domain'    => 'blockera-one',
				'version'        => '1.0.0',
				'can_use_cached' => false,
			)
		);

		$this->track_slug( 'blockera-test/valid-pattern' );
		$this->track_slug( 'blockera-test/nested-pattern' );

		$registry = \WP_Block_Patterns_Registry::get_instance();

		$this->assertTrue( $registry->is_registered( 'blockera-test/valid-pattern' ) );
		$this->assertTrue( $registry->is_registered( 'blockera-test/nested-pattern' ) );

		$registered = $registry->get_registered( 'blockera-test/valid-pattern' );

		$this->assertNotNull( $registered );
		$this->assertSame( 'Valid Fixture Pattern', $registered['title'] );
		$this->assertSame( array( 'featured', 'text' ), $registered['categories'] );
		$this->assertStringContainsString( 'Valid Fixture Pattern', $registered['content'] );
	}

	/**
	 * Skips already-registered slugs.
	 */
	public function test_register_skips_already_registered_slugs(): void {
		$this->copy_fixture( 'valid-pattern.php' );

		register_block_pattern(
			'blockera-test/valid-pattern',
			array(
				'title'   => 'Pre-registered',
				'content' => '<!-- wp:paragraph --><p>Pre</p><!-- /wp:paragraph -->',
			)
		);
		$this->track_slug( 'blockera-test/valid-pattern' );

		$this->registrar->register(
			$this->temp_dir,
			array(
				'text_domain'    => 'blockera-one',
				'version'        => '1.0.0',
				'can_use_cached' => false,
			)
		);

		$registered = \WP_Block_Patterns_Registry::get_instance()->get_registered( 'blockera-test/valid-pattern' );

		$this->assertSame( 'Pre-registered', $registered['title'] );
		$this->assertStringContainsString( 'Pre', $registered['content'] );
	}

	/**
	 * Cache hit returns metadata without needing the source files to change.
	 */
	public function test_get_patterns_uses_cache_on_version_match(): void {
		$this->copy_fixture( 'valid-pattern.php' );

		$first = $this->registrar->get_patterns(
			$this->temp_dir,
			array(
				'version'        => '2.0.0',
				'can_use_cached' => true,
			)
		);

		$this->assertArrayHasKey( 'valid-pattern.php', $first );

		// Remove the file; cache should still serve metadata.
		unlink( $this->temp_dir . '/valid-pattern.php' );

		$second = $this->registrar->get_patterns(
			$this->temp_dir,
			array(
				'version'        => '2.0.0',
				'can_use_cached' => true,
			)
		);

		$this->assertSame( $first, $second );
		$this->assertArrayHasKey( 'valid-pattern.php', $second );
	}

	/**
	 * Version bump forces a re-scan.
	 */
	public function test_get_patterns_rescans_on_version_bump(): void {
		$this->copy_fixture( 'valid-pattern.php' );

		$first = $this->registrar->get_patterns(
			$this->temp_dir,
			array(
				'version'        => '1.0.0',
				'can_use_cached' => true,
			)
		);

		$this->assertCount( 1, $first );

		$this->copy_fixture( 'hidden-inserter.php' );

		$second = $this->registrar->get_patterns(
			$this->temp_dir,
			array(
				'version'        => '1.0.1',
				'can_use_cached' => true,
			)
		);

		$this->assertCount( 2, $second );
		$this->assertArrayHasKey( 'hidden-inserter.php', $second );
	}

	/**
	 * Missing file during register invalidates cache and skips that pattern.
	 */
	public function test_register_invalidates_cache_when_file_missing(): void {
		$this->copy_fixture( 'valid-pattern.php' );
		$this->copy_fixture( 'hidden-inserter.php' );

		// Prime cache with both files.
		$this->registrar->get_patterns(
			$this->temp_dir,
			array(
				'version'        => '3.0.0',
				'can_use_cached' => true,
			)
		);

		unlink( $this->temp_dir . '/valid-pattern.php' );

		// Cached entry points at a deleted file; register() reports _doing_it_wrong().
		$this->setExpectedIncorrectUsage( DirectoryRegistrar::class . '::register' );

		$this->registrar->register(
			$this->temp_dir,
			array(
				'text_domain'    => 'blockera-one',
				'version'        => '3.0.0',
				'can_use_cached' => true,
			)
		);

		$this->track_slug( 'blockera-test/hidden-inserter' );

		$registry = \WP_Block_Patterns_Registry::get_instance();

		$this->assertFalse( $registry->is_registered( 'blockera-test/valid-pattern' ) );
		$this->assertTrue( $registry->is_registered( 'blockera-test/hidden-inserter' ) );

		// Cache should have been deleted; a fresh scan without the missing file.
		$rescanned = $this->registrar->get_patterns(
			$this->temp_dir,
			array(
				'version'        => '3.0.0',
				'can_use_cached' => true,
			)
		);

		$this->assertArrayNotHasKey( 'valid-pattern.php', $rescanned );
		$this->assertArrayHasKey( 'hidden-inserter.php', $rescanned );
	}

	/**
	 * Invalid fixtures (no slug / no title) are not registered.
	 */
	public function test_register_skips_invalid_patterns(): void {
		$this->copy_fixture( 'missing-slug.php' );
		$this->copy_fixture( 'missing-title.php' );
		$this->copy_fixture( 'valid-pattern.php' );

		// Invalid fixtures intentionally trigger _doing_it_wrong() during get_patterns().
		$this->setExpectedIncorrectUsage( DirectoryRegistrar::class . '::get_patterns' );

		$this->registrar->register(
			$this->temp_dir,
			array(
				'text_domain'    => 'blockera-one',
				'version'        => '1.0.0',
				'can_use_cached' => false,
			)
		);

		$this->track_slug( 'blockera-test/valid-pattern' );

		$registry = \WP_Block_Patterns_Registry::get_instance();

		$this->assertTrue( $registry->is_registered( 'blockera-test/valid-pattern' ) );
		$this->assertFalse( $registry->is_registered( 'blockera-test/missing-title' ) );
	}

	/**
	 * Missing directory is a no-op.
	 */
	public function test_register_missing_directory_is_noop(): void {
		$missing = $this->temp_dir . '/does-not-exist';

		$this->registrar->register(
			$missing,
			array(
				'text_domain'    => 'blockera-one',
				'version'        => '1.0.0',
				'can_use_cached' => false,
			)
		);

		$this->assertFalse(
			\WP_Block_Patterns_Registry::get_instance()->is_registered( 'blockera-test/valid-pattern' )
		);
	}

	/**
	 * Empty directory caches empty metadata and registers nothing.
	 */
	public function test_get_patterns_empty_directory_returns_empty(): void {
		$patterns = $this->registrar->get_patterns(
			$this->temp_dir,
			array(
				'version'        => '1.0.0',
				'can_use_cached' => true,
			)
		);

		$this->assertSame( array(), $patterns );

		$cached = get_site_transient( $this->registrar->get_cache_key( $this->temp_dir ) );

		$this->assertIsArray( $cached );
		$this->assertSame( '1.0.0', $cached['version'] );
		$this->assertSame( array(), $cached['patterns'] );
	}

	/**
	 * Copy a fixture file into the temp directory (preserving relative path).
	 *
	 * @param string $relative Relative path under Fixtures/.
	 *
	 * @return void
	 */
	protected function copy_fixture( string $relative ): void {
		$source = $this->fixtures_dir . '/' . $relative;
		$dest   = $this->temp_dir . '/' . $relative;
		$dir    = dirname( $dest );

		if ( ! is_dir( $dir ) ) {
			mkdir( $dir, 0777, true );
		}

		copy( $source, $dest );
	}

	/**
	 * Track a slug for tear_down unregistration.
	 *
	 * @param string $slug Pattern slug.
	 *
	 * @return void
	 */
	protected function track_slug( string $slug ): void {
		$this->registered_slugs[] = $slug;
	}

	/**
	 * Recursively remove a directory.
	 *
	 * @param string $dir Directory path.
	 *
	 * @return void
	 */
	protected function remove_directory( string $dir ): void {
		if ( ! is_dir( $dir ) ) {
			return;
		}

		$entries = scandir( $dir );

		if ( false === $entries ) {
			return;
		}

		foreach ( $entries as $entry ) {
			if ( '.' === $entry || '..' === $entry ) {
				continue;
			}

			$path = $dir . '/' . $entry;

			if ( is_dir( $path ) ) {
				$this->remove_directory( $path );
			} else {
				unlink( $path );
			}
		}

		rmdir( $dir );
	}
}
