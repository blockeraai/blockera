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
import { useState } from '@wordpress/element';
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
import { getIcon } from '@publisher/icons';
import { getRecommendation } from '@publisher/icons-data';
import { IconContextProvider } from './context';
import { publisherBlue } from '@publisher/icons';
import IconTabPanel from './components/icon-tab-panel';

export default function IconControl({
	value,
	title,
	isOpen,
	attributes,
	setAttributes,
	label = 'icon',
	advancedSearch = '',
}) {
	const [size, setSize] = useState(16);
	const [isOpenModal, setOpenModal] = useState(false);
	const handleOnIconClick = (event, iconType) => {
		let target = event.target;

		if ('SVG' !== target.nodeName) {
			target = target.closest('svg');
		}

		setStates({ icon: target.getAttribute('datatype'), iconType });
		closeModal();
	};
	const recommendationList = getRecommendation({
		size,
		limit: 6,
		handleOnIconClick,
		fixedSizing: true,
		search: advancedSearch,
	});
	const [icon, updateIcon] = useState(
		recommendationList[0]
			? recommendationList[0].props.iconname.name ?? value
			: value
	);
	const [iconType, setIconType] = useState(
		recommendationList[0]
			? recommendationList[0].props.icon.iconType ?? 'wp'
			: 'wp'
	);
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
	const setStates = ({ icon, iconType }) => {
		updateIcon(icon);
		setAttributes({
			...attributes,
			icon,
			iconType,
			uploadSVG: null,
		});
		setIconType(iconType);
	};

	const defaultIconState = {
		size,
		setSize,
		recommendationList: getRecommendation({
			size,
			handleOnIconClick,
			search: advancedSearch,
		}),
		handleOnIconClick,
	};

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
									setStates({ icon: null, iconType: null })
								}
							/>
							<Icon
								size={22}
								type={iconType}
								icon={getIcon(icon, iconType)}
								uploadedSVG={attributes.uploadSVG}
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
