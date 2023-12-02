// @flow
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import { memo, useState, useReducer } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { Button, Icon, MediaUploader } from '@publisher/components';
import { isEmpty, isUndefined, useLateEffect } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { iconReducer } from './store/reducer';
import { IconContextProvider } from './context';
import { useControlContext } from '../../context';
import { hasSameProps } from '@publisher/extensions';
import { default as DeleteIcon } from './icons/delete';
import { default as Suggestions } from './components/suggestions';
import { default as IconPickerPopover } from './components/icon-picker/icon-picker-popover';
import { BaseControl } from '../index';
import type { Props } from './types';

function IconControl({
	suggestionsQuery,
	//
	label,
	columns,
	field,
	//
	labelChoose,
	labelIconLibrary,
	labelUploadSvg,
	//
	defaultValue,
	onChange,
	//
	className,
}: Props): MixedElement {
	const { value, setValue } = useControlContext({
		defaultValue,
		onChange,
	});

	const [currentIcon, currentIconDispatch] = useReducer(iconReducer, value);

	useLateEffect(() => {
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
		suggestionsQuery,
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

		if (target?.classList?.contains('publisher-core-is-pro-icon')) {
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
			>
				<div
					className={controlClassNames(
						'icon',
						hasIcon() ? 'icon-custom' : 'icon-none',
						isOpenModal ? 'is-open-icon-picker' : '',
						className
					)}
				>
					<Suggestions />

					{hasIcon() ? (
						<div
							className={controlInnerClassNames(
								'icon-preview',
								'icon-preview-empty'
							)}
							onClick={openModal}
						>
							<Button
								aria-label={__('Remove Icon', 'publisher-core')}
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
									label={__(
										'Icon Library',
										'publisher-blocks'
									)}
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
	 * A term a function that returns a term for preparing suggestions
	 */
	suggestionsQuery: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
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

IconControl.defaultProps = {
	labelChoose: __('Choose Icon…', 'publisher-blocks'),
	labelIconLibrary: __('Icon Library', 'publisher-blocks'),
	labelUploadSvg: __('Upload SVG', 'publisher-blocks'),
	field: 'icon',
};

// $FlowFixMe
export default memo(IconControl, hasSameProps);
