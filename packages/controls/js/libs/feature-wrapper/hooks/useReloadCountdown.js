// @flow

/**
 * External dependencies
 */
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';

const DEFAULT_COUNTDOWN_SECONDS = 10;

export function useReloadCountdown(
	onReload: () => void,
	seconds: number = DEFAULT_COUNTDOWN_SECONDS
): {
	countdown: number,
	isActive: boolean,
	start: () => void,
	cancel: () => void,
	reloadNow: () => void,
} {
	const [countdown, setCountdown] = useState(seconds);
	const [isActive, setIsActive] = useState(false);
	const intervalRef = useRef<?number>(null);
	const onReloadRef = useRef(onReload);

	onReloadRef.current = onReload;

	const clearCountdownInterval = useCallback(() => {
		if (intervalRef.current) {
			window.clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const reloadNow = useCallback(() => {
		clearCountdownInterval();
		setIsActive(false);
		onReloadRef.current();
	}, [clearCountdownInterval]);

	const cancel = useCallback(() => {
		clearCountdownInterval();
		setIsActive(false);
		setCountdown(seconds);
	}, [clearCountdownInterval, seconds]);

	const start = useCallback(() => {
		clearCountdownInterval();
		setCountdown(seconds);
		setIsActive(true);
	}, [clearCountdownInterval, seconds]);

	useEffect(() => {
		if (!isActive) {
			return undefined;
		}

		intervalRef.current = window.setInterval(() => {
			setCountdown((current) => {
				if (current <= 1) {
					clearCountdownInterval();
					setIsActive(false);
					onReloadRef.current();
					return 0;
				}

				return current - 1;
			});
		}, 1000);

		return () => {
			clearCountdownInterval();
		};
	}, [clearCountdownInterval, isActive]);

	return {
		countdown,
		isActive,
		start,
		cancel,
		reloadNow,
	};
}
