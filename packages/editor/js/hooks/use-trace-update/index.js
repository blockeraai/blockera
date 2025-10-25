/**
 * External dependencies
 */
import { useRef, useEffect } from '@wordpress/element';
import { detailedDiff } from 'deep-object-diff';

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
			/* @debug-ignore */
			console.log(
				Object.entries(changedProps).reduce((acc, [key, item]) => {
					acc[key] = detailedDiff(item[0], item[1]);
					return acc;
				}, {})
			);
		}
		prev.current = props;
	});
}
