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
	getGeneratedIconsObjectNames,
	getIconKebabId,
	iconNameToTitle,
	faIconNameToTitle,
	createSearchDataEntry,
	getExportedNamesFromIndex,
} = require('../../../../bin/sync-icon-search-data');

describe('getGeneratedIconsObjectNames', () => {
	let tempDir;

	beforeEach(() => {
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabler-icons-'));
	});

	afterEach(() => {
		fs.rmSync(tempDir, { recursive: true, force: true });
	});

	it('returns an empty list when the file is missing', () => {
		expect(
			getGeneratedIconsObjectNames(
				path.join(tempDir, 'missing.js'),
				'TablerIcons'
			)
		).toEqual([]);
	});

	it('extracts quoted and bare keys from a JS object literal (not JSON)', () => {
		const iconsJsPath = path.join(tempDir, 'icons.js');
		fs.writeFileSync(
			iconsJsPath,
			`export const TablerIcons: Object = {
	'12-hours': true,
	accessible: true,
	'arrow-left': true,
};
`
		);

		expect(getGeneratedIconsObjectNames(iconsJsPath, 'TablerIcons')).toEqual(
			['12-hours', 'accessible', 'arrow-left']
		);
	});

	it('does not treat nested object values as extra keys', () => {
		const iconsJsPath = path.join(tempDir, 'icons.js');
		fs.writeFileSync(
			iconsJsPath,
			`export const TablerFilledIcons: Object = {
	home: { toSvg: () => '' },
	'user-circle': { toSvg: () => '' },
};
`
		);

		expect(
			getGeneratedIconsObjectNames(iconsJsPath, 'TablerFilledIcons')
		).toEqual(['home', 'user-circle']);
	});
});

describe('icon search-data helpers', () => {
	it('kebab-cases component names', () => {
		expect(getIconKebabId('ArrowLeft')).toBe('arrow-left');
		expect(getIconKebabId('Icon2fa')).toBe('icon-2fa');
	});

	it('builds titles for library and Font Awesome ids', () => {
		expect(iconNameToTitle('arrow-left')).toBe('Arrow Left');
		expect(faIconNameToTitle('fa-user-plus')).toBe('User Plus');
	});

	it('adds a Font Awesome prefix only for FA libraries', () => {
		expect(createSearchDataEntry('tabler', 'home')).toEqual({
			iconName: 'home',
			title: 'Home',
			library: 'tabler',
			tags: [],
		});
		expect(createSearchDataEntry('fasolid', 'fa-house')).toEqual({
			iconName: 'fa-house',
			title: 'House',
			library: 'fasolid',
			tags: [],
			prefix: 'fas',
		});
	});

	it('reads export { default as Name } from an icons index', () => {
		const indexPath = path.join(
			fs.mkdtempSync(path.join(os.tmpdir(), 'icons-index-')),
			'index.js'
		);
		fs.writeFileSync(
			indexPath,
			`export { default as ZapFast } from './zap-fast.svg';
export { default as Sidebar } from './sidebar.svg';
`
		);

		expect(getExportedNamesFromIndex(indexPath)).toEqual([
			'zap-fast',
			'sidebar',
		]);

		fs.rmSync(path.dirname(indexPath), { recursive: true, force: true });
	});
});
