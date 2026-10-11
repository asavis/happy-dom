import UIEvent from '../UIEvent.js';
import type IKeyboardEventInit from './IKeyboardEventInit.js';

/**
 * Modifier keys set by the "modifier" prefixed properties of the event init (e.g. "modifierAltGraph").
 *
 * @see https://w3c.github.io/uievents/#dictdef-eventmodifierinit
 */
const INIT_MODIFIER_KEYS = [
	'AltGraph',
	'CapsLock',
	'Fn',
	'FnLock',
	'Hyper',
	'NumLock',
	'ScrollLock',
	'Super',
	'Symbol',
	'SymbolLock'
];

/**
 *
 */
export default class KeyboardEvent extends UIEvent {
	public static DOM_KEY_LOCATION_STANDARD = 0;
	public static DOM_KEY_LOCATION_LEFT = 1;
	public static DOM_KEY_LOCATION_RIGHT = 2;
	public static DOM_KEY_LOCATION_NUMPAD = 3;
	public readonly altKey: boolean;
	public readonly code: string;
	public readonly ctrlKey: boolean;
	public readonly isComposing: boolean;
	public readonly key: string;
	public readonly location: number;
	public readonly metaKey: boolean;
	public readonly repeat: boolean;
	public readonly shiftKey: boolean;

	/**
	 * @deprecated
	 */
	public readonly keyCode: number;

	/**
	 * @deprecated
	 */
	public readonly which: number;

	#modifierState: Set<string>;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IKeyboardEventInit | null = null) {
		super(type, eventInit);

		this.altKey = eventInit?.altKey ?? false;
		this.code = eventInit?.code ?? '';
		this.ctrlKey = eventInit?.ctrlKey ?? false;
		this.isComposing = eventInit?.isComposing ?? false;
		this.key = eventInit?.key ?? '';
		this.location = eventInit?.location ?? 0;
		this.metaKey = eventInit?.metaKey ?? false;
		this.repeat = eventInit?.repeat ?? false;
		this.shiftKey = eventInit?.shiftKey ?? false;
		this.keyCode = eventInit?.keyCode ?? 0;
		this.which = eventInit?.which ?? eventInit?.keyCode ?? 0;
		this.#modifierState = new Set(
			INIT_MODIFIER_KEYS.filter((key) => eventInit?.[<keyof IKeyboardEventInit>`modifier${key}`])
		);
	}

	/**
	 * Returns the state of a modifier key.
	 *
	 * @see https://w3c.github.io/uievents/#dom-keyboardevent-getmodifierstate
	 * @param key A modifier key value (case-sensitive, e.g. "Alt" or "AltGraph").
	 * @returns True if it's pressed, false otherwise.
	 */
	public getModifierState(key: string): boolean {
		if (arguments.length < 1) {
			throw new TypeError(
				"Failed to execute 'getModifierState' on 'KeyboardEvent': 1 argument required, but only 0 present."
			);
		}
		const modifier = String(key);
		switch (modifier) {
			case 'Alt':
				return this.altKey;
			case 'Control':
				return this.ctrlKey;
			case 'Meta':
				return this.metaKey;
			case 'Shift':
				return this.shiftKey;
			default:
				return this.#modifierState.has(modifier);
		}
	}
}
