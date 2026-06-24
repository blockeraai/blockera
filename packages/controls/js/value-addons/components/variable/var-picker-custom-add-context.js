// @flow
/**
 * External dependencies
 */
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';

export type VarPickerCustomAddAction = {
	onClick: () => void,
	label: string,
	dataTest?: string,
	canAdd: boolean,
	disabled?: boolean,
} | null;

export function areVarPickerCustomAddActionsEqual(
	a: VarPickerCustomAddAction,
	b: VarPickerCustomAddAction
): boolean {
	if (a === b) {
		return true;
	}

	if (a === null || b === null || a === undefined || b === undefined) {
		return a === b;
	}

	return (
		a.label === b.label &&
		a.dataTest === b.dataTest &&
		a.canAdd === b.canAdd &&
		a.disabled === b.disabled
	);
}

type VarPickerCustomAddContextValue = {
	/** @deprecated Prefer getAction(variableType) for multi-type pickers. */
	action: VarPickerCustomAddAction,
	getAction: (variableType: string) => VarPickerCustomAddAction,
	register: (
		variableType: string,
		action: VarPickerCustomAddAction
	) => () => void,
};

type VarPickerCustomAddRegisterContextValue = {
	register: (
		variableType: string,
		action: VarPickerCustomAddAction
	) => () => void,
};

const VarPickerCustomAddContext: React$Context<VarPickerCustomAddContextValue | null> =
	createContext(null);

const VarPickerCustomAddRegisterContext: React$Context<VarPickerCustomAddRegisterContextValue | null> =
	createContext(null);

export function VarPickerCustomAddProvider({
	children,
}: {
	children: React$Node,
}): React$Node {
	const [actionsByType, setActionsByType] = useState<{
		[string]: VarPickerCustomAddAction,
	}>({});
	const actionsByTypeRef = useRef(actionsByType);
	actionsByTypeRef.current = actionsByType;

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

				if (prev[typeKey] === nextAction) {
					return prev;
				}

				if (
					areVarPickerCustomAddActionsEqual(prev[typeKey], nextAction)
				) {
					return prev;
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
			return actionsByTypeRef.current[typeKey] ?? null;
		},
		[]
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

	const registerContextValue = useMemo(
		() => ({
			register,
		}),
		[register]
	);

	return (
		<VarPickerCustomAddRegisterContext.Provider
			value={registerContextValue}
		>
			<VarPickerCustomAddContext.Provider value={value}>
				{children}
			</VarPickerCustomAddContext.Provider>
		</VarPickerCustomAddRegisterContext.Provider>
	);
}

export function useVarPickerCustomAddRegister():
	| ((variableType: string, action: VarPickerCustomAddAction) => () => void)
	| null {
	return useContext(VarPickerCustomAddRegisterContext)?.register ?? null;
}

export function useVarPickerCustomAddContext(): VarPickerCustomAddContextValue | null {
	return useContext(VarPickerCustomAddContext);
}
