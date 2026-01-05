/**
 * WordPress dependencies
 */
import { useMemo, Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { Fill } from '@wordpress/components';

/**
 * Internal dependencies
 */
import DynamicShortcut from './DynamicShortcut';
import { getSubCategoryLabel } from '../utils';
import { subCategorySortOrder } from '../constants';
import { displayShortcutList, shortcutAriaLabel } from '@wordpress/keycodes';

/**
 * Groups shortcuts by sub-category from the blockera category.
 * Shortcuts are registered with format: blockera/sub-category-id/shortcut-id
 *
 * @param shortcuts - Array of shortcut names.
 * @return Object mapping sub-category IDs to arrays of shortcut names.
 */
function groupShortcutsBySubCategory(
	shortcuts: string[]
): Record<string, string[]> {
	const grouped: Record<string, string[]> = {};

	for (const shortcutName of shortcuts) {
		// Parse shortcut name: blockera/sub-category-id/shortcut-id
		const parts = shortcutName.split('/');
		if (parts.length >= 3 && parts[0] === 'blockera') {
			const subCategory = parts[1];
			if (!grouped[subCategory]) {
				grouped[subCategory] = [];
			}
			grouped[subCategory].push(shortcutName);
		}
	}

	return grouped;
}

/**
 * Renders combined tab number shortcuts as a single row.
 * Combines shortcuts like "switch-to-tab-1" through "switch-to-tab-9" into a single
 * display row showing: "1, 2, ... and 9" (or all numbers if 4 or fewer).
 */
function CombinedTabNumberShortcut({ shortcuts }: { shortcuts: string[] }) {
	const firstKeyCombination = useSelect(
		(select: any) => {
			const { getShortcutKeyCombination } = select(
				keyboardShortcutsStore
			);
			return getShortcutKeyCombination(shortcuts[0]);
		},
		[shortcuts]
	) as { modifier?: string; character: string } | null;

	// Extract numbers and filter out nulls
	const tabNumbers = shortcuts
		.map((name) => {
			const match = name.match(/switch-to-tab-(\d+)$/);
			return match ? parseInt(match[1], 10) : null;
		})
		.filter((num): num is number => num !== null)
		.sort((a, b) => a - b);

	if (tabNumbers.length === 0 || !firstKeyCombination) {
		return null;
	}

	// Get the modifier from the first shortcut (should be 'ctrl' for all)
	const modifier = firstKeyCombination.modifier || 'ctrl';

	// Render key combinations
	// Format: 1, 2, ... and 9
	const numbersToShow =
		tabNumbers.length > 4
			? [tabNumbers[0], tabNumbers[tabNumbers.length - 1]]
			: tabNumbers;

	// Helper function to render a single key combination
	// This function is stable since modifier doesn't change during component lifecycle
	const renderKeyCombination = (num: number) => {
		const shortcut = modifier
			? displayShortcutList[modifier](String(num))
			: String(num);
		const ariaLabel = modifier
			? shortcutAriaLabel[modifier](String(num))
			: String(num);

		return (
			<kbd
				className="editor-keyboard-shortcut-help-modal__shortcut-key-combination"
				aria-label={ariaLabel}
			>
				{(Array.isArray(shortcut) ? shortcut : [shortcut]).map(
					(character, idx) => {
						if (character === '+') {
							return <Fragment key={idx}>{character}</Fragment>;
						}
						return (
							<kbd
								key={idx}
								className="editor-keyboard-shortcut-help-modal__shortcut-key"
							>
								{character}
							</kbd>
						);
					}
				)}
			</kbd>
		);
	};

	return (
		<li className="editor-keyboard-shortcut-help-modal__shortcut">
			<div className="editor-keyboard-shortcut-help-modal__shortcut-description">
				{__('Switch to tab by tab number.', 'blockera')}
			</div>
			<div className="editor-keyboard-shortcut-help-modal__shortcut-term blockera-keyboard-shortcuts-extension__tab-number-shortcuts">
				{numbersToShow.map((num, index) => {
					const showEllipsisBefore =
						tabNumbers.length > 3 &&
						index === numbersToShow.length - 1;

					return (
						<Fragment key={num}>
							{showEllipsisBefore && (
								<span>... {__('and', 'blockera')}</span>
							)}
							{renderKeyCombination(num)}
						</Fragment>
					);
				})}
			</div>
		</li>
	);
}

/**
 * Renders a list of shortcuts.
 */
function ShortcutList({ shortcuts }: { shortcuts: string[] }) {
	// Separate tab number shortcuts from other shortcuts
	const tabNumberShortcuts = shortcuts.filter((name) =>
		/^blockera\/tabs\/switch-to-tab-[1-9]$/.test(name)
	);
	const otherShortcuts = shortcuts.filter(
		(name) => !/^blockera\/tabs\/switch-to-tab-[1-9]$/.test(name)
	);

	return (
		<ul className="editor-keyboard-shortcut-help-modal__shortcut-list">
			{/* Render other shortcuts first */}
			{otherShortcuts.map((shortcutName, index) => (
				<li
					key={index}
					className="editor-keyboard-shortcut-help-modal__shortcut"
				>
					<DynamicShortcut name={shortcutName} />
				</li>
			))}
			{/* Render combined tab number shortcuts if any exist */}
			{tabNumberShortcuts.length > 0 && (
				<CombinedTabNumberShortcut shortcuts={tabNumberShortcuts} />
			)}
		</ul>
	);
}

/**
 * Blockera icon SVG component.
 */
const BlockeraIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M20.1333 6.69565L12 11.3913L3.86673 6.69565L12 2L20.1333 6.69565ZM11.2174 15.6808V12.9499C11.2174 12.6701 11.0683 12.4118 10.8261 12.2721L3 7.75374V16.7541L10.9239 21.3289C11.0542 21.404 11.2174 21.3101 11.2174 21.1594V18.5937C11.2174 18.454 11.1427 18.3248 11.0217 18.2548L10.2391 17.8028C10.1182 17.7328 10.0435 17.6037 10.0435 17.464V15.5114C10.0435 15.4362 10.1249 15.3889 10.1902 15.4264L10.9239 15.8502C11.0542 15.9254 11.2174 15.8314 11.2174 15.6808ZM8.33152 17.8752L4.95652 15.9265V14.3613L8.28261 16.2814C8.40352 16.3515 8.47826 16.4806 8.47826 16.6203V17.7903C8.47826 17.8654 8.39687 17.9128 8.33152 17.8752ZM8.33152 14.7448L4.95652 12.7961V11.2309L8.28261 13.151C8.40352 13.221 8.47826 13.3502 8.47826 13.4899V14.6599C8.47826 14.735 8.39687 14.7824 8.33152 14.7448ZM12.7826 12.5046L21 7.76039V16.7604L12.7826 21.5046V12.5046Z"
		/>
	</svg>
);

/**
 * Renders a section with a title and shortcuts.
 */
function ShortcutSection({
	title,
	shortcuts,
	className,
	showIcon = false,
}: {
	title: string;
	shortcuts: string[];
	className?: string;
	showIcon?: boolean;
}) {
	// Allow empty shortcuts for header-only sections
	const sectionClassName = className
		? `editor-keyboard-shortcut-help-modal__section ${className}`
		: 'editor-keyboard-shortcut-help-modal__section';

	return (
		<section className={sectionClassName}>
			{title && (
				<h2 className="editor-keyboard-shortcut-help-modal__section-title">
					{showIcon && <BlockeraIcon />}
					{title}
				</h2>
			)}
			{shortcuts.length > 0 && <ShortcutList shortcuts={shortcuts} />}
		</section>
	);
}

/**
 * Component that extends the keyboard shortcuts help modal with Blockera shortcuts.
 * Injects custom sections at the beginning of the modal, grouped by sub-category.
 * Uses the slot system to render content into the keyboard shortcuts help modal.
 */
export default function KeyboardShortcutsExtension(): React.ReactNode {
	// Get all shortcuts from the blockera category
	const blockeraShortcuts = useSelect((select: any) => {
		return select(keyboardShortcutsStore).getCategoryShortcuts('blockera');
	}, []) as string[];

	// Group shortcuts by sub-category
	const shortcutsBySubCategory = useMemo(() => {
		return groupShortcutsBySubCategory(blockeraShortcuts);
	}, [blockeraShortcuts]);

	// Get sorted sub-category IDs using the static sort order
	// Sub-categories in subCategorySortOrder appear first (in that order),
	// followed by any other sub-categories (sorted alphabetically)
	const subCategoryIds = Object.keys(shortcutsBySubCategory).sort((a, b) => {
		const indexA = subCategorySortOrder.indexOf(a);
		const indexB = subCategorySortOrder.indexOf(b);

		// Both are in the sort order: sort by their position in the array
		if (indexA !== -1 && indexB !== -1) {
			return indexA - indexB;
		}
		// Only A is in the sort order: A comes first
		if (indexA !== -1) return -1;
		// Only B is in the sort order: B comes first
		if (indexB !== -1) return 1;
		// Neither is in the sort order: sort alphabetically (both come after sorted ones)
		return a.localeCompare(b);
	});

	// Render using Fill into the keyboard shortcuts help modal slot
	// The slot system handles checking if the modal is active via isActive function
	return (
		<Fill name="blockera/slots/keyboard-shortcut-help-modal">
			<>
				{/* Sub-category sections */}
				{subCategoryIds.map((subCategoryId) => {
					const shortcuts = shortcutsBySubCategory[subCategoryId];
					if (shortcuts.length === 0) {
						return null;
					}

					return (
						<ShortcutSection
							key={subCategoryId}
							title={getSubCategoryLabel(subCategoryId)}
							shortcuts={shortcuts}
							showIcon={true}
						/>
					);
				})}
			</>
		</Fill>
	);
}
