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
			console.log(
				Object.values(changedProps).map((item) => {
					return detailedDiff(item[0], item[1]);
				})
			);
		}
		prev.current = props;
	});
}
