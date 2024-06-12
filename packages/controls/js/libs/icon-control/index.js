// @flow
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import { memo, useState, useReducer, useEffect } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import {
	isEmpty,
	isObject,
	isEquals,
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
import { default as DeleteIcon } from './icons/delete';
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
	const {
		value,
		setValue,
		attribute,
		blockName,
		description,
		resetToDefault,
	} = useControlContext({
		defaultValue,
		onChange,
	});

	const [currentIcon, currentIconDispatch] = useReducer(iconReducer, value);

	useLateEffect(() => {
		setValue(currentIcon);
	}, [currentIcon]);

	useEffect(() => {
		if (isObject(value) && !isEquals(value, currentIcon)) {
			currentIconDispatch({
				type: 'UPDATE_ICON',
				icon: value.icon,
				library: value.library,
			});

			return undefined;
		}

		if (!value) {
			currentIconDispatch({
				type: 'DELETE_ICON',
			});
		}

		return undefined;
		// eslint-disable-next-line
	}, [value]);

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

		if (target?.classList?.contains('blockera-core-is-pro-icon')) {
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
					description,
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
								icon={<DeleteIcon />}
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
								<Icon {...currentIcon} size={50} />
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

IconControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.shape({
		icon: PropTypes.string,
		library: PropTypes.string,
		uploadSVG: PropTypes.oneOf([
			PropTypes.string,
			PropTypes.object,
			PropTypes.element,
		]),
	}),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Choose label
	 */
	labelChoose: PropTypes.string,
	/**
	 * Open icon library label
	 */
	labelIconLibrary: PropTypes.string,
	/**
	 * upload svg label
	 */
	labelUploadSvg: PropTypes.string,
};

// $FlowFixMe
export default memo(IconControl, hasSameProps);
