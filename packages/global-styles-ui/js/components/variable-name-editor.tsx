/**
 * External dependencies
 */
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
	// ID field: locked by default, Edit to unlock. Only variableSlug when editable.
	const [variableSlug, setVariableSlug] = useState(slug);
	const [isIdEditable, setIsIdEditable] = useState(false);
	const [isConfirmedSlugChange, setIsConfirmedSlugChange] = useState(false);
	const [hasUserEditedSinceUnlock, setHasUserEditedSinceUnlock] =
		useState(false);

	// Sync when preset changes (e.g. navigation).
	useEffect(() => {
		setVariableSlug(slug);
		setIsIdEditable(false);
		setHasUserEditedSinceUnlock(false);
	}, [name, slug]);

	// Auto-lock when user edits ID back to saved slug.
	useEffect(() => {
		if (isIdEditable && hasUserEditedSinceUnlock && variableSlug === slug) {
			setIsIdEditable(false);
			setHasUserEditedSinceUnlock(false);
		}
	}, [isIdEditable, hasUserEditedSinceUnlock, variableSlug, slug]);

	// ID display: when locked always show saved slug; when editable show local variableSlug.
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

	const slugChanged = isIdEditable && variableSlug !== slug;
	const slugIsValid = isSlugValid(displayedSlug, allSlugs, slug);
	const showUndo = isIdEditable && variableSlug !== slug;
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

	const handleIdEditClick = () => {
		setVariableSlug(slug);
		setHasUserEditedSinceUnlock(false);
		setIsIdEditable(true);
	};

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
						className={`blockera-preset-id-field${!isIdEditable ? ' is-locked' : ''}`}
					>
						<InputControl
							label={__('ID:', 'blockera')}
							controlAddonTypes={[]}
							disabled={!isIdEditable}
							onChange={isIdEditable ? handleIdChange : () => {}}
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
								{__(
									'Use a–z, 0–9, and hyphens only.',
									'blockera'
								)}
							</p>

							{!isIdEditable ? (
								<Button
									onClick={handleIdEditClick}
									variant="tertiary"
									icon={<Icon icon="pen" iconSize="16" />}
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
									{__('Edit', 'blockera')}
								</Button>
							) : (
								showUndo && (
									<Button
										onClick={handleIdUndoClick}
										variant="tertiary"
										icon={
											<Icon icon="undo" iconSize="16" />
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
								)
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
