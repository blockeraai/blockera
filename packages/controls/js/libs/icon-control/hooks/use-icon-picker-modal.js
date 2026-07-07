// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import {
	useState,
	useReducer,
	useCallback,
	useEffect,
	useMemo,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEmpty, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { iconReducer } from '../store/reducer';
import {
	isCustomIcon,
	sanitizeRawSVGString,
	isProIconClickBlocked,
} from '../utils';
import { parseUploadedMediaAndSetIcon } from '../helpers';
import { useRecentIcons } from './useRecentIcons';

type UseIconPickerModalOptions = {
	value: Object,
	onCommit: (nextIcon: Object) => void | Promise<void>,
	id?: string,
};

type UseIconPickerModalReturn = {
	isOpenModal: boolean,
	modalInitialTab: string,
	openModal: (event?: Object, preferredTab?: string | null) => void,
	closeModal: () => void,
	iconContextValue: Object,
	parseMediaForDraft: (media: Object, setDraft: (Object) => void) => void,
	handleUseCustomIcon: (action: Object) => void,
	clearSelectedCustomIcon: () => void,
	hasIcon: () => boolean,
	commitIconAction: (action: Object) => void,
};

/**
 * Shared icon picker modal state for IconControl and canvas toolbar triggers.
 */
export function useIconPickerModal({
	value,
	onCommit,
	id = 'icon-picker',
}: UseIconPickerModalOptions): UseIconPickerModalReturn {
	const { createNotice } = dispatch('core/notices');
	const [currentIcon, currentIconDispatch] = useReducer(iconReducer, value);
	const { recentIcons, addRecentIcon, removeRecentIcon, clearRecentIcons } =
		useRecentIcons();

	const [isOpenModal, setOpenModal] = useState(false);
	const [modalInitialTab, setModalInitialTab] = useState('library');
	const [draftLibraryIcon, setDraftLibraryIcon] = useState(null);

	useEffect(() => {
		currentIconDispatch({
			type: 'SYNC_ICON',
			iconValue: value,
		});
	}, [value]);

	const closeModal = useCallback(() => {
		setOpenModal(false);
		setDraftLibraryIcon(null);
	}, []);

	const getLibraryIconDraftFromIcon = useCallback((icon) => {
		if (isCustomIcon(icon) || !icon?.icon || !icon?.library) {
			return null;
		}

		return {
			icon: icon.icon,
			library: icon.library,
		};
	}, []);

	const dispatchActions = useCallback(
		(action) => {
			const nextIcon = iconReducer(currentIcon, action);

			addRecentIcon(action);
			currentIconDispatch(action);
			setOpenModal(false);
			onCommit(nextIcon);
		},
		[addRecentIcon, currentIcon, onCommit]
	);

	const openModal = useCallback(
		(event, preferredTab = null) => {
			event?.stopPropagation?.();

			const target = event?.target;
			if (
				target &&
				'svg' === target.nodeName &&
				'delete' === target.getAttribute('datatype')
			) {
				return;
			}

			setModalInitialTab(
				preferredTab ??
					(isCustomIcon(currentIcon) ? 'custom' : 'library')
			);
			setDraftLibraryIcon(getLibraryIconDraftFromIcon(currentIcon));
			setOpenModal(true);
		},
		[currentIcon, getLibraryIconDraftFromIcon]
	);

	const isCurrentIcon = useCallback(
		(iconName, library) =>
			currentIcon?.icon === iconName && currentIcon?.library === library,
		[currentIcon]
	);

	const isDraftLibraryIcon = useCallback(
		(iconName, library) =>
			draftLibraryIcon?.icon === iconName &&
			draftLibraryIcon?.library === library,
		[draftLibraryIcon]
	);

	/**
	 * Library tab uses a draft-then-commit flow:
	 * - single click updates draft highlight only (modal stays open)
	 * - double click or "Use icon" commits via dispatchActions (closes modal)
	 * - custom/recent SVG picks still commit immediately
	 */
	const handleLibraryIconInteraction = useCallback(
		(event, action, { commit = false } = {}) => {
			event.stopPropagation();

			if (isProIconClickBlocked(event)) {
				return;
			}

			if (action.type === 'UPDATE_SVG') {
				dispatchActions(action);
				return;
			}

			if (action.type !== 'UPDATE_ICON') {
				return;
			}

			if (commit) {
				dispatchActions(action);
				return;
			}

			setDraftLibraryIcon({
				icon: action.icon,
				library: action.library,
			});
		},
		[dispatchActions]
	);

	const handleIconSelect = useCallback(
		(event, action) => handleLibraryIconInteraction(event, action),
		[handleLibraryIconInteraction]
	);

	const handleLibraryIconQuickSelect = useCallback(
		(event, action) =>
			handleLibraryIconInteraction(event, action, { commit: true }),
		[handleLibraryIconInteraction]
	);

	const handleUseLibraryIcon = useCallback(() => {
		if (!draftLibraryIcon?.icon || !draftLibraryIcon?.library) {
			return;
		}

		dispatchActions({
			type: 'UPDATE_ICON',
			icon: draftLibraryIcon.icon,
			library: draftLibraryIcon.library,
		});
	}, [draftLibraryIcon, dispatchActions]);

	const clearLibrarySelection = useCallback(() => {
		setDraftLibraryIcon(null);

		if (!isCustomIcon(currentIcon) && currentIcon?.icon) {
			const nextIcon = iconReducer(currentIcon, { type: 'DELETE_ICON' });

			currentIconDispatch({ type: 'DELETE_ICON' });
			onCommit(nextIcon);
		}
	}, [currentIcon, onCommit]);

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

	const handleUseCustomIcon = useCallback(
		(action) => {
			dispatchActions(action);
		},
		[dispatchActions]
	);

	const clearSelectedCustomIcon = useCallback(() => {
		if (!isCustomIcon(currentIcon)) {
			return;
		}

		const nextIcon = iconReducer(currentIcon, { type: 'DELETE_ICON' });

		currentIconDispatch({ type: 'DELETE_ICON' });
		onCommit(nextIcon);
	}, [currentIcon, onCommit]);

	const hasIcon = useCallback(() => {
		if (isUndefined(currentIcon) || isEmpty(currentIcon)) {
			return false;
		}

		if (!isUndefined(currentIcon?.icon) && !isEmpty(currentIcon?.icon)) {
			return true;
		}

		if (
			!isUndefined(currentIcon?.renderedIcon) &&
			!isEmpty(currentIcon?.renderedIcon)
		) {
			return true;
		}

		if (
			!isUndefined(currentIcon?.svgString) &&
			!isEmpty(currentIcon?.svgString)
		) {
			return true;
		}

		if (
			!isUndefined(currentIcon?.uploadSVG?.url) &&
			!isEmpty(currentIcon?.uploadSVG?.url)
		) {
			return true;
		}

		return false;
	}, [currentIcon]);

	const iconContextValue = useMemo(
		() => ({
			id,
			currentIcon,
			dispatch: currentIconDispatch,
			handleIconSelect,
			isCurrentIcon,
			draftLibraryIcon,
			isDraftLibraryIcon,
			handleUseLibraryIcon,
			handleLibraryIconQuickSelect,
			clearLibrarySelection,
			recentIcons,
			removeRecentIcon,
			clearRecentIcons,
		}),
		[
			id,
			currentIcon,
			handleIconSelect,
			isCurrentIcon,
			draftLibraryIcon,
			isDraftLibraryIcon,
			handleUseLibraryIcon,
			handleLibraryIconQuickSelect,
			clearLibrarySelection,
			recentIcons,
			removeRecentIcon,
			clearRecentIcons,
		]
	);

	return {
		isOpenModal,
		modalInitialTab,
		openModal,
		closeModal,
		iconContextValue,
		parseMediaForDraft,
		handleUseCustomIcon,
		clearSelectedCustomIcon,
		hasIcon,
		commitIconAction: dispatchActions,
	};
}
