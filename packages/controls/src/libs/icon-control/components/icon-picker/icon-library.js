/**
 * WordPress dependencies
 */
import {
	memo,
	useRef,
	useState,
	useTransition,
	useContext,
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

	const [iconsStack] = useState([]);

	const [isPending, startTransition] = useTransition();

	const [isRendered, setRendered] = useState(false);

	const { handleIconSelect, suggestionsQuery, isCurrentIcon } =
		useContext(IconContext);

	if (!lazyLoad && !isRendered) {
		fetchLibraryIcons();
		setRendered(true);
	}

	function fetchLibraryIcons() {
		if (isRendered) {
			return true;
		}

		iconsStack.push(
			getLibraryIcons({
				library,
				query: searchQuery ? searchQuery : suggestionsQuery,
				onClick: handleIconSelect,
				isCurrentIcon,
			})
		);
	}

	function loadIcons() {
		if (isRendered) {
			return true;
		}

		startTransition(() => {
			fetchLibraryIcons();
			setRendered(true);
		});
	}

	function getIcons() {
		loadIcons();

		return <>{iconsStack}</>;
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
				{(isRendered || isVisible) && (!lazyLoad || !isPending) ? (
					<>{getIcons()}</>
				) : (
					<>
						<IconLibraryLoading />
						<div ref={ref} />
					</>
				)}
			</div>
		</div>
	);
};

export default memo(IconLibrary);
