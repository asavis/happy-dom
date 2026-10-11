import FocusEvent from '../../event/events/FocusEvent.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import NamespaceURI from '../../config/NamespaceURI.js';
import type Element from '../element/Element.js';
import type Node from '../node/Node.js';
import type HTMLElement from '../html-element/HTMLElement.js';
import type SVGElement from '../svg-element/SVGElement.js';

/**
 * HTMLElement utility.
 */
export default class HTMLElementUtility {
	/**
	 * Triggers a blur event.
	 *
	 * An element that has been disabled while focused still dispatches "blur" and "focusout" when it loses focus.
	 *
	 * @see https://html.spec.whatwg.org/multipage/interaction.html#focus-update-steps
	 * @param element Element.
	 */
	public static blur(element: HTMLElement | SVGElement): void {
		const target = element[PropertySymbol.proxy] || element;
		const document = target[PropertySymbol.ownerDocument];

		if (document[PropertySymbol.activeElement] !== target || !target[PropertySymbol.isConnected]) {
			return;
		}

		const relatedTarget = document[PropertySymbol.nextActiveElement] ?? null;

		document[PropertySymbol.activeElement] = null;

		document[PropertySymbol.clearCache]();

		target.dispatchEvent(
			new FocusEvent('blur', {
				relatedTarget,
				bubbles: false,
				composed: true,
				cancelable: true
			})
		);
		target.dispatchEvent(
			new FocusEvent('focusout', {
				relatedTarget,
				bubbles: true,
				composed: true,
				cancelable: true
			})
		);
	}

	/**
	 * Triggers a focus event.
	 *
	 * Only a focusable area can receive focus.
	 *
	 * @see https://html.spec.whatwg.org/multipage/interaction.html#focusing-steps
	 * @param element Element.
	 */
	public static focus(element: HTMLElement | SVGElement): void {
		const target = element[PropertySymbol.proxy] || element;
		const document = target[PropertySymbol.ownerDocument];

		if (
			document[PropertySymbol.activeElement] === target ||
			!target[PropertySymbol.isConnected] ||
			!this.isFocusableArea(<HTMLElement | SVGElement>target) ||
			this.isInert(<HTMLElement | SVGElement>target)
		) {
			return;
		}

		// Set the next active element so `blur` can use it for `relatedTarget`.
		document[PropertySymbol.nextActiveElement] = <HTMLElement>target;

		const relatedTarget = document[PropertySymbol.activeElement];

		if (document[PropertySymbol.activeElement] !== null) {
			document[PropertySymbol.activeElement].blur();
		}

		// Clean up after blur, so it does not affect next blur call.
		document[PropertySymbol.nextActiveElement] = null;

		document[PropertySymbol.activeElement] = <HTMLElement>target;

		document[PropertySymbol.clearCache]();

		target.dispatchEvent(
			new FocusEvent('focus', {
				relatedTarget,
				bubbles: false,
				composed: true
			})
		);
		target.dispatchEvent(
			new FocusEvent('focusin', {
				relatedTarget,
				bubbles: true,
				composed: true
			})
		);
	}

	/**
	 * Returns whether an element is a focusable area.
	 *
	 * @see https://html.spec.whatwg.org/multipage/interaction.html#focusable-area
	 * @see https://html.spec.whatwg.org/multipage/interaction.html#the-tabindex-attribute
	 * @param element Element.
	 * @returns True if the element is a focusable area.
	 */
	private static isFocusableArea(element: HTMLElement | SVGElement): boolean {
		const localName = element[PropertySymbol.localName];
		const tabIndex = element.getAttribute('tabindex');
		const hasTabIndex = tabIndex !== null && !isNaN(parseInt(tabIndex, 10));

		if (element[PropertySymbol.namespaceURI] === NamespaceURI.svg) {
			return (
				hasTabIndex ||
				(localName === 'a' && (element.hasAttribute('href') || element.hasAttribute('xlink:href')))
			);
		}

		if (
			localName === 'button' ||
			localName === 'input' ||
			localName === 'select' ||
			localName === 'textarea'
		) {
			return (
				!this.isDisabledFormControl(element) &&
				(localName !== 'input' || element.getAttribute('type')?.toLowerCase() !== 'hidden')
			);
		}

		if (hasTabIndex || localName === 'iframe') {
			return true;
		}

		if (localName === 'a' || localName === 'area') {
			return element.hasAttribute('href');
		}

		if (localName === 'summary') {
			const parent = <Element | null>element[PropertySymbol.parentNode];
			return (
				parent?.[PropertySymbol.localName] === 'details' &&
				parent[PropertySymbol.elementArray].find(
					(child) => child[PropertySymbol.localName] === 'summary'
				) === element
			);
		}

		// Editing host.
		const contentEditable = element.getAttribute('contenteditable')?.toLowerCase();
		if (
			contentEditable === '' ||
			contentEditable === 'true' ||
			contentEditable === 'plaintext-only'
		) {
			return true;
		}

		// Focus delegation is not implemented yet, so a shadow host that delegates focus receives it.
		return !!element[PropertySymbol.shadowRoot]?.[PropertySymbol.delegatesFocus];
	}

	/**
	 * Returns whether a form control is disabled by its own "disabled" attribute or by a disabled fieldset ancestor, unless the control is inside the fieldset's first legend.
	 *
	 * @see https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-fe-disabled
	 * @param element Element.
	 * @returns True if the form control is disabled.
	 */
	private static isDisabledFormControl(element: HTMLElement | SVGElement): boolean {
		if (element.hasAttribute('disabled')) {
			return true;
		}

		let child: Node = element;
		let parent: Node | null = element[PropertySymbol.parentNode];

		while (parent) {
			if (
				(<Element>parent)[PropertySymbol.localName] === 'fieldset' &&
				(<Element>parent).hasAttribute('disabled') &&
				child !==
					(<Element>parent)[PropertySymbol.elementArray].find(
						(sibling) => sibling[PropertySymbol.localName] === 'legend'
					)
			) {
				return true;
			}
			child = parent;
			parent = parent[PropertySymbol.parentNode];
		}

		return false;
	}

	/**
	 * Returns whether an element or any of its ancestors has the inert attribute.
	 *
	 * @param element Element to check.
	 * @returns True if the element is in an inert tree.
	 */
	private static isInert(element: HTMLElement | SVGElement): boolean {
		let current: HTMLElement | SVGElement | null = <HTMLElement | SVGElement>(
			(element[PropertySymbol.proxy] || element)
		);
		while (current && typeof current.getAttribute === 'function') {
			if (current.getAttribute('inert') !== null) {
				return true;
			}
			current = <HTMLElement | SVGElement | null>current[PropertySymbol.parentNode];
		}
		return false;
	}
}
