/**
 * External dependencies
 */
import type { KeyboardEvent, ReactNode } from 'react';
import { __ } from '@wordpress/i18n';
import {
	memo,
	useState,
	useEffect,
	useLayoutEffect,
	useContext,
	useCallback,
	useRef,
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
	Tooltip,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import { isSlugValid } from './utils';
import type { VariableType } from './types';

export interface SharedPresetControlsProps<
	T extends VariableType = VariableType,
> {
	name: string;
	slug: string;
	itemId: string | number;
	variable: T;
	allSlugs: Array<string>;
	children?: ReactNode;
}

function SharedPresetControlsComponent<T extends VariableType>({
	name,
	slug,
	itemId,
	variable,
	allSlugs,
	children,
}: SharedPresetControlsProps<T>) {
	const isCreating = variable.creatingStep === true;

	// ID field: locked while creating or until user clicks/focuses ID (then editable buffer).
	const [variableSlug, setVariableSlug] = useState(slug);
	const [isIdEditable, setIsIdEditable] = useState(false);
	const [isConfirmedSlugChange, setIsConfirmedSlugChange] = useState(false);
	const [hasUserEditedSinceUnlock, setHasUserEditedSinceUnlock] =
		useState(false);
	const presetIdFieldContainerRef = useRef<HTMLDivElement>(null);
	const focusIdInputAfterUnlockRef = useRef(false);

	// After explicit unlock only: move focus into the ID input (e.g. Edit button keeps focus on the button).
	useLayoutEffect(() => {
		if (!focusIdInputAfterUnlockRef.current || !isIdEditable) {
			return;
		}
		focusIdInputAfterUnlockRef.current = false;
		const input = presetIdFieldContainerRef.current?.querySelector(
			'input'
		) as HTMLInputElement | null | undefined;
		input?.focus();
	}, [isIdEditable]);

	// Sync when preset changes (e.g. navigation) or after first close (creatingStep → false).
	useEffect(() => {
		setVariableSlug(slug);
		setIsIdEditable(false);
		setHasUserEditedSinceUnlock(false);
		setIsConfirmedSlugChange(false);
	}, [name, slug, variable.creatingStep]);

	// Auto-lock when user edits ID back to saved slug.
	useEffect(() => {
		if (isIdEditable && hasUserEditedSinceUnlock && variableSlug === slug) {
			setIsIdEditable(false);
			setHasUserEditedSinceUnlock(false);
		}
	}, [isIdEditable, hasUserEditedSinceUnlock, variableSlug, slug]);

	// ID display: while creating, slug is driven by name; else locked vs edit buffer.
	const displayedSlug = isIdEditable ? variableSlug : slug;

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
	const showUndo = isIdEditable && variableSlug !== slug;
	const idFieldLocked = !isIdEditable;
	const showMutedIdStyle = idFieldLocked;
	// After creatingStep: locked ID uses read-only (not disabled) so click/focus can unlock; while creating, disabled blocks edits.
	const idClickToEdit = !isIdEditable;
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
		focusIdInputAfterUnlockRef.current = true;
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
					>
						<ControlContextProvider
							value={{
								name: `font-size-slug-${slug}`,
								value: displayedSlug,
							}}
						>
							<div
								ref={presetIdFieldContainerRef}
								className={classNames(
									'blockera-preset-id-field',
									{
										'is-id-readonly-muted':
											showMutedIdStyle,
									}
								)}
							>
								<InputControl
									label={
										<>
											{__('ID:', 'blockera')}

											<Tooltip
												text={idFieldHint}
												delay={0}
											>
												<span
													style={{
														cursor: 'pointer',
														display: 'flex',
														alignItems: 'center',
													}}
												>
													<Icon
														icon="information"
														iconSize="16"
														style={{
															fill: 'var(--blockera-controls-border-color-soft)',
														}}
													/>
												</span>
											</Tooltip>
										</>
									}
									controlAddonTypes={[]}
									readOnly={idClickToEdit}
									onClick={
										idClickToEdit
											? unlockIdField
											: undefined
									}
									onFocus={
										idClickToEdit
											? unlockIdField
											: undefined
									}
									onKeyDown={
										idClickToEdit
											? handleLockedIdKeyDown
											: undefined
									}
									onChange={
										isIdEditable ? handleIdChange : () => {}
									}
									columns="1fr 4fr"
									style={{
										position: 'relative',
									}}
								>
									{showUndo && (
										<Button
											onClick={handleIdUndoClick}
											variant="tertiary"
											icon={
												<Icon
													icon="undo"
													iconSize="16"
												/>
											}
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

									{idClickToEdit && (
										<Button
											onClick={unlockIdField}
											variant="tertiary"
											icon={
												<Icon
													icon="pen"
													iconSize="16"
												/>
											}
											size="input"
											style={{
												position: 'absolute',
												right: '4px',
												top: '4px',
												padding: '2px',
												'--blockera-controls-input-height':
													'22px',
												gap: '2px',
												fontSize: '11px',
												textTransform: 'uppercase',
												fontWeight: '500',
												backgroundColor: '#ffffff',
												minWidth: '24px',
											}}
										></Button>
									)}
								</InputControl>
							</div>
						</ControlContextProvider>
					</InputControl>
				</ControlContextProvider>
			</Flex>

			{children ? (
				<Flex direction="column" gap={16}>
					{children}
				</Flex>
			) : null}

			{slugError && (
				<NoticeControl type="error">{slugError}</NoticeControl>
			)}

			{slugChanged && (
				<Flex gap={15} direction="column">
					<NoticeControl type="warning">
						{__(
							'Changing the variable ID will break existing connections. Blocks using the old ID will lose their variable unless updated manually.',
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
								'I accept that blocks using the old ID will lose their variables.',
								'blockera'
							)}
							onChange={handleConfirmSlugChange}
							isBold={true}
						/>
					</ControlContextProvider>
				</Flex>
			)}

			{slugChanged && (
				<Flex className="blockera-preset-naming-save-actions">
					<Button
						size="small"
						variant="tertiary"
						onClick={handleDiscardChanges}
						className="blockera-preset-save-actions__discard"
					>
						{__('Discard', 'blockera')}
					</Button>
					<Button
						size="small"
						variant="primary"
						onClick={handleSaveNameAndSlug}
						disabled={!canSaveNameSlug}
						className="blockera-preset-save-actions__save"
						icon={<Icon icon="save" iconSize="16" library="wp" />}
					>
						{__('Save', 'blockera')}
					</Button>
				</Flex>
			)}
		</Flex>
	);
}

export const SharedPresetControls = memo(SharedPresetControlsComponent);
