// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { memo, useState, useReducer } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import {
	isString,
	isEmpty,
	isUndefined,
	hasSameProps,
	useLateEffect,
} from '@blockera/utils';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { PromotionPopover } from '../';
import { iconReducer } from './store/reducer';
import { IconContextProvider } from './context';
import type { IconControlProps } from './types';
import { useControlContext } from '../../context';
import { parseUploadedMediaAndSetIcon } from './helpers';
import { sanitizeRawSVGString } from './utils';
import { Button, MediaUploader, BaseControl, Tooltip } from '../index';
import { default as IconPickerPopover } from './components/icon-picker/icon-picker-popover';

function IconControl({
	id,
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
	const { createNotice } = dispatch('core/notices');
	const { value, setValue, attribute, blockName, resetToDefault } =
		useControlContext({
			id,
			onChange,
			defaultValue,
		});

	const [currentIcon, currentIconDispatch] = useReducer(iconReducer, value);

	useLateEffect(() => {
		setValue(currentIcon);
	}, [currentIcon]);

	const [isOpenModal, setOpenModal] = useState(false);
	const [isOpenPromotion, setIsOpenPromotion] = useState(false);

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
		id,
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

	const onSelectSVG = (media) => {
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
			currentIconDispatch({
				type: 'UPDATE_SVG',
				uploadSVG: {
					title: media.title,
					filename: media.filename,
					url: media.url,
					updated: '',
				},
				svgString: sanitizeRawSVGString(svgString),
			});
		});
	};

	const mediaUploaderOpener = (event, open) => {
		event.stopPropagation();
		const callback = applyFilters(
			'blockera.controls.iconControl.uploadSVG.onClick',
			() => setIsOpenPromotion(true),
			open
		);

		callback();
	};

	function renderIcon() {
		if (
			!isUndefined(currentIcon?.svgString) &&
			!isEmpty(currentIcon?.svgString)
		) {
			return (
				<div
					dangerouslySetInnerHTML={{ __html: currentIcon.svgString }}
				/>
			);
		}

		if (
			!isUndefined(currentIcon?.uploadSVG?.url) &&
			!isEmpty(currentIcon?.uploadSVG?.url)
		) {
			return (
				<img src={currentIcon.uploadSVG.url} alt={'custom svg icon'} />
			);
		}

		if (
			!isUndefined(currentIcon?.renderedIcon) &&
			!isEmpty(currentIcon?.renderedIcon) &&
			isString(currentIcon?.renderedIcon)
		) {
			return (
				<img
					src={
						'data:image/svg+xml;base64,' + currentIcon.renderedIcon
					}
					alt={'custom svg icon'}
				/>
			);
		}

		if (!isUndefined(currentIcon?.icon) && !isEmpty(currentIcon?.icon)) {
			return <Icon {...currentIcon} iconSize={50} />;
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
						<PromotionPopover
							heading={__('Custom SVG Icons', 'blockera')}
							featuresList={[
								__('Upload custom SVG icons', 'blockera'),
								__('Unlimited icon uploads', 'blockera'),
								__('Unlock all icon libraries', 'blockera'),
							]}
							isOpen={isOpenPromotion}
							onClose={() => setIsOpenPromotion(false)}
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
									'--tooltip-bg': '#e20000',
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

								<MediaUploader
									allowedTypes={['image/svg+xml']}
									onSelect={onSelectSVG}
									mode="upload"
									render={({ open }) => (
										<Button
											data-cy="upload-svg-btn"
											className="btn-upload"
											noBorder={true}
											onClick={(event) =>
												mediaUploaderOpener(event, open)
											}
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
								{labelIconLibrary}
							</Button>

							<MediaUploader
								allowedTypes={['image/svg+xml']}
								onSelect={onSelectSVG}
								mode="upload"
								render={({ open }) => (
									<Button
										data-cy="upload-svg-btn"
										className="btn-choose-icon"
										onClick={(event) =>
											mediaUploaderOpener(event, open)
										}
									>
										{labelUploadSvg}
									</Button>
								)}
							/>
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
