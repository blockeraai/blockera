/**
 * External dependencies
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Internal dependencies
 */
const {
	escapeText,
	escapeImagePath,
	escapeBlockAttrs,
	localizePatternContent,
	localizePatterns,
	checkPatterns,
	hasPatternPhpFiles,
	needsTranslation,
	normalizePatternsDirs,
} = require('../localize-patterns');

describe('escapeText', () => {
	it('wraps plain text with esc_html_e and the given text domain', () => {
		expect(escapeText('Tell your story', 'blockera-one')).toBe(
			"<?php esc_html_e( 'Tell your story', 'blockera-one' ); ?>"
		);
	});

	it('uses esc_attr_e for attributes', () => {
		expect(escapeText('Picture of a flower', 'blockera-pro', true)).toBe(
			"<?php esc_attr_e( 'Picture of a flower', 'blockera-pro' ); ?>"
		);
	});

	it('preserves leading space as &nbsp; and escapes single quotes', () => {
		expect(escapeText(" It's here", 'blockera-one')).toBe(
			"&nbsp;<?php esc_html_e( 'It\\'s here', 'blockera-one' ); ?>"
		);
	});

	it('leaves already-localized PHP untouched', () => {
		const php = "<?php esc_html_e( 'Hi', 'blockera-one' ); ?>";
		expect(escapeText(php, 'blockera-one')).toBe(php);
	});
});

describe('escapeImagePath', () => {
	it('rewrites absolute assets URLs with a custom URI expression', () => {
		const src =
			'https://site-blockera.test/wp-content/themes/blockera-one/assets/images/book.webp';

		expect(
			escapeImagePath(src, {
				uriPhpExpression: 'get_template_directory_uri()',
				imagePathRoots: ['assets', 'patterns/images'],
			})
		).toBe(
			'<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/book.webp'
		);
	});

	it('rewrites patterns/images URLs with a plugin URI expression', () => {
		const src =
			'https://example.test/wp-content/plugins/blockera-pro/patterns/images/avatar.webp';

		expect(
			escapeImagePath(src, {
				uriPhpExpression: "plugins_url( '/', BLOCKERA_PRO_FILE )",
				imagePathRoots: ['assets', 'patterns/images'],
			})
		).toBe(
			"<?php echo esc_url( plugins_url( '/', BLOCKERA_PRO_FILE ) ); ?>/patterns/images/avatar.webp"
		);
	});

	it('leaves already-dynamic src untouched', () => {
		const src =
			'<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/book.webp';
		expect(
			escapeImagePath(src, {
				uriPhpExpression: 'get_template_directory_uri()',
			})
		).toBe(src);
	});
});

describe('escapeBlockAttrs', () => {
	it('localizes allowed block JSON string attributes', () => {
		const block =
			' wp:search {"label":"Search","placeholder":"Type here...","buttonText":"Go"} /';

		const result = escapeBlockAttrs(block, 'blockera-one');

		expect(result).toContain(
			"<?php esc_html_e( 'Search', 'blockera-one' ); ?>"
		);
		expect(result).toContain(
			"<?php esc_attr_e( 'Type here...', 'blockera-one' ); ?>"
		);
		expect(result).toContain(
			"<?php esc_html_e( 'Go', 'blockera-one' ); ?>"
		);
	});
});

describe('localizePatternContent', () => {
	const baseOptions = {
		textDomain: 'blockera-one',
		uriPhpExpression: 'get_template_directory_uri()',
		imagePathRoots: ['assets', 'patterns/images'],
	};

	it('localizes heading text, alt, aria-label, and image src', async () => {
		const input = `<?php
/**
 * Title: Sample
 */
?>
<!-- wp:group -->
<div class="wp-block-group" aria-label="Post navigation">
	<h2 class="wp-block-heading">The Stories Book</h2>
	<img src="https://site.test/wp-content/themes/blockera-one/assets/images/book.webp" alt="Book cover"/>
</div>
<!-- /wp:group -->
`;

		const output = await localizePatternContent(input, baseOptions);

		expect(output).toContain(
			"<?php esc_html_e( 'The Stories Book', 'blockera-one' ); ?>"
		);
		expect(output).toContain(
			"<?php esc_attr_e( 'Book cover', 'blockera-one' ); ?>"
		);
		expect(output).toContain(
			"<?php esc_attr_e( 'Post navigation', 'blockera-one' ); ?>"
		);
		expect(output).toContain(
			'<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/book.webp'
		);
	});

	it('rewrites block comment url fields', async () => {
		const input = `<?php
/**
 * Title: Cover
 */
?>
<!-- wp:cover {"url":"https://site.test/wp-content/themes/blockera-one/assets/images/cover.webp","dimRatio":0} -->
<div class="wp-block-cover"></div>
<!-- /wp:cover -->
`;

		const output = await localizePatternContent(input, baseOptions);

		expect(output).toContain(
			'"url":"<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/cover.webp"'
		);
	});

	it('is idempotent for already-localized content', async () => {
		const input = `<?php
/**
 * Title: Localized
 */
?>
<!-- wp:heading -->
<h2 class="wp-block-heading"><?php esc_html_e( 'Hello', 'blockera-one' ); ?></h2>
<!-- /wp:heading -->
`;

		const output = await localizePatternContent(input, baseOptions);
		expect(output).toBe(input);
	});

	it('respects an injected plugin text domain and URI expression', async () => {
		const input = `<?php
/**
 * Title: Pro
 */
?>
<!-- wp:paragraph -->
<p>Premium copy</p>
<!-- /wp:paragraph -->
<img src="https://site.test/wp-content/plugins/blockera-pro/assets/images/pro.webp" alt="Pro"/>
`;

		const output = await localizePatternContent(input, {
			textDomain: 'blockera-pro',
			uriPhpExpression: "plugins_url( '/', BLOCKERA_PRO_FILE )",
			imagePathRoots: ['assets'],
		});

		expect(output).toContain(
			"<?php esc_html_e( 'Premium copy', 'blockera-pro' ); ?>"
		);
		expect(output).toContain(
			"<?php echo esc_url( plugins_url( '/', BLOCKERA_PRO_FILE ) ); ?>/assets/images/pro.webp"
		);
	});
});

describe('localizePatterns / checkPatterns', () => {
	let tempDir;

	beforeEach(() => {
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'patterns-localize-'));
	});

	afterEach(() => {
		fs.rmSync(tempDir, { recursive: true, force: true });
	});

	function writePattern(name, content) {
		const filePath = path.join(tempDir, name);
		fs.writeFileSync(filePath, content, 'utf8');
		return filePath;
	}

	it('hasPatternPhpFiles detects php files', () => {
		expect(hasPatternPhpFiles(tempDir)).toBe(false);
		writePattern('a.php', '<?php\n?>\n<p>Hi</p>\n');
		expect(hasPatternPhpFiles(tempDir)).toBe(true);
	});

	it('needsTranslation is true when text domain is missing', () => {
		expect(needsTranslation('<?php\n?>\n<p>Hi</p>', 'blockera-one')).toBe(
			true
		);
		expect(
			needsTranslation(
				"<?php esc_html_e( 'Hi', 'blockera-one' ); ?>",
				'blockera-one'
			)
		).toBe(false);
	});

	it('writes localized files and is then clean under checkPatterns', async () => {
		writePattern(
			'hero.php',
			`<?php
/**
 * Title: Hero
 */
?>
<!-- wp:heading -->
<h2 class="wp-block-heading">The Stories Book</h2>
<!-- /wp:heading -->
`
		);

		const writeResult = await localizePatterns({
			patternsDir: tempDir,
			textDomain: 'blockera-one',
			uriPhpExpression: 'get_template_directory_uri()',
			quiet: true,
		});

		expect(writeResult.ok).toBe(true);
		expect(writeResult.changedFiles).toHaveLength(1);
		expect(fs.readFileSync(writeResult.changedFiles[0], 'utf8')).toContain(
			"esc_html_e( 'The Stories Book', 'blockera-one' )"
		);

		const checkResult = await checkPatterns({
			patternsDir: tempDir,
			textDomain: 'blockera-one',
			uriPhpExpression: 'get_template_directory_uri()',
			quiet: true,
		});

		expect(checkResult.ok).toBe(true);
		expect(checkResult.changedFiles).toHaveLength(0);
	});

	it('checkPatterns fails when files still need localization', async () => {
		writePattern(
			'dirty.php',
			`<?php
/**
 * Title: Dirty
 */
?>
<!-- wp:paragraph -->
<p>Needs work</p>
<!-- /wp:paragraph -->
`
		);

		const checkResult = await checkPatterns({
			patternsDir: tempDir,
			textDomain: 'blockera-one',
			uriPhpExpression: 'get_template_directory_uri()',
			quiet: true,
		});

		expect(checkResult.ok).toBe(false);
		expect(checkResult.changedFiles.length).toBeGreaterThan(0);
		expect(
			fs.readFileSync(path.join(tempDir, 'dirty.php'), 'utf8')
		).toContain('Needs work');
	});

	it('skips already localized files without static URLs', async () => {
		writePattern(
			'done.php',
			`<?php
/**
 * Title: Done
 */
?>
<!-- wp:heading -->
<h2><?php esc_html_e( 'Hello', 'blockera-one' ); ?></h2>
<!-- /wp:heading -->
`
		);

		const result = await localizePatterns({
			patternsDir: tempDir,
			textDomain: 'blockera-one',
			uriPhpExpression: 'get_template_directory_uri()',
			quiet: true,
		});

		expect(result.ok).toBe(true);
		expect(result.changedFiles).toHaveLength(0);
	});

	it('normalizePatternsDirs accepts legacy patternsDir string', () => {
		expect(normalizePatternsDirs({ patternsDir: '/a/patterns' })).toEqual([
			'/a/patterns',
		]);
	});

	it('normalizePatternsDirs prefers patternsDirs array', () => {
		expect(
			normalizePatternsDirs({
				patternsDirs: ['/a/patterns', '/a/patterns-woocommerce'],
				patternsDir: '/legacy',
			})
		).toEqual(['/a/patterns', '/a/patterns-woocommerce']);
	});

	it('hasPatternPhpFiles is true when any directory in the array has PHP', () => {
		const emptyDir = path.join(tempDir, 'empty');
		const withPhp = path.join(tempDir, 'with-php');
		fs.mkdirSync(emptyDir);
		fs.mkdirSync(withPhp);
		fs.writeFileSync(path.join(withPhp, 'a.php'), '<?php\n?>\n', 'utf8');

		expect(hasPatternPhpFiles([emptyDir, withPhp])).toBe(true);
		expect(hasPatternPhpFiles([emptyDir])).toBe(false);
	});

	it('localizes across patternsDirs (dirty + clean directories)', async () => {
		const dirtyDir = path.join(tempDir, 'patterns');
		const cleanDir = path.join(tempDir, 'patterns-woocommerce');
		fs.mkdirSync(dirtyDir);
		fs.mkdirSync(cleanDir);

		fs.writeFileSync(
			path.join(dirtyDir, 'dirty.php'),
			`<?php
/**
 * Title: Dirty
 */
?>
<!-- wp:paragraph -->
<p>Needs work</p>
<!-- /wp:paragraph -->
`,
			'utf8'
		);

		fs.writeFileSync(
			path.join(cleanDir, 'clean.php'),
			`<?php
/**
 * Title: Clean
 */
?>
<!-- wp:heading -->
<h2><?php esc_html_e( 'Already done', 'blockera-one' ); ?></h2>
<!-- /wp:heading -->
`,
			'utf8'
		);

		const result = await localizePatterns({
			patternsDirs: [dirtyDir, cleanDir],
			textDomain: 'blockera-one',
			uriPhpExpression: 'get_template_directory_uri()',
			quiet: true,
		});

		expect(result.ok).toBe(true);
		expect(result.changedFiles).toHaveLength(1);
		expect(result.changedFiles[0]).toContain('dirty.php');
		expect(fs.readFileSync(result.changedFiles[0], 'utf8')).toContain(
			"esc_html_e( 'Needs work', 'blockera-one' )"
		);
		expect(
			fs.readFileSync(path.join(cleanDir, 'clean.php'), 'utf8')
		).toContain("esc_html_e( 'Already done', 'blockera-one' )");
	});

	it('legacy patternsDir string still localizes a single directory', async () => {
		writePattern(
			'legacy.php',
			`<?php
/**
 * Title: Legacy
 */
?>
<!-- wp:paragraph -->
<p>Legacy text</p>
<!-- /wp:paragraph -->
`
		);

		const result = await localizePatterns({
			patternsDir: tempDir,
			textDomain: 'blockera-one',
			uriPhpExpression: 'get_template_directory_uri()',
			quiet: true,
		});

		expect(result.ok).toBe(true);
		expect(result.changedFiles).toHaveLength(1);
		expect(fs.readFileSync(result.changedFiles[0], 'utf8')).toContain(
			"esc_html_e( 'Legacy text', 'blockera-one' )"
		);
	});
});
