/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback, useContext } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Modal, Button, Flex } from '../../../';
import TabMenu from '../../../tabs/tab-menu';
import { IconContext } from '../../context';
import {
	isCustomIcon,
	getCustomSvgDraft,
	sanitizeRawSVGString,
} from '../../utils';
import { default as Search } from './search';
import IconLibraries, { DEFAULT_LIBRARIES } from './icon-libraries';
import LibraryFilters from './library-filters';
import CustomIconTab from './custom-icon-tab';
import RecentIcons from './recent-icons';

const TAB_LIBRARY = 'library';
const TAB_CUSTOM = 'custom';

export default function IconPickerModal({
	libraries = DEFAULT_LIBRARIES,
	search = true,
	initialActiveTab,
	onClose = () => {},
	onProRequired = () => {},
	onParseMediaForDraft = () => {},
	onUseCustomIcon = () => {},
}) {
	const { currentIcon } = useContext(IconContext);
	const instanceId = useInstanceId(IconPickerModal, 'icon-picker-modal-tabs');

	const [activeTab, setActiveTab] = useState(() => {
		if (initialActiveTab) {
			return initialActiveTab;
		}

		return isCustomIcon(currentIcon) ? TAB_CUSTOM : TAB_LIBRARY;
	});
	const [activeFilter, setActiveFilter] = useState('all');
	const [isSearching, setIsSearching] = useState(false);
	const [searchKey, setSearchKey] = useState(0);

	const initialDraft = getCustomSvgDraft(currentIcon);
	const [draftSvgString, setDraftSvgString] = useState(
		initialDraft.svgString
	);
	const [draftUploadSVG, setDraftUploadSVG] = useState(
		initialDraft.uploadSVG
	);

	const sanitizedDraft = sanitizeRawSVGString(draftSvgString);
	const hasValidDraft = sanitizedDraft !== '';
	const hasDraftInput =
		draftSvgString.trim() !== '' ||
		(draftUploadSVG &&
			typeof draftUploadSVG === 'object' &&
			draftUploadSVG.url);

	const handleFilterClick = useCallback(
		(filterName) => {
			setActiveFilter(filterName);

			if (isSearching) {
				setIsSearching(false);
				setSearchKey((key) => key + 1);
			}
		},
		[isSearching]
	);

	const handleSearchChange = useCallback((value) => {
		if (value) {
			setActiveFilter('all');
		}

		setIsSearching(Boolean(value));
	}, []);

	const handleDraftChange = useCallback(
		({ svgString, uploadSVG, media, fromMedia }) => {
			if (fromMedia && media) {
				onParseMediaForDraft(
					media,
					({ svgString: parsedSvg, uploadSVG: parsedUpload }) => {
						setDraftSvgString(parsedSvg);
						setDraftUploadSVG(parsedUpload);
					}
				);
				return;
			}

			setDraftSvgString(svgString ?? '');
			setDraftUploadSVG(uploadSVG ?? null);
		},
		[onParseMediaForDraft]
	);

	const handleClearDraft = useCallback(() => {
		setDraftSvgString('');
		setDraftUploadSVG(null);
	}, []);

	const handleUseIcon = useCallback(() => {
		if (!hasValidDraft) {
			return;
		}

		onUseCustomIcon({
			type: 'UPDATE_SVG',
			svgString: sanitizedDraft,
			uploadSVG: draftUploadSVG || '',
		});
	}, [hasValidDraft, sanitizedDraft, draftUploadSVG, onUseCustomIcon]);

	const renderFooterStatus = () => {
		if (hasValidDraft) {
			return (
				<span
					className={controlInnerClassNames(
						'icon-picker-custom-icon-footer-status',
						'is-valid'
					)}
				>
					<Icon icon="check" library="ui" iconSize={24} />
					<span
						className={controlInnerClassNames(
							'icon-picker-custom-icon-footer-status-valid-label'
						)}
					>
						{__('Valid SVG', 'blockera')}
					</span>
					{' - '}
					<span
						className={controlInnerClassNames(
							'icon-picker-custom-icon-footer-status-valid-hint'
						)}
					>
						{__('ready to insert', 'blockera')}
					</span>
				</span>
			);
		}

		if (hasDraftInput) {
			return (
				<span
					className={controlInnerClassNames(
						'icon-picker-custom-icon-footer-status',
						'is-invalid'
					)}
				>
					{__('Not a valid SVG yet', 'blockera')}
				</span>
			);
		}

		return (
			<span
				className={controlInnerClassNames(
					'icon-picker-custom-icon-footer-status',
					'is-empty'
				)}
			>
				{__('No icon selected', 'blockera')}
			</span>
		);
	};

	const customTabFooter = (
		<Flex
			className={controlInnerClassNames('icon-picker-custom-icon-footer')}
			justifyContent="space-between"
			alignItems="center"
			gap="12px"
		>
			{renderFooterStatus()}
			<Flex gap="8px">
				<Button variant="secondary" onClick={handleClearDraft}>
					{__('Clear', 'blockera')}
				</Button>
				<Button
					variant="primary"
					disabled={!hasValidDraft}
					onClick={handleUseIcon}
				>
					{__('Use icon', 'blockera')}
				</Button>
			</Flex>
		</Flex>
	);

	const modalTabs = [
		{ name: TAB_LIBRARY, title: __('Library', 'blockera') },
		{ name: TAB_CUSTOM, title: __('Custom Icon', 'blockera') },
	];

	return (
		<Modal
			headerIcon={<Icon icon={'icon'} library={'ui'} iconSize={24} />}
			className={controlInnerClassNames('icon-picker-modal')}
			headerTitle={
				<>
					{__('Icon library', 'blockera')}

					<div
						className={controlInnerClassNames(
							'icon-picker-modal-header-tabs',
							'blockera-component-tabs',
							'design-modern',
							'fit-width-tabs'
						)}
					>
						<TabMenu
							tabs={modalTabs}
							selected={activeTab}
							instanceId={instanceId}
							design="modern"
							orientation="horizontal"
							onTabClick={setActiveTab}
						/>
					</div>
				</>
			}
			isDismissible={true}
			onRequestClose={onClose}
			actions={activeTab === TAB_CUSTOM ? customTabFooter : null}
		>
			<div className={controlInnerClassNames('icon-picker-modal-body')}>
				{activeTab === TAB_LIBRARY ? (
					<div
						className={controlInnerClassNames(
							'icon-picker-modal-layout'
						)}
					>
						<LibraryFilters
							libraries={libraries}
							selected={activeFilter}
							onFilterClick={handleFilterClick}
						/>

						<div
							className={controlInnerClassNames(
								'icon-picker-modal-content'
							)}
						>
							{search && (
								<Search
									key={searchKey}
									libraries={libraries}
									onSearchChange={handleSearchChange}
								/>
							)}

							{!isSearching && <RecentIcons />}

							{!isSearching && (
								<IconLibraries
									libraries={libraries}
									activeFilter={activeFilter}
								/>
							)}
						</div>
					</div>
				) : (
					<CustomIconTab
						draftSvgString={draftSvgString}
						draftUploadSVG={draftUploadSVG}
						onDraftChange={handleDraftChange}
						onProRequired={onProRequired}
					/>
				)}
			</div>
		</Modal>
	);
}
