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
import { isCustomIcon, sanitizeRawSVGString } from '../utils';
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

	useEffect(() => {
		currentIconDispatch({
			type: 'SYNC_ICON',
			iconValue: value,
		});
	}, [value]);

	const closeModal = useCallback(() => {
		setOpenModal(false);
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
			setOpenModal(true);
		},
		[currentIcon]
	);

	const isCurrentIcon = useCallback(
		(iconName, library) =>
			currentIcon?.icon === iconName && currentIcon?.library === library,
		[currentIcon]
	);

	const handleIconSelect = useCallback(
		(event, action) => {
			event.stopPropagation();

			let target = event.target;

			if ('SVG' !== target.nodeName) {
				target = target.closest('svg');
			}

			if (target?.classList?.contains('blockera-is-pro-icon')) {
				return;
			}

			dispatchActions(action);
		},
		[dispatchActions]
	);

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
			recentIcons,
			removeRecentIcon,
			clearRecentIcons,
		}),
		[
			id,
			currentIcon,
			handleIconSelect,
			isCurrentIcon,
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
		hasIcon,
		commitIconAction: dispatchActions,
	};
}
