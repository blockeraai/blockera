const fs = require('fs');
const path = require('path');

const VARIANT_CONFIG = {
	outline: {
		exportName: 'TablerIcons',
		libraryDir: path.join(__dirname, '..'),
		svgSubdir: 'outline',
	},
	filled: {
		exportName: 'TablerFilledIcons',
		libraryDir: path.join(__dirname, '..', '..', 'library-tabler-filled'),
		svgSubdir: 'filled',
	},
};

/**
 * @param {string} arg
 * @return {string | null} Parsed variant flag or null.
 */
function getVariantArg(arg) {
	const match = arg.match(/^--variant=(outline|filled)$/);

	return match ? match[1] : null;
}

const variant = process.argv.slice(2).map(getVariantArg).find(Boolean);

if (!variant) {
	console.error('Usage: node generate-icons.js --variant=outline|filled');
	process.exit(1);
}

/**
 * Resolve @tabler/icons package root from node_modules.
 *
 * @return {string} Absolute path to the @tabler/icons package root.
 */
function getTablerIconsRoot() {
	let dir = __dirname;

	while (dir !== path.dirname(dir)) {
		const candidate = path.join(dir, 'node_modules', '@tabler', 'icons');

		if (fs.existsSync(path.join(candidate, 'icons.json'))) {
			return candidate;
		}

		dir = path.dirname(dir);
	}

	throw new Error('@tabler/icons package not found in node_modules');
}

const config = VARIANT_CONFIG[variant];
const svgDir = path.join(getTablerIconsRoot(), 'icons', config.svgSubdir);

if (!fs.existsSync(svgDir)) {
	console.error(`SVG directory not found: ${svgDir}`);
	process.exit(1);
}

const icons = Object.fromEntries(
	fs
		.readdirSync(svgDir)
		.filter((file) => file.endsWith('.svg'))
		.sort()
		.map((file) => {
			const iconName = file.replace(/\.svg$/, '');
			const svg = fs.readFileSync(path.join(svgDir, file), 'utf8').trim();

			return [iconName, svg];
		})
);

const outputPath = path.join(config.libraryDir, 'icons.js');
const fileContents = `//@flow

export const ${config.exportName}: Object = ${JSON.stringify(icons, null, '\t')};
`;

fs.writeFileSync(outputPath, fileContents);

console.log(
	`Generated ${outputPath} with ${Object.keys(icons).length} ${variant} icons`
);
