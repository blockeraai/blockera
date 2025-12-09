/**
 * External dependencies
 */
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const glob = require('fast-glob');

/**
 * Internal dependencies
 */
const { log, formats } = require('../lib/logger');

/**
 * Import test HTML files as WordPress posts.
 */
async function testImport() {
	log(formats.title('Importing test HTML files as WordPress posts'));

	// Find all input.html files in tests/fixtures
	const testFiles = glob.sync('tests/fixtures/**/input.html', {
		cwd: path.resolve(__dirname, '../../..'),
		absolute: true,
	});

	if (testFiles.length === 0) {
		log(formats.warning('🚫 No input.html files found in tests/fixtures'));
		return;
	}

	log(`🔍 Found ${testFiles.length} input.html file(s)`);

	let successCount = 0;
	let errorCount = 0;
	let siteUrl = null;

	// Get WordPress site URL
	try {
		const projectRoot = path.resolve(__dirname, '../../..');
		const urlOutput = execSync(
			'wp-env run tests-cli wp option get siteurl',
			{
				cwd: projectRoot,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'pipe'],
			}
		);
		// Extract URL from wp-env output (may include extra messages)
		const urlMatch = urlOutput.match(/https?:\/\/[^\s]+/);
		siteUrl = urlMatch ? urlMatch[0].trim() : urlOutput.trim();
		// Clean up any trailing characters
		siteUrl = siteUrl.replace(/[^\w\s:.\/-]/g, '').trim();
		if (siteUrl) {
			log(formats.success(`🌐 Site URL: ${siteUrl}`));
		}
	} catch (error) {
		log(formats.warning('🚫 Could not retrieve site URL for edit links'));
	}

	// Set edit_post_per_page option to 999 if not in dry-run mode
	try {
		const projectRoot = path.resolve(__dirname, '../../..');
		execSync(
			'wp-env run tests-cli wp option update edit_post_per_page 999',
			{
				cwd: projectRoot,
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'pipe'],
			}
		);
		log(
			formats.success(
				`🔍 Edit posts: ${siteUrl}/wp-admin/edit.php?mode=list&orderby=title&order=asc`
			)
		);
	} catch (error) {
		log(formats.warning('🚫 Could not set edit_post_per_page option'));
	}

	for (const filePath of testFiles) {
		try {
			// Add a newline before each test
			log(``);

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

				log(`Test: ${formats.title(folderName)}`);

				// Show loading indicator with animated dots
				let dotCount = 1;
				let loadingInterval = setInterval(() => {
					const dots = '.'.repeat(dotCount);
					process.stdout.write(`\rCreating post${dots}`);
					dotCount++;
				}, 300);

				let result = '';
				let postId;
				try {
					// Use spawn instead of execSync to allow animation during execution
					// Build the command as a string to properly handle the PHP code
					const command = `wp-env run tests-cli wp eval '${escapedPhpCode}'`;
					const child = spawn(command, [], {
						cwd: projectRoot,
						shell: true,
						stdio: ['pipe', 'pipe', 'pipe'],
					});

					// Collect output - wp-env messages go to stderr, actual output to stdout
					child.stdout.on('data', (data) => {
						result += data.toString();
					});

					child.stderr.on('data', (data) => {
						// wp-env info messages go to stderr, but we only care about stdout for the post ID
						// Only add stderr if stdout is empty (error case)
					});

					// Wait for process to complete
					await new Promise((resolve, reject) => {
						child.on('close', (code) => {
							if (code !== 0) {
								reject(
									new Error(
										`Process exited with code ${code}: ${result}`
									)
								);
							} else {
								resolve();
							}
						});
						child.on('error', reject);
					});

					// Extract post ID from output
					// wp-env wraps the output, so we need to extract the actual post ID
					// The post ID appears as a number, often before a ✔ checkmark
					const cleanResult = result.trim();

					// First, try to find a number that appears right before ✔ (wp-env success marker)
					// Pattern: "186✔" or "186 ✔"
					let postIdMatch = cleanResult.match(/(\d+)\s*✔/);

					if (!postIdMatch) {
						// Try to find a standalone number on its own line (clean output)
						postIdMatch = cleanResult.match(/^\s*(\d+)\s*$/m);
					}

					if (!postIdMatch) {
						// Last resort: find any reasonable post ID number (1-6 digits)
						// But prefer numbers that look like post IDs (not timestamps, etc.)
						const allNumbers = cleanResult.match(/\b(\d{1,6})\b/g);
						if (allNumbers) {
							// Take the first number that's likely a post ID (not too large, not a timestamp)
							for (const num of allNumbers) {
								const n = parseInt(num, 10);
								if (n > 0 && n < 1000000) {
									postIdMatch = [null, num];
									break;
								}
							}
						}
					}

					postId = postIdMatch ? postIdMatch[1] : cleanResult;
				} finally {
					// Clear loading indicator
					if (loadingInterval) {
						clearInterval(loadingInterval);
						loadingInterval = null;
					}
					process.stdout.write('\r' + ' '.repeat(50) + '\r');
				}

				if (postId && !isNaN(postId)) {
					log(
						`✅ Post created. ID: ${postId} - ${formats.success(
							`🔗 ${siteUrl}/wp-admin/post.php?post=${postId}&action=edit`
						)}`
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
	log(
		formats.success(
			`Edit posts: ${siteUrl}/wp-admin/edit.php?mode=list&orderby=title&order=asc`
		)
	);

	if (errorCount > 0) {
		log(formats.error(`Failed: ${errorCount} post(s)`));
	}
}

module.exports = { testImport };
