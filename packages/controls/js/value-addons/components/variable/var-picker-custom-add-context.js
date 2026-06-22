// @flow
/**
 * External dependencies
 */
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from '@wordpress/element';

export type VarPickerCustomAddAction = {
	onClick: () => void,
	label: string,
	dataTest?: string,
	canAdd: boolean,
	disabled?: boolean,
} | null;

type VarPickerCustomAddContextValue = {
	/** @deprecated Prefer getAction(variableType) for multi-type pickers. */
	action: VarPickerCustomAddAction,
	getAction: (variableType: string) => VarPickerCustomAddAction,
	register: (
		variableType: string,
		action: VarPickerCustomAddAction
	) => () => void,
};

const VarPickerCustomAddContext: React$Context<VarPickerCustomAddContextValue | null> =
	createContext(null);

export function VarPickerCustomAddProvider({
	children,
}: {
	children: React$Node,
}): React$Node {
	const [actionsByType, setActionsByType] = useState<{
		[string]: VarPickerCustomAddAction,
	}>({});

	const register = useCallback(
		(variableType: string, nextAction: VarPickerCustomAddAction) => {
			const typeKey = String(variableType || '').trim();
			if (typeKey === '') {
				return () => {};
			}

			setActionsByType((prev) => {
				if (nextAction === null) {
					if (!(typeKey in prev)) {
						return prev;
					}
					const next = { ...prev };
					delete next[typeKey];
					return next;
				}

				return {
					...prev,
					[typeKey]: nextAction,
				};
			});

			return () => {
				setActionsByType((prev) => {
					if (!(typeKey in prev)) {
						return prev;
					}
					const next = { ...prev };
					delete next[typeKey];
					return next;
				});
			};
		},
		[]
	);

	const getAction = useCallback(
		(variableType: string): VarPickerCustomAddAction => {
			const typeKey = String(variableType || '').trim();
			if (typeKey === '') {
				return null;
			}
			return actionsByType[typeKey] ?? null;
		},
		[actionsByType]
	);

	const action = useMemo((): VarPickerCustomAddAction => {
		const keys = Object.keys(actionsByType);
		if (keys.length === 1) {
			return actionsByType[keys[0]] ?? null;
		}
		return null;
	}, [actionsByType]);

	const value = useMemo(
		() => ({
			action,
			getAction,
			register,
		}),
		[action, getAction, register]
	);

	return (
		<VarPickerCustomAddContext.Provider value={value}>
			{children}
		</VarPickerCustomAddContext.Provider>
	);
}

export function useVarPickerCustomAddContext(): VarPickerCustomAddContextValue | null {
	return useContext(VarPickerCustomAddContext);
}
