// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { serialize } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import type { ComponentType, MixedElement } from 'react';
import {
	useState,
	useEffect,
	useCallback,
	createElement,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Popup,
	sender,
	Notice,
	checkReporterStatus,
} from '@blockera/telemetry';
import { PanelBodyControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { useBlockSection } from './components/block-app';

export const FallbackUI = ({
	id,
	icon,
	error,
	title,
	configId,
	from = '',
	setNotice,
	fallbackComponent,
	fallbackComponentProps,
	isReportingErrorCompleted,
	setIsReportingErrorCompleted,
}: {
	id: string,
	error: Object,
	title?: string,
	configId?: string,
	icon?: MixedElement,
	fallbackComponentProps?: Object,
	isReportingErrorCompleted?: boolean,
	fallbackComponent?: ComponentType<any>,
	setNotice?: (notice: MixedElement) => void,
	from?: 'root' | 'extension' | 'style-wrapper' | '',
	setIsReportingErrorCompleted: (isReportingErrorCompleted: boolean) => void,
}): MixedElement => {
	const [state, setState] = useState({
		reportedCount: 0,
		isLoading: false,
		isReported: false,
		isOpenPopup: false,
	});
	const isFromExtension = useCallback(() => 'extension' === from, [from]);
	let {
		initialOpen,
		onToggle,
	}: { initialOpen: boolean, onToggle: (isOpen: boolean) => void } = {
		initialOpen: true,
		onToggle: () => {},
	};

	const { getSelectedBlock } = select('core/block-editor');
	const handleAllowReport = useCallback(
		(failedCallback: any) => {
			if (window.blockeraOptInStatus === 'ALLOW') {
				sender(error, serialize(getSelectedBlock()), {
					setResponse: (response: Object) => {
						setState({
							isLoading: false,
							isReported: true,
							isOpenPopup: true,
							reportedCount: state.reportedCount + 1,
						});
						if (response.success) {
							failedCallback('ALLOW');
							setIsReportingErrorCompleted(true);
						} else {
							failedCallback();
							setIsReportingErrorCompleted(false);
						}
					},
					setError: () => {
						failedCallback();
						setState({
							isLoading: false,
							isReported: true,
							isOpenPopup: true,
							reportedCount: state.reportedCount + 1,
						});
						setIsReportingErrorCompleted(false);
					},
				});
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[isReportingErrorCompleted, error]
	);

	if (isFromExtension()) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const blockSection = useBlockSection(configId || '');
		initialOpen = blockSection.initialOpen;
		onToggle = blockSection.onToggle;
	}

	const noticeComponentProps = {
		state,
		setState,
		onClick: () => {
			if (isReportingErrorCompleted) {
				setState({
					...state,
					isLoading: true,
					isReported: true,
					isOpenPopup: true,
				});
			} else {
				setState({
					...state,
					isOpenPopup: true,
				});
			}

			if (state.reportedCount >= 1) {
				checkReporterStatus(
					{
						error,
						blockCode: serialize(getSelectedBlock()),
					},
					(response) => {
						if (response.success) {
							window[id] = {
								isReported: response.data.isReported,
							};

							setState({
								...state,
								isLoading: false,
								isOpenPopup: true,
								...(response.data.isReported
									? {
											reportedCount:
												state.reportedCount + 1,
									  }
									: {}),
							});
						}
					}
				);
			} else if (isReportingErrorCompleted) {
				setTimeout(() => {
					setState({
						...state,
						isOpenPopup: true,
						isLoading: false,
						reportedCount: state.reportedCount + 1,
					});
				}, 2000); // to fake loading ...
			}
		},
	};

	useEffect(() => {
		if ('function' === typeof setNotice) {
			setNotice(
				<Notice
					{...{
						...noticeComponentProps,
						description: __(
							'Blockera has encountered an unexpected error, which may cause some functionality to behave incorrectly.',
							'blockera'
						),
					}}
				/>
			);
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [from]);

	if ('root' === from) {
		return (
			<>
				<Popup
					id={id}
					error={error}
					state={state}
					setState={setState}
					handleReport={handleAllowReport}
					isReportingErrorCompleted={isReportingErrorCompleted}
					setIsReportingErrorCompleted={setIsReportingErrorCompleted}
				/>
				<InspectorControls>
					<Notice
						{...{
							...noticeComponentProps,
							description: __(
								'Blockera detected an error and has this switched this block back to the default block.',
								'blockera'
							),
						}}
					/>
				</InspectorControls>
				{createElement(fallbackComponent, fallbackComponentProps)}
			</>
		);
	}

	if ('style-wrapper' === from) {
		const stackLines =
			error.stack?.split('\n').map((line) => line.trim()) || [];
		const disabledStyles = stackLines
			.map((line): string | false => {
				const StyleGeneratorMatch = line.match(/\w+Styles/i);

				if (!StyleGeneratorMatch) {
					return false;
				}

				return StyleGeneratorMatch[0];
			})
			.filter(
				(style: string | false): boolean =>
					'string' === typeof style && style !== false
			);

		return (
			<>
				<Popup
					id={id}
					error={error}
					state={state}
					setState={setState}
					handleReport={handleAllowReport}
					isReportingErrorCompleted={isReportingErrorCompleted}
					setIsReportingErrorCompleted={setIsReportingErrorCompleted}
				/>
				{createElement(fallbackComponent, {
					...fallbackComponentProps,
					disabledStyles,
				})}
			</>
		);
	}

	return (
		<>
			<Popup
				id={id}
				error={error}
				state={state}
				setState={setState}
				handleReport={handleAllowReport}
				isReportingErrorCompleted={isReportingErrorCompleted}
				setIsReportingErrorCompleted={setIsReportingErrorCompleted}
			/>
			<PanelBodyControl
				icon={icon}
				onToggle={onToggle}
				title={title || ''}
				initialOpen={initialOpen}
			>
				<Notice
					{...{
						...noticeComponentProps,
						description: __(
							'Blockera detected an error and has disabled this block section.',
							'blockera'
						),
					}}
				/>
			</PanelBodyControl>
		</>
	);
};
