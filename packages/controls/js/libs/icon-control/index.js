// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useCallback } from '@wordpress/element';
import { DropZone } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { Icon, prepareIconSvgForStorage } from '@blockera/icons';
import { isString, isEmpty, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { IconContextProvider } from './context';
import type { IconControlProps } from './types';
import { useControlContext } from '../../context';
import { isCustomIcon } from './utils';
import { Button, BaseControl, Tooltip } from '../index';
import { default as IconPickerModal } from './components/icon-picker/icon-picker-modal';
import CustomIconUploadUpgradePrompt from './components/icon-picker/custom-icon-upload-upgrade-prompt';
import { useIconPickerModal } from './hooks/use-icon-picker-modal';
import { useIconPreviewFileDrop } from './hooks/use-icon-preview-file-drop';

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
	const { value, setValue, attribute, blockName, resetToDefault } =
		useControlContext({
			id,
			onChange,
			defaultValue,
		});

	const handlePickerCommit = useCallback(
		(nextIcon) => {
			setValue(nextIcon);
		},
		[setValue]
	);

	const {
		isOpenModal,
		modalInitialTab,
		openModal,
		closeModal,
		iconContextValue,
		parseMediaForDraft,
		handleUseCustomIcon,
		hasIcon,
		commitIconAction,
	} = useIconPickerModal({
		id,
		value,
		onCommit: handlePickerCommit,
	});

	const { currentIcon } = iconContextValue;
	const {
		handlePreviewFilesDrop,
		isUploadUpgradeOpen,
		closeUploadUpgradePrompt,
	} = useIconPreviewFileDrop({
		onCommitSvg: commitIconAction,
	});

	function renderIcon() {
		if (!isUndefined(currentIcon?.icon) && !isEmpty(currentIcon?.icon)) {
			return <Icon {...currentIcon} iconSize={50} />;
		}

		if (
			!isUndefined(currentIcon?.renderedIcon) &&
			!isEmpty(currentIcon?.renderedIcon) &&
			isString(currentIcon?.renderedIcon)
		) {
			let previewSvg = currentIcon.svgString;

			if (!previewSvg) {
				try {
					previewSvg = decodeURIComponent(
						escape(atob(currentIcon.renderedIcon))
					);
				} catch (error) {
					previewSvg = atob(currentIcon.renderedIcon);
				}
			}

			if (isCustomIcon(currentIcon)) {
				return (
					<div
						dangerouslySetInnerHTML={{
							__html: previewSvg,
						}}
					/>
				);
			}

			previewSvg = prepareIconSvgForStorage(
				previewSvg,
				currentIcon?.library || ''
			);

			return (
				<div
					dangerouslySetInnerHTML={{
						__html: previewSvg,
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
						__html: currentIcon.svgString,
					}}
				/>
			);
		}

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
		<IconContextProvider {...iconContextValue}>
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
					<DropZone onFilesDrop={handlePreviewFilesDrop} />

					<CustomIconUploadUpgradePrompt
						isOpen={isUploadUpgradeOpen}
						onClose={closeUploadUpgradePrompt}
					/>

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
										commitIconAction({
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
						onClose={closeModal}
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
