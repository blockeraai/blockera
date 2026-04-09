/**
 * External dependencies
 */
import type { KeyboardEvent } from 'react';
import { __ } from '@wordpress/i18n';
import {
	memo,
	useState,
	useEffect,
	useContext,
	useCallback,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { classNames } from '@blockera/classnames';
import { kebabCase } from '@blockera/utils';
import {
	Flex,
	Button,
	InputControl,
	NoticeControl,
	CheckboxControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import { isSlugValid } from './utils';
import type { VariableType } from './types';

export interface VariableNameEditorProps<
	T extends VariableType = VariableType,
> {
	name: string;
	slug: string;
	itemId: string | number;
	variable: T;
	allSlugs: Array<string>;
}

function VariableNameEditorComponent<T extends VariableType>({
	name,
	slug,
	itemId,
	variable,
	allSlugs,
}: VariableNameEditorProps<T>) {
	const isCreating = variable.creatingStep === true;

	// ID field: locked while creating or until user clicks/focuses ID (then editable buffer).
	const [variableSlug, setVariableSlug] = useState(slug);
	const [isIdEditable, setIsIdEditable] = useState(false);
	const [isConfirmedSlugChange, setIsConfirmedSlugChange] = useState(false);
	const [hasUserEditedSinceUnlock, setHasUserEditedSinceUnlock] =
		useState(false);

	// Sync when preset changes (e.g. navigation) or after first close (creatingStep → false).
	useEffect(() => {
		setVariableSlug(slug);
		setIsIdEditable(false);
		setHasUserEditedSinceUnlock(false);
		setIsConfirmedSlugChange(false);
	}, [name, slug, variable.creatingStep]);

	// Auto-lock when user edits ID back to saved slug.
	useEffect(() => {
		if (
			!isCreating &&
			isIdEditable &&
			hasUserEditedSinceUnlock &&
			variableSlug === slug
		) {
			setIsIdEditable(false);
			setHasUserEditedSinceUnlock(false);
		}
	}, [
		isCreating,
		isIdEditable,
		hasUserEditedSinceUnlock,
		variableSlug,
		slug,
	]);

	// ID display: while creating, slug is driven by name; else locked vs edit buffer.
	const displayedSlug = isIdEditable && !isCreating ? variableSlug : slug;

	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	const { onChange, repeaterId, valueCleanup } = useContext(
		RepeaterContext
	) as {
		repeaterId: string;
		onChange: (newValue: any) => void;
		valueCleanup: (value: any) => any;
	};

	const slugChanged = !isCreating && isIdEditable && variableSlug !== slug;
	const slugIsValid = isSlugValid(displayedSlug, allSlugs, slug);
	const showUndo = !isCreating && isIdEditable && variableSlug !== slug;
	const idFieldLocked = isCreating || !isIdEditable;
	const showMutedIdStyle = idFieldLocked;
	// After creatingStep: locked ID uses read-only (not disabled) so click/focus can unlock; while creating, disabled blocks edits.
	const idClickToEdit = !isCreating && !isIdEditable;
	const slugError =
		displayedSlug && !slugIsValid
			? (() => {
					const normalized = kebabCase(
						displayedSlug.toLowerCase().trim()
					);
					const otherSlugs = allSlugs.filter((s) => s !== slug);
					return otherSlugs.includes(normalized)
						? __(
								'This ID is already used by another font size preset.',
								'blockera'
							)
						: __(
								'Invalid ID format. Use only a–z, 0–9, and hyphens.',
								'blockera'
							);
				})()
			: null;
	const canSaveNameSlug = slugChanged && isConfirmedSlugChange && slugIsValid;

	const unlockIdField = useCallback(() => {
		setVariableSlug(slug);
		setHasUserEditedSinceUnlock(false);
		setIsIdEditable(true);
	}, [slug]);

	const handleLockedIdKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				unlockIdField();
			}
		},
		[unlockIdField]
	);

	const handleIdUndoClick = () => setVariableSlug(slug);

	const handleDiscardChanges = () => {
		setVariableSlug(slug);
		setIsConfirmedSlugChange(false);
		setIsIdEditable(false);
		setHasUserEditedSinceUnlock(false);
	};

	const handleSaveNameAndSlug = () => {
		if (!canSaveNameSlug) {
			return;
		}

		const newSlug = kebabCase(displayedSlug.toLowerCase().trim());
		changeRepeaterItem({
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			itemId,
			value: {
				...variable,
				slug: newSlug,
			},
		});
		setIsConfirmedSlugChange(false);
		setIsIdEditable(false);
		setHasUserEditedSinceUnlock(false);
	};

	const handleNameChange = useCallback(
		(newValue: string) => {
			if (variable.creatingStep) {
				const derivedSlug = kebabCase(newValue.toLowerCase().trim());
				changeRepeaterItem({
					onChange,
					valueCleanup,
					controlId,
					repeaterId,
					itemId,
					value: {
						...variable,
						name: newValue,
						slug: derivedSlug || variable.slug,
					},
				});
				return;
			}

			changeRepeaterItem({
				onChange,
				valueCleanup,
				controlId,
				repeaterId,
				itemId,
				value: {
					...variable,
					name: newValue,
				},
			});
		},
		[
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			itemId,
			variable,
		]
	);

	const handleIdChange = useCallback((newValue: string) => {
		setVariableSlug(kebabCase(newValue.toLowerCase().trim()));
		setHasUserEditedSinceUnlock(true);
	}, []);

	const handleConfirmSlugChange = useCallback((newValue: boolean) => {
		setIsConfirmedSlugChange(newValue);
	}, []);

	let idFieldHint = __('Use a–z, 0–9, and hyphens only.', 'blockera');
	if (isCreating) {
		idFieldHint = __(
			'The ID matches the name until you close this preset.',
			'blockera'
		);
	} else if (idClickToEdit) {
		idFieldHint = __(
			'Click the ID to edit. Use a–z, 0–9, and hyphens only.',
			'blockera'
		);
	}

	return (
		<Flex direction="column" gap={20}>
			<Flex direction="column" gap={20}>
				<ControlContextProvider
					value={{
						name: `font-size-name-${slug}`,
						value: name,
					}}
				>
					<InputControl
						controlAddonTypes={[]}
						label={__('Name:', 'blockera')}
						onChange={handleNameChange}
						columns="1fr 3fr"
					/>
				</ControlContextProvider>

				<ControlContextProvider
					value={{
						name: `font-size-slug-${slug}`,
						value: displayedSlug,
					}}
				>
					<div
						className={classNames('blockera-preset-id-field', {
							'is-id-readonly-muted': showMutedIdStyle,
						})}
					>
						<InputControl
							label={__('ID:', 'blockera')}
							controlAddonTypes={[]}
							disabled={isCreating}
							readOnly={idClickToEdit}
							onClick={idClickToEdit ? unlockIdField : undefined}
							onFocus={idClickToEdit ? unlockIdField : undefined}
							onKeyDown={
								idClickToEdit
									? handleLockedIdKeyDown
									: undefined
							}
							onChange={
								!isCreating && isIdEditable
									? handleIdChange
									: () => {}
							}
							columns="1fr 3fr"
							style={{
								position: 'relative',
							}}
						>
							<p
								style={{
									margin: '5px 0 0',
									color: '#707070',
									fontStyle: 'italic',
									fontSize: '13px',
								}}
							>
								{idFieldHint}
							</p>

							{showUndo && (
								<Button
									onClick={handleIdUndoClick}
									variant="tertiary"
									icon={<Icon icon="undo" iconSize="16" />}
									size="input"
									style={{
										position: 'absolute',
										right: '4px',
										top: '4px',
										padding: '2px 6px 2px 4px',
										'--blockera-controls-input-height':
											'22px',
										gap: '2px',
										fontSize: '11px',
										textTransform: 'uppercase',
										fontWeight: '500',
									}}
								>
									{__('Undo', 'blockera')}
								</Button>
							)}
						</InputControl>
					</div>
				</ControlContextProvider>
			</Flex>

			{slugError && (
				<NoticeControl type="error">{slugError}</NoticeControl>
			)}

			{slugChanged && (
				<Flex gap={15} direction="column">
					<NoticeControl type="warning">
						{__(
							'Changing the font size preset ID will break existing connections. Blocks using the old ID will lose their font size unless updated manually.',
							'blockera'
						)}
					</NoticeControl>
					<ControlContextProvider
						value={{
							name: `confirm-change-preset-slug-${slug}`,
							value: isConfirmedSlugChange,
						}}
					>
						<CheckboxControl
							checkboxLabel={__(
								'I accept that blocks using the old ID will lose their font size.',
								'blockera'
							)}
							onChange={handleConfirmSlugChange}
							isBold={true}
						/>
					</ControlContextProvider>
				</Flex>
			)}

			{canSaveNameSlug && (
				<Flex className="blockera-preset-naming-save-actions">
					<Button
						variant="tertiary"
						size="small"
						className="blockera-preset-save-actions__discard"
						onClick={handleDiscardChanges}
					>
						{__('Discard', 'blockera')}
					</Button>
					<Button
						variant="primary"
						size="small"
						className="blockera-preset-save-actions__save"
						icon={<Icon icon="check" iconSize="16" />}
						onClick={handleSaveNameAndSlug}
					>
						{__('Save', 'blockera')}
					</Button>
				</Flex>
			)}
		</Flex>
	);
}

export const VariableNameEditor = memo(VariableNameEditorComponent);
