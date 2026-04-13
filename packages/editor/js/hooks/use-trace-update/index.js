/**
 * External dependencies
 */
import { useRef, useEffect } from '@wordpress/element';
import { detailedDiff } from 'deep-object-diff';

function isPlainObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getPropDiff(prevValue, nextValue) {
	if (isPlainObject(prevValue) && isPlainObject(nextValue)) {
		const diff = detailedDiff(prevValue, nextValue);
		const hasChanges =
			Object.keys(diff.added).length > 0 ||
			Object.keys(diff.deleted).length > 0 ||
			Object.keys(diff.updated).length > 0;
		return hasChanges ? diff : { from: prevValue, to: nextValue };
	}
	return { from: prevValue, to: nextValue };
}

/**
 * Deep equality check for props. Use with React.memo to prevent redundant re-renders
 * when props have new references but identical values.
 *
 * @param {Object} prevProps Previous props.
 * @param {Object} nextProps Next props.
 * @param {Object} options Options.
 * @param {string[]} options.shallowKeys Keys to compare by reference (e.g. functions, elements).
 * @return {boolean} True if props are equal (skip re-render).
 */
export function arePropsEqual(prevProps, nextProps, options = {}) {
	const { shallowKeys = ['setAttributes', 'children'] } = options;
	const shallowSet = new Set(shallowKeys);
	const keys = new Set([
		...Object.keys(prevProps || {}),
		...Object.keys(nextProps || {}),
	]);

	for (const key of keys) {
		const prev = prevProps?.[key];
		const next = nextProps?.[key];

		if (shallowSet.has(key)) {
			if (prev !== next) {
				return false;
			}
			continue;
		}

		if (
			isPlainObject(prev) &&
			isPlainObject(next) &&
			!Array.isArray(prev) &&
			!Array.isArray(next)
		) {
			const diff = detailedDiff(prev, next);
			const hasChanges =
				Object.keys(diff.added).length > 0 ||
				Object.keys(diff.deleted).length > 0 ||
				Object.keys(diff.updated).length > 0;
			if (hasChanges) {
				return false;
			}
		} else if (prev !== next) {
			return false;
		}
	}

	return true;
}

export function useTraceUpdate(props) {
	const prev = useRef(props);
	useEffect(() => {
		const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
			if (prev.current[k] !== v) {
				ps[k] = [prev.current[k], v];
			}
			return ps;
		}, {});

		if (Object.keys(changedProps).length > 0) {
			const propNames = Object.keys(changedProps);
			const diff = Object.fromEntries(
				propNames.map((key) => {
					const [prevVal, nextVal] = changedProps[key];
					return [key, getPropDiff(prevVal, nextVal)];
				})
			);
			/* @debug-ignore */
			console.log(
				`[useTraceUpdate] ${propNames.length} prop(s) changed: ${propNames.join(', ')}`,
				diff
			);
		}

		prev.current = props;
	});
}
