// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { memo, useState, useReducer, createRoot } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import {
	isEmpty,
	isUndefined,
	hasSameProps,
	useLateEffect,
} from '@blockera/utils';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { iconReducer } from './store/reducer';
import { IconContextProvider } from './context';
import type { IconControlProps } from './types';
import { useControlContext } from '../../context';
import { Button, MediaUploader, BaseControl } from '../index';
import { default as IconPickerPopover } from './components/icon-picker/icon-picker-popover';

function IconControl({
	label,
	columns,
	field = 'icon',
	//
	labelChoose = __('Choose Icon…', 'blockera'),
	labelIconLibrary = __('Icon Library', 'blockera'),
	labelUploadSvg = __('Upload SVG', 'blockera'),
	//
	defaultValue,
	onChange,
	//
	className,
}: IconControlProps): MixedElement {
	const { value, setValue, attribute, blockName, resetToDefault } =
		useControlContext({
			defaultValue,
			onChange,
		});

	const [currentIcon, currentIconDispatch] = useReducer(iconReducer, value);

	useLateEffect(() => {
		// Prepare rendered icon before setting state
		if (currentIcon?.icon || currentIcon?.uploadSVG) {
			const iconWrapper = document.createElement('div');
			iconWrapper.style.display = 'none';
			iconWrapper.classList.add('blockera-temp-icon-wrapper');

			const foundedWrapper = document.querySelector(
				'.blockera-temp-icon-wrapper'
			);

			if (!foundedWrapper) {
				document.body?.append(iconWrapper);
			} else {
				foundedWrapper.innerHTML = '';
			}

			const iconNode = document.createElement('span');
			document
				.querySelector('.blockera-temp-icon-wrapper')
				?.append(iconNode);
			const iconRoot = createRoot(iconNode);

			iconRoot.render(
				<Icon
					icon={currentIcon.icon}
					library={currentIcon.library}
					uploadSVG={currentIcon.uploadSVG}
				/>
			);

			setTimeout(() => {
				const iconHTML = document.querySelector(
					'.blockera-temp-icon-wrapper span'
				)?.innerHTML;

				currentIcon.renderedIcon = btoa(
					unescape(encodeURIComponent(iconHTML || ''))
				);
			}, 1000);
		}

		setValue(currentIcon);
	}, [currentIcon]);

	const [isOpenModal, setOpenModal] = useState(false);

	// $FlowFixMe
	const openModal = (event) => {
		const target = event.target;
		if (
			'svg' === target.nodeName &&
			'delete' === target.getAttribute('datatype')
		) {
			return;
		}

		setOpenModal(true);
	};

	const defaultIconState = {
		currentIcon,
		dispatch: currentIconDispatch,
		handleIconSelect,
	};

	// $FlowFixMe
	function dispatchActions(action) {
		currentIconDispatch(action);
		setOpenModal(false);
	}

	function hasIcon() {
		if (isUndefined(currentIcon) || isEmpty(currentIcon)) {
			return false;
		}

		if (currentIcon.uploadSVG !== '') {
			return true;
		}

		if (currentIcon.icon === null) {
			return false;
		}

		return currentIcon.icon !== '';
	}

	// $FlowFixMe
	function handleIconSelect(event, action) {
		event.stopPropagation();

		let target = event.target;

		if ('SVG' !== target.nodeName) {
			target = target.closest('svg');
		}

		if (target?.classList?.contains('blockera-is-pro-icon')) {
			return;
		}

		dispatchActions(action);
	}

	return (
		<IconContextProvider {...defaultIconState}>
			<BaseControl
				label={label}
				columns={columns}
				controlName={field}
				className={className}
				{...{
					attribute,
					blockName,
					resetToDefault,
				}}
			>
				<div
					className={controlClassNames(
						'icon',
						hasIcon() ? 'icon-custom' : 'icon-none',
						isOpenModal ? 'is-open-icon-picker' : '',
						className
					)}
				>
					{hasIcon() ? (
						<div
							className={controlInnerClassNames(
								'icon-preview',
								'icon-preview-empty'
							)}
							onClick={openModal}
						>
							<Button
								aria-label={__('Remove Icon', 'blockera')}
								className="btn-delete"
								noBorder={true}
								isFocus={isOpenModal}
								icon={
									<Icon
										library="wp"
										icon="close"
										iconSize="20"
									/>
								}
								onClick={(e) => {
									e.stopPropagation();
									currentIconDispatch({
										type: 'DELETE_ICON',
									});
								}}
							/>

							{currentIcon.uploadSVG ? (
								<img
									src={currentIcon.uploadSVG.url}
									alt={currentIcon.uploadSVG.title}
								/>
							) : (
								<Icon {...currentIcon} iconSize={50} />
							)}

							<div
								className={controlInnerClassNames(
									'action-btns'
								)}
							>
								<Button
									label={__('Icon Library', 'blockera')}
									onClick={openModal}
									className="btn-icon-library"
									noBorder={true}
								>
									{labelIconLibrary}
								</Button>

								<MediaUploader
									onSelect={(media) => {
										currentIconDispatch({
											type: 'UPDATE_SVG',
											uploadSVG: {
												title: media.title,
												filename: media.filename,
												url: media.url,
												updated: '',
											},
										});
									}}
									mode="upload"
									render={({ open }) => (
										<Button
											data-cy="upload-svg-btn"
											className="btn-upload"
											noBorder={true}
											onClick={(event) => {
												event.stopPropagation();
												open();
											}}
										>
											{labelUploadSvg}
										</Button>
									)}
								/>
							</div>
						</div>
					) : (
						<div className={controlInnerClassNames('icon-preview')}>
							<Button
								label={labelChoose}
								onClick={openModal}
								className="btn-choose-icon"
							>
								{labelChoose}
							</Button>
						</div>
					)}
				</div>

				{isOpenModal && (
					<IconPickerPopover
						isOpen={isOpenModal}
						onClose={() => {
							setOpenModal(false);
						}}
					/>
				)}
			</BaseControl>
		</IconContextProvider>
	);
}

// $FlowFixMe
export default memo(IconControl, hasSameProps);
