/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { displayShortcutList, shortcutAriaLabel } from '@wordpress/keycodes';

/**
 * Props for KeyCombination component.
 */
interface KeyCombinationProps {
	keyCombination: {
		modifier?: string;
		character: string;
	};
	forceAriaLabel?: string;
}

/**
 * Renders a keyboard key combination.
 */
function KeyCombination({
	keyCombination,
	forceAriaLabel,
}: KeyCombinationProps) {
	const shortcut = keyCombination.modifier
		? displayShortcutList[keyCombination.modifier](keyCombination.character)
		: keyCombination.character;
	const ariaLabel = keyCombination.modifier
		? shortcutAriaLabel[keyCombination.modifier](keyCombination.character)
		: keyCombination.character;

	return (
		<kbd
			className="editor-keyboard-shortcut-help-modal__shortcut-key-combination"
			aria-label={forceAriaLabel || ariaLabel}
		>
			{(Array.isArray(shortcut) ? shortcut : [shortcut]).map(
				(character, index) => {
					let extraClass = '';
					if (character === '+') {
						return <Fragment key={index}>{character}</Fragment>;
					}

					if (character === 'Arrowright') {
						character = '→';
						extraClass = 'shortcut-key-large';
					}

					if (character === 'Arrowleft') {
						character = '←';
						extraClass = 'shortcut-key-large';
					}

					if (character === 'Arrowup') {
						character = '↑';
						extraClass = 'shortcut-key-large';
					}

					if (character === 'Arrowdown') {
						character = '↓';
						extraClass = 'shortcut-key-large';
					}

					return (
						<kbd
							key={index}
							className={`editor-keyboard-shortcut-help-modal__shortcut-key ${extraClass}`}
						>
							{character}
						</kbd>
					);
				}
			)}
		</kbd>
	);
}

/**
 * Props for Shortcut component.
 */
export interface ShortcutProps {
	description?: string;
	keyCombination: {
		modifier?: string;
		character: string;
	};
	aliases?: Array<{
		modifier?: string;
		character: string;
	}>;
	ariaLabel?: string;
}

/**
 * Renders a keyboard shortcut with description and key combination.
 */
function Shortcut({
	description,
	keyCombination,
	aliases = [],
	ariaLabel,
}: ShortcutProps) {
	return (
		<>
			<div className="editor-keyboard-shortcut-help-modal__shortcut-description">
				{description}
			</div>
			<div className="editor-keyboard-shortcut-help-modal__shortcut-term">
				<KeyCombination
					keyCombination={keyCombination}
					forceAriaLabel={ariaLabel}
				/>
				{aliases.map((alias, index) => (
					<Fragment key={index}>
						<span>, </span>
						<KeyCombination
							keyCombination={alias}
							forceAriaLabel={ariaLabel}
						/>
					</Fragment>
				))}
			</div>
		</>
	);
}

export default Shortcut;
