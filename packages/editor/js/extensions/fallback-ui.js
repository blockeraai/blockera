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
import { sender, Popup, Notice } from '@blockera/telemetry';
import { PanelBodyControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { useBlockSection } from './components/block-app';

export const FallbackUI = ({
	error,
	configId,
	title,
	icon,
	isReported,
	from = '',
	setNotice,
	fallbackComponent,
	fallbackComponentProps,
}: {
	error: Object,
	setNotice?: (notice: MixedElement) => void,
	fallbackComponent?: ComponentType<any>,
	fallbackComponentProps?: Object,
	configId?: string,
	title?: string,
	from?: 'root' | 'extension' | 'style-wrapper' | '',
	icon?: MixedElement,
	isReported?: boolean,
}): MixedElement => {
	const isFromExtension = useCallback(() => 'extension' === from, [from]);
	let {
		initialOpen,
		onToggle,
	}: { initialOpen: boolean, onToggle: (isOpen: boolean) => void } = {
		initialOpen: true,
		onToggle: () => {},
	};

	const { getSelectedBlock } = select('core/block-editor');
	const handleAllowReport = useCallback(() => {
		if (window.blockeraOptInStatus === 'ALLOW') {
			sender(error, serialize(getSelectedBlock()));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isReported, error]);

	if (isFromExtension()) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const blockSection = useBlockSection(configId || '');
		initialOpen = blockSection.initialOpen;
		onToggle = blockSection.onToggle;
	}

	const [state, setState] = useState({
		isLoading: false,
		isReported: false,
		isOpenPopup: false,
	});

	const noticeComponentProps = {
		state,
		setState,
		onClick: () => {
			setState({
				...state,
				isLoading: true,
				isReported: true,
			});
			setTimeout(() => {
				setState({
					...state,
					isOpenPopup: true,
					isLoading: false,
				});
			}, 2000);
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
					error={error}
					state={state}
					handleReport={handleAllowReport}
					setIsOpenPopup={(isOpen: boolean) => {
						setState({
							...state,
							isOpenPopup: isOpen,
						});
					}}
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
					error={error}
					state={state}
					handleReport={handleAllowReport}
					setIsOpenPopup={(isOpen: boolean) => {
						setState({
							...state,
							isOpenPopup: isOpen,
						});
					}}
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
				error={error}
				state={state}
				handleReport={handleAllowReport}
				setIsOpenPopup={(isOpen: boolean) => {
					setState({
						...state,
						isOpenPopup: isOpen,
					});
				}}
			/>
			<PanelBodyControl
				onToggle={onToggle}
				title={title || ''}
				icon={icon}
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
