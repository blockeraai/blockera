/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	Button,
	FlexItem,
	__experimentalGrid as Grid,
} from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';
import { useState, useReducer } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { close } from '@wordpress/icons';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Style dependencies
 */
import './style.scss';

/**
 * Internal dependencies
 */
import { Modal, InspectElement, Icon } from '@publisher/components';
import { getIcon, publisherBlue } from '@publisher/icons';
import { getRecommendation } from './data';
import { IconContextProvider } from './context';
import IconTabPanel from './components/icon-tab-panel';
import { iconReducer } from './store/reducer';

export default function IconControl({
	value,
	title,
	isOpen,
	attributes,
	setAttributes,
	label = 'icon',
	advancedSearch = '',
}) {
	function handleOnIconClick(event, action) {
		let target = event.target;

		if ('SVG' !== target.nodeName) {
			target = target.closest('svg');
		}

		dispatchActions(action);
	}

	const recommendationList = getRecommendation({
		limit: 6,
		handleOnIconClick,
		fixedSizing: true,
		size: attributes.size,
		search: advancedSearch,
	});
	const [iconInfo, dispatch] = useReducer(iconReducer, {
		name: recommendationList[0]
			? recommendationList[0].props.iconname.name ?? value
			: value,
		size: attributes.size,
		type: recommendationList[0]
			? recommendationList[0].props.icon.iconType ?? 'wp'
			: 'wp',
		uploadSVG: attributes.uploadSVG,
	});

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
	const closeModal = () => setOpenModal(false);
	const defaultIconState = {
		iconInfo,
		dispatch,
		recommendationList: getRecommendation({
			size: iconInfo.size,
			handleOnIconClick,
			search: advancedSearch,
		}),
		handleOnIconClick,
	};

	function dispatchActions(action) {
		dispatch(action);
		setAttributes({
			...attributes,
			icon: iconInfo.name,
			size: iconInfo.size,
			iconType: iconInfo.type,
		});
		closeModal();
	}

	return (
		<IconContextProvider {...defaultIconState}>
			<InspectElement title={title} initialOpen={isOpen}>
				<VStack>
					<VStack>
						<FlexItem>{label.toUpperCase()}</FlexItem>
						<FlexItem
							onClick={openModal}
							className={`publisher-icon-transparent-bg`}
						>
							<Icon
								type="wp"
								className="p-blocks-icon-control__delete"
								icon={close}
								size={24}
								datatype="delete"
								onClick={() =>
									dispatch({ type: 'DELETE_ICON' })
								}
							/>
							<Icon
								size={22}
								type={iconInfo.type}
								icon={getIcon(iconInfo.name, iconInfo.type)}
								uploadedSVG={iconInfo.uploadSVG}
								className={classnames('p-blocks-current-icon')}
							/>
						</FlexItem>

						<Grid
							className="publisher-icon-recommended"
							columns={
								recommendationList.length > 6
									? 6
									: recommendationList.length
							}
							gap={0}
						>
							{recommendationList}
						</Grid>
					</VStack>

					<HStack
						justify="space-between"
						className="publisher-icon-actions"
					>
						<Button
							label={__('Icon Library', 'publisher-blocks')}
							variant="secondary"
							onClick={openModal}
						>
							{__('Icon Library', 'publisher-blocks')}
						</Button>

						<MediaUpload
							onSelect={(media) => {
								dispatch({
									type: 'UPDATE_SVG',
									uploadSVG: {
										title: media.title,
										filename: media.filename,
										url: media.url,
										updated: '',
									},
								});
								setAttributes({
									...attributes,
									uploadSVG: {
										title: media.title,
										filename: media.filename,
										url: media.url,
										updated: '',
									},
									icon: '',
								});
							}}
							multiple={false}
							render={({ open }) => (
								<>
									<Button
										label={__(
											'Upload SVG',
											'publisher-blocks'
										)}
										variant="secondary"
										onClick={open}
									>
										{__('Upload SVG', 'publisher-blocks')}
									</Button>
								</>
							)}
						/>
					</HStack>
				</VStack>
			</InspectElement>

			{isOpenModal && (
				<Modal
					headerTitle={__('ICON LIBRARY', 'publisher-blocks')}
					onRequestClose={closeModal}
					headerIcon={
						<Icon
							type="publisher"
							size={22}
							icon={publisherBlue}
							className="p-blocks-m-header-icon"
						/>
					}
				>
					<HStack justify="space-between">
						<IconTabPanel />
					</HStack>
				</Modal>
			)}
		</IconContextProvider>
	);
}
