// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { useState, useReducer, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { isString, isEmpty, isUndefined, useLateEffect } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { UpgradePrompt, Flex } from '../';
import { iconReducer } from './store/reducer';
import { IconContextProvider } from './context';
import type { IconControlProps } from './types';
import { useControlContext } from '../../context';
import { parseUploadedMediaAndSetIcon } from './helpers';
import { sanitizeRawSVGString, isCustomIcon } from './utils';
import { Button, BaseControl, Tooltip } from '../index';
import { default as IconPickerModal } from './components/icon-picker/icon-picker-modal';
import { useRecentIcons } from './hooks/useRecentIcons';

function IconControl({
	id,
	label,
	labelProps: propsForLabelControl = {},
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
	const { createNotice } = dispatch('core/notices');
	const { value, setValue, attribute, blockName, resetToDefault } =
		useControlContext({
			id,
			onChange,
			defaultValue,
		});

	const [currentIcon, currentIconDispatch] = useReducer(iconReducer, value);
	const { recentIcons, addRecentIcon, removeRecentIcon } = useRecentIcons();

	useLateEffect(() => {
		setValue(currentIcon);
	}, [currentIcon]);

	const [isOpenModal, setOpenModal] = useState(false);
	const [isOpenPromotion, setIsOpenPromotion] = useState(false);
	const [modalInitialTab, setModalInitialTab] = useState('library');

	// $FlowFixMe
	const openModal = (event, preferredTab = null) => {
		event.stopPropagation();

		const target = event.target;
		if (
			'svg' === target.nodeName &&
			'delete' === target.getAttribute('datatype')
		) {
			return;
		}

		setModalInitialTab(
			preferredTab ?? (isCustomIcon(currentIcon) ? 'custom' : 'library')
		);
		setOpenModal(true);
	};

	const isCurrentIcon = useCallback(
		(iconName, library) => {
			return (
				currentIcon?.icon === iconName &&
				currentIcon?.library === library
			);
		},
		[currentIcon]
	);

	const defaultIconState = {
		id,
		currentIcon,
		dispatch: currentIconDispatch,
		handleIconSelect,
		isCurrentIcon,
		recentIcons,
		removeRecentIcon,
	};

	// $FlowFixMe
	function dispatchActions(action) {
		addRecentIcon(action);
		currentIconDispatch(action);
		setOpenModal(false);
	}

	function hasIcon() {
		if (isUndefined(currentIcon) || isEmpty(currentIcon)) {
			return false;
		}

		if ('' !== currentIcon.uploadSVG) {
			return true;
		}

		if (
			!isUndefined(currentIcon?.svgString) &&
			'' !== currentIcon.svgString
		) {
			return true;
		}

		if (null === currentIcon.icon) {
			return false;
		}

		return '' !== currentIcon.icon;
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

	const parseMediaForDraft = useCallback(
		(media, setDraft) => {
			if ('svg+xml' !== media.subtype) {
				createNotice(
					'error',
					__('Please upload an SVG file!', 'blockera'),
					{
						isDismissible: true,
					}
				);
				return;
			}

			parseUploadedMediaAndSetIcon(media, (svgString) => {
				setDraft({
					svgString: sanitizeRawSVGString(svgString),
					uploadSVG: {
						title: media.title,
						filename: media.filename,
						url: media.url,
						updated: '',
					},
				});
			});
		},
		[createNotice]
	);

	// $FlowFixMe
	const handleUseCustomIcon = (action) => {
		dispatchActions(action);
	};

	function renderIcon() {
		if (!isUndefined(currentIcon?.icon) && !isEmpty(currentIcon?.icon)) {
			return <Icon {...currentIcon} iconSize={50} />;
		}

		if (
			!isUndefined(currentIcon?.renderedIcon) &&
			!isEmpty(currentIcon?.renderedIcon) &&
			isString(currentIcon?.renderedIcon)
		) {
			return (
				<div
					dangerouslySetInnerHTML={{
						__html: atob(currentIcon.renderedIcon).replace(
							/\s*style\s*=\s*["'][^"']*["']/g,
							''
						),
					}}
				/>
			);
		}

		if (
			!isUndefined(currentIcon?.svgString) &&
			!isEmpty(currentIcon?.svgString) &&
			isString(currentIcon?.svgString)
		) {
			return (
				<div
					dangerouslySetInnerHTML={{
						__html: currentIcon.svgString.replace(
							/\s*style\s*=\s*["'][^"']*["']/g,
							''
						),
					}}
				/>
			);
		}

		// if custom uploaded svg icon url is available
		if (
			!isUndefined(currentIcon?.uploadSVG?.url) &&
			!isEmpty(currentIcon?.uploadSVG?.url)
		) {
			return (
				<img
					src={currentIcon.uploadSVG.url}
					alt={
						currentIcon?.uploadSVG?.title
							? currentIcon?.uploadSVG?.title.replaceAll('-', ' ')
							: 'custom svg icon'
					}
				/>
			);
		}

		return null;
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
				{...propsForLabelControl}
			>
				<div
					className={controlClassNames(
						'icon',
						hasIcon() ? 'icon-custom' : 'icon-none',
						isOpenModal ? 'is-open-icon-picker' : '',
						className
					)}
					onClick={openModal}
				>
					{isOpenPromotion && (
						<UpgradePrompt
							lockedFeature={{
								icon: (
									<Icon
										icon="upload"
										library="wp"
										iconSize={22}
									/>
								),
								title: __('Custom SVG Icons', 'blockera'),
								description: (
									<Flex direction="column" gap="6px">
										{__(
											'Upload unlimited custom SVG icons',
											'blockera'
										)}
										<Flex direction="column" gap="6px">
											<span className="blockera-free-plan-hint">
												{__(
													'Free: No uploads allowed',
													'blockera'
												)}
											</span>
											<span className="blockera-pro-plan-hint">
												{__(
													'Pro: Upload unlimited custom icons',
													'blockera'
												)}
											</span>
										</Flex>
									</Flex>
								),
							}}
							isOpen={isOpenPromotion}
							onClose={() => setIsOpenPromotion(false)}
							type="modal"
						/>
					)}

					{hasIcon() ? (
						<div
							className={controlInnerClassNames(
								'icon-preview',
								'icon-preview-empty'
							)}
							onClick={openModal}
						>
							<Tooltip
								text={__('Remove Icon', 'blockera')}
								style={{
									'--tooltip-bg': '#e20b0b',
								}}
								delay={300}
							>
								<Button
									aria-label={__('Remove Icon', 'blockera')}
									className="btn-delete"
									noBorder={true}
									isFocus={isOpenModal}
									icon={
										<Icon
											library="ui"
											icon="trash"
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
							</Tooltip>

							{renderIcon()}

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

								<Button
									data-cy="upload-svg-btn"
									className="btn-upload"
									noBorder={true}
									onClick={(event) =>
										openModal(event, 'custom')
									}
								>
									{labelUploadSvg}
								</Button>
							</div>
						</div>
					) : (
						<div className={controlInnerClassNames('icon-preview')}>
							<Button
								label={labelChoose}
								onClick={openModal}
								className="btn-choose-icon"
							>
								{labelIconLibrary}
							</Button>

							<Button
								data-cy="upload-svg-btn"
								className="btn-choose-icon"
								onClick={(event) => openModal(event, 'custom')}
							>
								{labelUploadSvg}
							</Button>
						</div>
					)}
				</div>

				{isOpenModal && (
					<IconPickerModal
						initialActiveTab={modalInitialTab}
						onClose={() => {
							setOpenModal(false);
						}}
						onProRequired={() => setIsOpenPromotion(true)}
						onParseMediaForDraft={parseMediaForDraft}
						onUseCustomIcon={handleUseCustomIcon}
					/>
				)}
			</BaseControl>
		</IconContextProvider>
	);
}

// $FlowFixMe
export default IconControl;
