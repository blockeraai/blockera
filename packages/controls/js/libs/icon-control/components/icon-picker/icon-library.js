/**
 * WordPress dependencies
 */
import {
	memo,
	useRef,
	useState,
	useTransition,
	useContext,
	useMemo,
	useCallback,
} from '@wordpress/element';

/**
 * External dependencies
 */
import { FixedSizeGrid } from 'react-window';

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

// Cache for storing icon data
const iconCache = new Map();

// Constants for grid layout
const GRID_CONFIG = {
	COLUMN_COUNT: 7,
	ICON_SIZE: 24,
	CELL_PADDING: 8,
	CELL_SIZE: 40, // ICON_SIZE + (CELL_PADDING * 2)
	GRID_HEIGHT: 300,
	GRID_WIDTH: 280, // CELL_SIZE * COLUMN_COUNT
};

const IconLibrary = ({
	lazyLoad = true,
	library,
	searchQuery = '',
	title = '',
}) => {
	const ref = useRef(null);
	const isVisible = useIsVisible(ref);
	const [isPending, startTransition] = useTransition();
	const [isRendered, setRendered] = useState(false);
	const { handleIconSelect, isCurrentIcon } = useContext(IconContext);

	// Memoized icons data
	const icons = useMemo(() => {
		const cacheKey = `${library}-${searchQuery}`;
		if (iconCache.has(cacheKey)) {
			return iconCache.get(cacheKey);
		}

		const iconData = getLibraryIcons({
			library,
			query: searchQuery,
			onClick: handleIconSelect,
			isCurrentIcon,
		});

		iconCache.set(cacheKey, iconData);
		return iconData;
	}, [library, searchQuery, handleIconSelect, isCurrentIcon]);

	const loadIcons = useCallback(() => {
		if (isRendered) return;

		startTransition(() => {
			setRendered(true);
		});
	}, [isRendered]);

	// Grid item renderer
	const Cell = ({ columnIndex, rowIndex, style }) => {
		const index = rowIndex * GRID_CONFIG.COLUMN_COUNT + columnIndex;
		if (index >= icons.length) return null;

		const cellStyle = {
			...style,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: GRID_CONFIG.CELL_PADDING,
			cursor: 'pointer',
			transition: 'all 0.2s ease',
		};

		return (
			<div style={cellStyle}>
				<div
					style={{
						width: GRID_CONFIG.ICON_SIZE,
						height: GRID_CONFIG.ICON_SIZE,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{icons[index]}
				</div>
			</div>
		);
	};

	const isEmpty = isRendered && (!icons || icons.length === 0);

	if (!lazyLoad && !isRendered) {
		loadIcons();
	}

	return (
		<div
			className={controlInnerClassNames(
				'icon-library',
				'library-' + library,
				isRendered ? 'is-rendered' : '',
				isEmpty ? 'is-empty' : ''
			)}
		>
			{title && (
				<div className={controlInnerClassNames('library-header')}>
					{title}
				</div>
			)}

			<div className={controlInnerClassNames('library-body')} ref={ref}>
				{(isRendered || isVisible) && (!lazyLoad || !isPending) ? (
					<div style={{ margin: '0 auto' }}>
						<FixedSizeGrid
							className={controlInnerClassNames('library-grid')}
							columnCount={GRID_CONFIG.COLUMN_COUNT}
							columnWidth={GRID_CONFIG.CELL_SIZE}
							height={GRID_CONFIG.GRID_HEIGHT}
							rowCount={Math.ceil(
								icons.length / GRID_CONFIG.COLUMN_COUNT
							)}
							rowHeight={GRID_CONFIG.CELL_SIZE}
							width={GRID_CONFIG.GRID_WIDTH}
						>
							{Cell}
						</FixedSizeGrid>
					</div>
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
