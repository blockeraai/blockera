// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Button, Flex } from '../../../libs';

type VarPickerSearchEmptyStateProps = {
	searchQuery: string,
	onClear: () => void,
	onAddNew: (() => void) | null,
	addNewDisabled?: boolean,
};

/**
 * Unified variable-picker empty state while search is active (matches block style tab search).
 */
export function VarPickerSearchEmptyState({
	searchQuery,
	onClear,
	onAddNew,
	addNewDisabled = false,
}: VarPickerSearchEmptyStateProps): MixedElement {
	const trimmedQuery = searchQuery.trim();
	const showAddNewButton = onAddNew !== null;

	return (
		<Flex
			direction="column"
			alignItems="center"
			justifyContent="center"
			gap="15px"
			className="blockera-var-picker-search-empty"
			data-test="var-picker-search-empty"
			style={{
				marginTop: '20px',
			}}
		>
			<p style={{ margin: '0' }}>
				{sprintf(
					/* translators: %s: the search query */
					__('No results for "%s"', 'blockera'),
					trimmedQuery
				)}
			</p>

			<Flex direction="row" alignItems="center" gap="8px">
				<Button variant="tertiary" onClick={onClear} size="small">
					{__('Clear search', 'blockera')}
				</Button>

				{showAddNewButton && onAddNew !== null && (
					<Button
						variant="tertiary"
						onClick={onAddNew}
						size="small"
						disabled={addNewDisabled}
						data-test="variable-picker-search-empty-add-custom-variable"
					>
						{__('Add New', 'blockera')}
					</Button>
				)}
			</Flex>
		</Flex>
	);
}
