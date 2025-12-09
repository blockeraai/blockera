/**
 * External dependencies
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const glob = require('fast-glob');

/**
 * Internal dependencies
 */
const { log, formats } = require('../lib/logger');

/**
 * Import test HTML files as WordPress posts.
 *
 * @param {Object} options - Command options.
 * @param {boolean} [options.dryRun] - If true, only show what would be done without actually creating posts.
 */
async function testImport(options = {}) {
	const { dryRun = false } = options;

	log(formats.title('Importing test HTML files as WordPress posts'));

	// Find all input.html files in tests/fixtures
	const testFiles = glob.sync('tests/fixtures/**/input.html', {
		cwd: path.resolve(__dirname, '../../..'),
		absolute: true,
	});

	if (testFiles.length === 0) {
		log(formats.warning('No input.html files found in tests/fixtures'));
		return;
	}

	log(`Found ${testFiles.length} input.html file(s)`);

	let successCount = 0;
	let errorCount = 0;

	for (const filePath of testFiles) {
		try {
			// Get the folder name (parent directory name)
			const folderPath = path.dirname(filePath);
			const folderName = path.basename(folderPath);

			// Read the HTML content
			const htmlContent = fs.readFileSync(filePath, 'utf8');

			// Format the title: convert kebab-case to Title Case
			const title = folderName
				.split('-')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');

			if (dryRun) {
				log(
					`[DRY RUN] Would create post: "${title}" from ${folderName}/input.html`
				);
				successCount++;
				continue;
			}

			// Use file-based approach for large content to avoid command-line length limits
			const projectRoot = path.resolve(__dirname, '../../..');
			const projectTmpFile = path.join(
				projectRoot,
				'.tmp',
				`import-${folderName}-${Date.now()}.html`
			);

			// Ensure .tmp directory exists
			const tmpDirPath = path.dirname(projectTmpFile);
			if (!fs.existsSync(tmpDirPath)) {
				fs.mkdirSync(tmpDirPath, { recursive: true });
			}

			try {
				// Write content to temp file (mounted in wp-env)
				fs.writeFileSync(projectTmpFile, htmlContent, 'utf8');

				// Get path relative to WordPress root (for use inside wp-env container)
				// In wp-env, the plugin is mounted at wp-content/plugins/blockera
				const containerPath = `wp-content/plugins/blockera/${path.relative(
					projectRoot,
					projectTmpFile
				)}`;

				// Escape the title for PHP string (single quotes)
				const escapedTitle = title.replace(/'/g, "\\'");
				const escapedPath = containerPath.replace(/'/g, "\\'");

				// Use wp-cli eval to read file and create the post
				// This avoids command-line length limits for large content
				const phpCode = `$title = '${escapedTitle}'; $content = file_get_contents('${escapedPath}'); $post_id = wp_insert_post(array('post_title' => $title, 'post_content' => $content, 'post_status' => 'publish', 'post_type' => 'post')); echo is_wp_error($post_id) ? $post_id->get_error_message() : $post_id;`;

				// Escape single quotes for shell
				const escapedPhpCode = phpCode.replace(/'/g, "'\\''");

				log(`Creating post: "${title}"...`);

				const result = execSync(
					`wp-env run tests-cli wp eval '${escapedPhpCode}'`,
					{
						cwd: projectRoot,
						encoding: 'utf8',
						stdio: ['pipe', 'pipe', 'pipe'],
					}
				);

				const postId = result.trim();
				if (postId && !isNaN(postId)) {
					log(
						formats.success(
							`✓ Created post "${title}" (ID: ${postId}) from ${folderName}/input.html`
						)
					);
					successCount++;
				} else {
					throw new Error(
						`Unexpected response from wp-cli: ${result}`
					);
				}
			} finally {
				// Clean up temp file if it still exists
				if (fs.existsSync(projectTmpFile)) {
					try {
						fs.unlinkSync(projectTmpFile);
					} catch (cleanupError) {
						// Ignore cleanup errors
					}
				}
			}
		} catch (error) {
			const folderName = path.basename(path.dirname(filePath));
			log(
				formats.error(
					`✗ Failed to create post from ${folderName}/input.html: ${error.message}`
				)
			);
			errorCount++;
		}
	}

	// Summary
	log('');
	log(formats.title('Summary'));
	log(`Successfully created: ${successCount} post(s)`);
	if (errorCount > 0) {
		log(formats.error(`Failed: ${errorCount} post(s)`));
	}
}

module.exports = { testImport };
