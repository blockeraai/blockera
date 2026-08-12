const fs = require('fs');
const os = require('os');
const path = require('path');
const {
	getGeneratedIconsObjectNames,
	createSearchDataEntry,
	normalizeFaSolidKey,
	normalizeFaBrandsKey,
	iconNameToTitle,
	faIconNameToTitle,
} = require('../../../bin/sync-icon-search-data');

describe('getGeneratedIconsObjectNames', () => {
	let tempDir;

	beforeEach(() => {
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabler-icons-'));
	});

	afterEach(() => {
		fs.rmSync(tempDir, { recursive: true, force: true });
	});

	it('returns an empty list when the icons file is missing', () => {
		expect(
			getGeneratedIconsObjectNames(
				path.join(tempDir, 'missing.js'),
				'TablerIcons'
			)
		).toEqual([]);
	});

	it('returns an empty list when the named export is absent', () => {
		const iconsJsPath = path.join(tempDir, 'icons.js');
		fs.writeFileSync(
			iconsJsPath,
			'export const OtherIcons: Object = {};\n'
		);

		expect(
			getGeneratedIconsObjectNames(iconsJsPath, 'TablerIcons')
		).toEqual([]);
	});

	it('parses JS object literals that JSON.parse cannot read', () => {
		const iconsJsPath = path.join(tempDir, 'icons.js');
		fs.writeFileSync(
			iconsJsPath,
			`export const TablerIcons: Object = {
	'12-hours': Icon12Hours,
	accessible: IconAccessible,
	'arrow-bar-both': IconArrowBarBoth,
};
`
		);

		expect(
			getGeneratedIconsObjectNames(iconsJsPath, 'TablerIcons')
		).toEqual(['12-hours', 'accessible', 'arrow-bar-both']);
	});

	it('parses Tabler filled export names', () => {
		const iconsJsPath = path.join(tempDir, 'icons.js');
		fs.writeFileSync(
			iconsJsPath,
			`export const TablerFilledIcons: Object = {
	'alert-circle': IconAlertCircleFilled,
	star: IconStarFilled,
};
`
		);

		expect(
			getGeneratedIconsObjectNames(iconsJsPath, 'TablerFilledIcons')
		).toEqual(['alert-circle', 'star']);
	});
});

describe('search-data helpers', () => {
	it('builds titles and Font Awesome prefixes', () => {
		expect(iconNameToTitle('arrow-left')).toBe('Arrow Left');
		expect(faIconNameToTitle('fa-user-plus')).toBe('User Plus');
		expect(createSearchDataEntry('tabler', 'accessible')).toEqual({
			iconName: 'accessible',
			title: 'Accessible',
			library: 'tabler',
			tags: [],
		});
		expect(createSearchDataEntry('fasolid', 'fa-star')).toEqual({
			iconName: 'fa-star',
			title: 'Star',
			library: 'fasolid',
			tags: [],
			prefix: 'fas',
		});
	});

	it('normalizes Font Awesome keys that kebab-case splits incorrectly', () => {
		expect(normalizeFaSolidKey('fa-dice-d-2-0')).toBe('fa-dice-d20');
		expect(normalizeFaSolidKey('fa-dice-d-6')).toBe('fa-dice-d6');
		expect(normalizeFaSolidKey('fa-star')).toBe('fa-star');
		expect(normalizeFaBrandsKey('fa-5-0-0px')).toBe('fa-500px');
		expect(normalizeFaBrandsKey('fa-html-5')).toBe('fa-html5');
		expect(normalizeFaBrandsKey('fa-w-3c')).toBe('fa-w3c');
	});
});
