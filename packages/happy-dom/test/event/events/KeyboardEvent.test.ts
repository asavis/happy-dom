import KeyboardEvent from '../../../src/event/events/KeyboardEvent.js';
import { describe, it, expect } from 'vitest';

describe('KeyboardEvent', () => {
	describe('constructor()', () => {
		it('Sets the "which" property from eventInit (issue #1897).', () => {
			const event = new KeyboardEvent('keydown', { keyCode: 13, which: 13 });
			expect(event.which).toBe(13);
		});

		it('Defaults "which" to keyCode when not specified.', () => {
			const event = new KeyboardEvent('keydown', { keyCode: 65 });
			expect(event.which).toBe(65);
		});

		it('Defaults "which" to 0 when neither which nor keyCode is specified.', () => {
			const event = new KeyboardEvent('keydown', {});
			expect(event.which).toBe(0);
		});

		it('Uses "which" value even when different from keyCode.', () => {
			const event = new KeyboardEvent('keydown', { keyCode: 13, which: 65 });
			expect(event.which).toBe(65);
			expect(event.keyCode).toBe(13);
		});
	});

	describe('getModifierState()', () => {
		it('Returns true when Alt key is pressed', () => {
			const event = new KeyboardEvent('keydown', { altKey: true });
			expect(event.getModifierState('Alt')).toBe(true);
		});

		it('Returns false for "AltGraph" when only Alt key is pressed', () => {
			const event = new KeyboardEvent('keydown', { altKey: true });
			expect(event.getModifierState('AltGraph')).toBe(false);
		});

		it('Returns true for "AltGraph" when "modifierAltGraph" is set', () => {
			const event = new KeyboardEvent('keydown', { modifierAltGraph: true });
			expect(event.getModifierState('AltGraph')).toBe(true);
			expect(event.getModifierState('Alt')).toBe(false);
			expect(event.altKey).toBe(false);
		});

		it('Returns the state of modifiers set with "modifier" prefixed properties', () => {
			const modifiers = [
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
			for (const modifier of modifiers) {
				const event = new KeyboardEvent('keydown', { [`modifier${modifier}`]: true });
				for (const other of modifiers) {
					expect(event.getModifierState(other)).toBe(other === modifier);
				}
				expect(new KeyboardEvent('keydown').getModifierState(modifier)).toBe(false);
			}
		});

		it('Returns true when Control key is pressed', () => {
			const event = new KeyboardEvent('keydown', { ctrlKey: true });
			expect(event.getModifierState('Control')).toBe(true);
		});

		it('Returns true when Meta key is pressed', () => {
			const event = new KeyboardEvent('keydown', { metaKey: true });
			expect(event.getModifierState('Meta')).toBe(true);
		});

		it('Returns true when Shift key is pressed', () => {
			const event = new KeyboardEvent('keydown', { shiftKey: true });
			expect(event.getModifierState('Shift')).toBe(true);
		});

		it('Returns false when modifier keys are not pressed', () => {
			const event = new KeyboardEvent('keydown', {});
			expect(event.getModifierState('Alt')).toBe(false);
			expect(event.getModifierState('Control')).toBe(false);
			expect(event.getModifierState('Meta')).toBe(false);
			expect(event.getModifierState('Shift')).toBe(false);
		});

		it('Is case-sensitive for modifier key names', () => {
			const event = new KeyboardEvent('keydown', {
				altKey: true,
				ctrlKey: true,
				metaKey: true,
				shiftKey: true,
				modifierAltGraph: true,
				modifierCapsLock: true
			});
			expect(event.getModifierState('alt')).toBe(false);
			expect(event.getModifierState('CONTROL')).toBe(false);
			expect(event.getModifierState('meta')).toBe(false);
			expect(event.getModifierState('ShIfT')).toBe(false);
			expect(event.getModifierState('altgraph')).toBe(false);
			expect(event.getModifierState('capslock')).toBe(false);
			expect(event.getModifierState('Alt')).toBe(true);
			expect(event.getModifierState('Control')).toBe(true);
			expect(event.getModifierState('Meta')).toBe(true);
			expect(event.getModifierState('Shift')).toBe(true);
			expect(event.getModifierState('AltGraph')).toBe(true);
			expect(event.getModifierState('CapsLock')).toBe(true);
		});

		it('Returns false for invalid modifier keys', () => {
			const event = new KeyboardEvent('keydown', {});
			expect(event.getModifierState('InvalidKey')).toBe(false);
			expect(event.getModifierState('')).toBe(false);
		});

		it('Ignores invalid types', () => {
			const event = new KeyboardEvent('keydown');
			expect(event.getModifierState(<string>(<unknown>false))).toBe(false);
			expect(event.getModifierState(<string>(<unknown>null))).toBe(false);
		});

		it('Throws an error when no arguments are passed', () => {
			const event = new KeyboardEvent('keydown');
			// @ts-expect-error
			expect(() => event.getModifierState()).toThrow(
				new TypeError(
					"Failed to execute 'getModifierState' on 'KeyboardEvent': 1 argument required, but only 0 present."
				)
			);
		});
	});
});
