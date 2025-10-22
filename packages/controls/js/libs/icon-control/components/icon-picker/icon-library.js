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
import { default as IconLibraryLoading } from './icon-library-loading';

const IconLibrary = ({
	lazyLoad = true,
	library,
	searchQuery = '',
	title = '',
}) => {
	const ref = useRef(null);

	const isVisible = useIsVisible(ref);

	const [iconsStack, setIconsStack] = useState([]);
	const [isPending, startTransition] = useTransition();
	const [isRendered, setRendered] = useState(false);

	const { handleIconSelect, isCurrentIcon } = useContext(IconContext);

	// Handle non-lazy loading
	useEffect(() => {
		if (!lazyLoad && !isRendered) {
			const icons = getLibraryIcons({
				library,
				query: searchQuery,
				onClick: handleIconSelect,
				isCurrentIcon,
			});

			setIconsStack([icons]);
			setRendered(true);
		}
	}, [lazyLoad, isRendered]);

	// Handle lazy loading when component becomes visible
	useEffect(() => {
		if (lazyLoad && isVisible && !isRendered) {
			loadIcons();
		}
	}, [lazyLoad, isVisible, isRendered]);

	function loadIcons() {
		if (isRendered) {
			return;
		}

		startTransition(() => {
			const icons = getLibraryIcons({
				library,
				query: searchQuery,
				onClick: handleIconSelect,
				isCurrentIcon,
			});

			setIconsStack([icons]);
			setRendered(true);
		});
	}

	function isEmpty() {
		if (!isRendered) {
			return false;
		}

		return !iconsStack.length;
	}

	return (
		<div
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

			<div className={controlInnerClassNames('library-body')} ref={ref}>
				{isRendered && !isPending ? (
					<>{iconsStack}</>
				) : (
					<IconLibraryLoading />
				)}
			</div>
		</div>
	);
};

export default memo(IconLibrary);
