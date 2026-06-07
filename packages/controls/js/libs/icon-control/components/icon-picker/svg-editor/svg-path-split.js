/**
 * Split compound SVG paths using lazy-loaded paper.js (proper parsing + absolute coords).
 */

/** @type {typeof import('paper') | null} */
let paperModule = null;

/**
 * Lazy-load paper.js once per session.
 *
 * @return {Promise<typeof import('paper')>} Loaded Paper.js module.
 */
async function loadPaper() {
	if (paperModule) {
		return paperModule;
	}

	const paperImport = await import('paper');
	paperModule = paperImport.default || paperImport;

	return paperModule;
}

/**
 * Extract absolute path data strings from a paper Path/CompoundPath item.
 *
 * @param {import('paper').PathItem} item Paper path item.
 * @return {string[]} Collected string values.
 */
function collectPathDataFromPaperItem(item) {
	const subpaths = [];

	if (!item) {
		return subpaths;
	}

	if (item.children?.length > 1) {
		for (let i = 0; i < item.children.length; i++) {
			const child = item.children[i];
			const pathData = child.pathData;

			if (pathData) {
				subpaths.push(pathData);
			}
		}

		return subpaths;
	}

	const pathData = item.pathData;

	if (pathData) {
		subpaths.push(pathData);
	}

	return subpaths;
}

/**
 * Parse path `d` with paper.js and return absolute subpath data strings.
 *
 * @param {Element} pathElement SVG path element in the live DOM.
 * @return {Promise<string[]>} Async path segment strings.
 */
export async function extractPathSubpathDataList(pathElement) {
	if (!pathElement || pathElement.nodeName.toLowerCase() !== 'path') {
		return [];
	}

	const pathData = pathElement.getAttribute('d') || '';

	if (!pathData.trim()) {
		return [];
	}

	const paper = await loadPaper();
	const canvas = document.createElement('canvas');

	canvas.width = 1;
	canvas.height = 1;
	paper.setup(canvas);

	try {
		paper.project.clear();

		const compound = new paper.CompoundPath({
			pathData,
			insert: false,
		});

		if (
			pathElement instanceof SVGGraphicsElement &&
			pathElement.transform.baseVal.length > 0
		) {
			const consolidated = pathElement.transform.baseVal.consolidate();

			if (consolidated) {
				const matrix = consolidated.matrix;

				compound.transform(
					new paper.Matrix(
						matrix.a,
						matrix.b,
						matrix.c,
						matrix.d,
						matrix.e,
						matrix.f
					)
				);
			}
		}

		const subpaths = collectPathDataFromPaperItem(compound);

		return subpaths;
	} catch (error) {
		return [];
	} finally {
		paper.project.clear();
	}
}

/**
 * Compute axis-aligned bounds for each subpath via paper.js.
 *
 * @param {string[]} subpaths Absolute path data strings.
 * @param {typeof import('paper')} paper Loaded paper module.
 * @return {{ x: number, y: number, width: number, height: number }[]} Subpath bounding boxes.
 */
function computeSubpathBoundsList(subpaths, paper) {
	const bounds = [];

	for (let i = 0; i < subpaths.length; i++) {
		paper.project.clear();

		const path = new paper.Path({
			pathData: subpaths[i],
			insert: false,
		});
		const box = path.bounds;

		bounds.push({
			x: box.x,
			y: box.y,
			width: box.width,
			height: box.height,
		});
	}

	paper.project.clear();

	return bounds;
}

/**
 * Whether one bbox is fully contained within another (with tolerance).
 *
 * @param {{ x: number, y: number, width: number, height: number }} outer Outer bounds.
 * @param {{ x: number, y: number, width: number, height: number }} inner Inner bounds.
 * @param {number} tolerance Pixel tolerance.
 * @return {boolean} Result of the check.
 */
function boundsContain(outer, inner, tolerance = 0.5) {
	return (
		inner.x >= outer.x - tolerance &&
		inner.y >= outer.y - tolerance &&
		inner.x + inner.width <= outer.x + outer.width + tolerance &&
		inner.y + inner.height <= outer.y + outer.height + tolerance
	);
}

/** Min inner/outer area ratio to count as a hole cutout (not a tiny separate shape). */
const MIN_HOLE_AREA_RATIO = 0.12;

/** Max inner/outer area ratio — above this they are sibling shapes, not hole/cutout. */
const MAX_HOLE_AREA_RATIO = 0.95;

/**
 * Whether `inner` is a hole/cutout of `outer` (not a tiny nested icon detail).
 *
 * @param {{ x: number, y: number, width: number, height: number }} outer Outer bounds.
 * @param {{ x: number, y: number, width: number, height: number }} inner Inner bounds.
 * @return {boolean} Result of the check.
 */
function isHoleCutoutPair(outer, inner) {
	if (!boundsContain(outer, inner)) {
		return false;
	}

	const outerArea = outer.width * outer.height;
	const innerArea = inner.width * inner.height;

	if (outerArea <= 0 || innerArea <= 0) {
		return false;
	}

	const areaRatio = innerArea / outerArea;

	return areaRatio >= MIN_HOLE_AREA_RATIO && areaRatio < MAX_HOLE_AREA_RATIO;
}

/**
 * Union-find root for subpath clustering.
 *
 * @param {number[]} parent Parent links.
 * @param {number} index   Index to resolve.
 * @return {number} Numeric result.
 */
function findClusterRoot(parent, index) {
	if (parent[index] !== index) {
		parent[index] = findClusterRoot(parent, parent[index]);
	}

	return parent[index];
}

/**
 * Union two subpath indices into the same cluster.
 *
 * @param {number[]} parent Parent links.
 * @param {number} a        First index.
 * @param {number} b        Second index.
 */
function unionClusterIndices(parent, a, b) {
	const rootA = findClusterRoot(parent, a);
	const rootB = findClusterRoot(parent, b);

	if (rootA !== rootB) {
		parent[rootA] = rootB;
	}
}

/**
 * Group subpath indices: nested hole subpaths stay in one cluster, independent shapes split out.
 *
 * @param {{ x: number, y: number, width: number, height: number }[]} bounds Subpath bounds.
 * @return {number[][]} Cluster index groups.
 */
function clusterSubpathIndices(bounds) {
	const count = bounds.length;

	if (count <= 1) {
		return [[0]];
	}

	const parent = [];

	for (let i = 0; i < count; i++) {
		parent[i] = i;
	}

	for (let i = 0; i < count; i++) {
		for (let j = 0; j < count; j++) {
			if (i === j) {
				continue;
			}

			if (isHoleCutoutPair(bounds[i], bounds[j])) {
				unionClusterIndices(parent, i, j);
			} else if (isHoleCutoutPair(bounds[j], bounds[i])) {
				unionClusterIndices(parent, i, j);
			}
		}
	}

	const groups = new Map();

	for (let i = 0; i < count; i++) {
		const root = findClusterRoot(parent, i);

		if (!groups.has(root)) {
			groups.set(root, []);
		}

		groups.get(root).push(i);
	}

	return [...groups.values()];
}

/**
 * Whether a path element contains multiple splittable subpaths.
 *
 * @param {Element} pathElement SVG path element.
 * @return {Promise<boolean>} Whether the async operation succeeded.
 */
export async function canSplitPathElement(pathElement) {
	const subpaths = await extractPathSubpathDataList(pathElement);

	return subpaths.length > 1;
}

/**
 * Build output path clusters from subpaths (smart or forced per-subpath split).
 *
 * @param {string[]} subpaths Absolute subpath data.
 * @param {boolean} forceSplit When true, every subpath becomes its own cluster.
 * @return {Promise<{ ok: boolean, clusters?: string[][], reason?: string }>} Path split preview or result.
 */
async function buildPathClusters(subpaths, forceSplit) {
	if (subpaths.length <= 1) {
		return { ok: false, reason: 'single-subpath' };
	}

	if (forceSplit) {
		const clusters = [];

		for (let i = 0; i < subpaths.length; i++) {
			clusters.push([subpaths[i]]);
		}

		return { ok: true, clusters };
	}

	const paper = await loadPaper();
	const canvas = document.createElement('canvas');

	canvas.width = 1;
	canvas.height = 1;
	paper.setup(canvas);

	try {
		const bounds = computeSubpathBoundsList(subpaths, paper);
		const indexClusters = clusterSubpathIndices(bounds);
		const clusters = [];

		for (let i = 0; i < indexClusters.length; i++) {
			const cluster = [];

			for (let j = 0; j < indexClusters[i].length; j++) {
				cluster.push(subpaths[indexClusters[i][j]]);
			}

			clusters.push(cluster);
		}

		if (clusters.length <= 1) {
			return { ok: false, reason: 'single-cluster', clusters };
		}

		return { ok: true, clusters };
	} finally {
		paper.project.clear();
	}
}

/**
 * Split a compound path into clusters of subpath data (absolute coordinates).
 *
 * @param {Element} pathElement Path element.
 * @param {{ forceSplit?: boolean }} options When true, every subpath becomes its own path.
 * @return {Promise<{ ok: boolean, clusters?: string[][], reason?: string }>} Path split preview or result.
 */
export async function splitPathElement(pathElement, options = {}) {
	const { forceSplit = false } = options;
	const subpaths = await extractPathSubpathDataList(pathElement);

	return buildPathClusters(subpaths, forceSplit);
}
