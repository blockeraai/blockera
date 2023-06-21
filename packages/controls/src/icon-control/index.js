/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useReducer } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { Button, Icon, MediaUploader } from '@publisher/components';
import { useLateEffect } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { IconContextProvider } from './context';
import { iconReducer } from './store/reducer';
import { default as Suggestions } from './components/suggestions';
import { default as IconPickerPopover } from './components/icon-picker/icon-picker-popover';
import { default as DeleteIcon } from './icons/delete';

export default function IconControl({
	suggestionsQuery = '',
	//
	labelChoose = __('Choose Icon…', 'publisher-blocks'),
	labelIconLibrary = __('Icon Library', 'publisher-blocks'),
	labelUploadSvg = __('Upload SVG', 'publisher-blocks'),
	//
	value,
	initValue = {
		icon: '',
		library: '',
		uploadSVG: '',
	},
	//
	className,
	onValueChange = (newValue) => {
		return newValue;
	},
}) {
	const [currentIcon, currentIconDispatch] = useReducer(iconReducer, {
		...initValue,
		...value,
	});

	useLateEffect(() => {
		onValueChange(currentIcon);
	}, [currentIcon]);

	const [isOpenModal, setOpenModal] = useState(false);

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

	function dispatchActions(action) {
		currentIconDispatch(action);
		setOpenModal(false);
	}

	function hasIcon() {
		if (!currentIcon) {
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
							className="btn-delete"
							noBorder={true}
							icon={<DeleteIcon />}
							align="center"
							onClick={(e) => {
								e.stopPropagation();
								currentIconDispatch({
									type: 'DELETE_ICON',
								});
							}}
						></Button>

						{currentIcon.uploadSVG ? (
							<img
								src={currentIcon.uploadSVG.url}
								alt={currentIcon.uploadSVG.title}
							/>
						) : (
							<Icon {...currentIcon} size={50} />
						)}

						<div className={controlInnerClassNames('action-btns')}>
							<Button
								label={__('Icon Library', 'publisher-blocks')}
								onClick={openModal}
								className="btn-icon-library"
								noBorder={true}
								align="center"
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
										className="btn-upload"
										noBorder={true}
										align="center"
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
							align="center"
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
		</IconContextProvider>
	);
}
