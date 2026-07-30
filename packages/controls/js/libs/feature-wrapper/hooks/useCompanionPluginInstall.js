// @flow

/**
 * External dependencies
 */
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getCompanionPluginConfig,
	type CompanionPluginConfig,
} from '../constants/companionPlugin';

export type CompanionInstallPhase =
	'idle' | 'installing' | 'activating' | 'complete' | 'error';

export type CompanionInstallState = {
	phase: CompanionInstallPhase,
	progress: number,
	statusMessage: string,
	errorMessage: string,
	isBusy: boolean,
	installButtonLabel: string,
	installButtonClassName: string,
	canInstall: boolean,
	handleInstall: () => void,
};

type WpUpdatesResponse = {
	slug?: string,
	plugin?: string,
	pluginName?: string,
	errorMessage?: string,
};

function hasWpUpdates(): boolean {
	return Boolean(
		typeof window !== 'undefined' &&
		window.wp &&
		window.wp.updates &&
		typeof window.wp.updates.installPlugin === 'function' &&
		typeof window.wp.updates.activatePlugin === 'function'
	);
}

function wpUpdatesRequest(
	method: 'installPlugin' | 'activatePlugin',
	args: Object
): Promise<WpUpdatesResponse> {
	return new Promise((resolve, reject) => {
		window.wp.updates[method]({
			...args,
			success: (response: WpUpdatesResponse) => resolve(response),
			error: (response: WpUpdatesResponse) => reject(response),
		});
	});
}

function getInstallButtonLabel(
	config: CompanionPluginConfig,
	phase: CompanionInstallPhase
): string {
	if ('installing' === phase) {
		return __('Installing…', 'blockera');
	}

	if ('activating' === phase) {
		return __('Activating…', 'blockera');
	}

	if ('complete' === phase) {
		return __('Activated!', 'blockera');
	}

	if ('inactive' === config.status) {
		return __('Activate', 'blockera');
	}

	return __('Install Now', 'blockera');
}

function getInstallButtonClassName(phase: CompanionInstallPhase): string {
	const classes = ['button', 'button-primary', 'install-now'];

	if ('installing' === phase) {
		classes.push('updating-message');
	}

	if ('activating' === phase) {
		classes.push('activating-message');
	}

	if ('complete' === phase) {
		classes.push('activated-message', 'button-disabled');
	}

	return classes.join(' ');
}

/**
 * Install and activate the companion plugin using WordPress updates APIs.
 */
export function useCompanionPluginInstall(
	onComplete: () => void
): CompanionInstallState {
	const config = getCompanionPluginConfig();
	const { saveEntityRecord } = useDispatch('core');
	const [phase, setPhase] = useState<CompanionInstallPhase>('idle');
	const [progress, setProgress] = useState(0);
	const [statusMessage, setStatusMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const progressTimerRef = useRef<?number>(null);

	const clearProgressTimer = useCallback(() => {
		if (progressTimerRef.current) {
			window.clearInterval(progressTimerRef.current);
			progressTimerRef.current = null;
		}
	}, []);

	const animateProgress = useCallback(
		(target: number, message: string) => {
			clearProgressTimer();
			setStatusMessage(message);

			progressTimerRef.current = window.setInterval(() => {
				setProgress((current) => {
					if (current >= target) {
						clearProgressTimer();
						return target;
					}

					return Math.min(current + 4, target);
				});
			}, 120);
		},
		[clearProgressTimer]
	);

	useEffect(() => {
		return () => {
			clearProgressTimer();
		};
	}, [clearProgressTimer]);

	const installViaRest = useCallback(async (): Promise<void> => {
		if ('inactive' === config.status) {
			setPhase('activating');
			animateProgress(
				85,
				__('Activating Blockera Site Builder…', 'blockera')
			);

			await saveEntityRecord(
				'root',
				'plugin',
				{
					plugin: config.plugin,
					status: 'active',
				},
				{ throwOnError: true }
			);

			return;
		}

		setPhase('installing');
		animateProgress(
			35,
			__('Downloading Blockera Site Builder…', 'blockera')
		);

		await saveEntityRecord(
			'root',
			'plugin',
			{
				slug: config.slug,
				status: 'active',
			},
			{ throwOnError: true }
		);
	}, [
		animateProgress,
		config.plugin,
		config.slug,
		config.status,
		saveEntityRecord,
	]);

	const installViaWpUpdates = useCallback(async (): Promise<void> => {
		if ('inactive' === config.status) {
			setPhase('activating');
			animateProgress(
				85,
				__('Activating Blockera Site Builder…', 'blockera')
			);

			await wpUpdatesRequest('activatePlugin', {
				slug: config.slug,
				plugin: config.plugin,
				name: config.name,
			});

			return;
		}

		setPhase('installing');
		animateProgress(
			35,
			__('Downloading Blockera Site Builder…', 'blockera')
		);

		await wpUpdatesRequest('installPlugin', {
			slug: config.slug,
		});

		setPhase('activating');
		animateProgress(
			85,
			__('Activating Blockera Site Builder…', 'blockera')
		);

		await wpUpdatesRequest('activatePlugin', {
			slug: config.slug,
			plugin: config.plugin,
			name: config.name,
		});
	}, [
		animateProgress,
		config.name,
		config.plugin,
		config.slug,
		config.status,
	]);

	const handleInstall = useCallback(() => {
		if ('idle' !== phase && 'error' !== phase) {
			return;
		}

		setErrorMessage('');
		setProgress(8);

		void (async () => {
			try {
				if (hasWpUpdates()) {
					await installViaWpUpdates();
				} else {
					await installViaRest();
				}

				clearProgressTimer();
				setProgress(100);
				setPhase('complete');
				setStatusMessage(
					__('Installation completed successfully.', 'blockera')
				);
				onComplete();
			} catch (error) {
				clearProgressTimer();
				setPhase('error');
				setProgress(0);
				setStatusMessage('');

				const message =
					error &&
					typeof error === 'object' &&
					'errorMessage' in error &&
					typeof error.errorMessage === 'string'
						? error.errorMessage
						: __(
								'Installation failed. Please try again.',
								'blockera'
							);

				setErrorMessage(message);
			}
		})();
	}, [
		clearProgressTimer,
		installViaRest,
		installViaWpUpdates,
		onComplete,
		phase,
	]);

	const canInstall =
		('not-installed' === config.status && config.canInstall) ||
		('inactive' === config.status && config.canActivate);

	const isBusy = 'installing' === phase || 'activating' === phase;

	return {
		phase,
		progress,
		statusMessage,
		errorMessage,
		isBusy,
		installButtonLabel: getInstallButtonLabel(config, phase),
		installButtonClassName: getInstallButtonClassName(phase),
		canInstall,
		handleInstall,
	};
}
