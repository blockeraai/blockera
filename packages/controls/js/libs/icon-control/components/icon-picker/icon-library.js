/**
 * WordPress dependencies
 */
import {
	memo,
	useRef,
	useState,
	useTransition,
	useContext,
	useEffect,
	useCallback,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { useIsVisible } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { IconContext } from '../../context';
import { getLibraryIcons } from '../../utils';
import { useDraftIconHighlight } from '../../hooks/use-draft-icon-highlight';
import { default as IconLibraryLoading } from './icon-library-loading';

const IconLibrary = ({
	lazyLoad = true,
	library,
	searchQuery = '',
	title = '',
}) => {
	const ref = useRef(null);
	const libraryBodyRef = useRef(null);

	const isVisible = useIsVisible(ref);

	const [iconsStack, setIconsStack] = useState([]);
	const [isPending, startTransition] = useTransition();
	const [isRendered, setRendered] = useState(false);

	const { handleIconSelect, handleLibraryIconQuickSelect, draftLibraryIcon } =
		useContext(IconContext);

	const buildLibraryIcons = useCallback(
		() =>
			getLibraryIcons({
				library,
				query: searchQuery,
				onClick: handleIconSelect,
				onDoubleClick: handleLibraryIconQuickSelect,
			}),
		[library, searchQuery, handleIconSelect, handleLibraryIconQuickSelect]
	);

	// Highlight draft selection via DOM class toggling (see useDraftIconHighlight).
	useDraftIconHighlight(libraryBodyRef, draftLibraryIcon, isRendered);

	// Handle non-lazy loading
	useEffect(() => {
		if (!lazyLoad && !isRendered) {
			setIconsStack([buildLibraryIcons()]);
			setRendered(true);
		}
	}, [lazyLoad, isRendered, buildLibraryIcons]);

	const loadIcons = useCallback(() => {
		if (isRendered) {
			return;
		}

		startTransition(() => {
			setIconsStack([buildLibraryIcons()]);
			setRendered(true);
		});
	}, [isRendered, buildLibraryIcons, startTransition]);

	// Handle lazy loading when component becomes visible
	useEffect(() => {
		if (lazyLoad && isVisible && !isRendered) {
			loadIcons();
		}
	}, [lazyLoad, isVisible, isRendered, loadIcons]);

	function isEmpty() {
		if (!isRendered) {
			return false;
		}

		return !iconsStack.length;
	}

	return (
		<div
			id={`icon-library-section-${library}`}
			className={controlInnerClassNames(
				'icon-library',
				'library-' + library,
				isRendered ? 'is-rendered' : '',
				isEmpty() ? 'is-empty' : ''
			)}
		>
			{title && (
				<div className={controlInnerClassNames('library-header')}>
					{title}
				</div>
			)}

			<div
				className={controlInnerClassNames('library-body')}
				ref={libraryBodyRef}
			>
				<div ref={ref}>
					{isRendered && !isPending ? (
						<>{iconsStack}</>
					) : (
						<IconLibraryLoading />
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(IconLibrary);
