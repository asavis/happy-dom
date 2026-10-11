import type SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import type FocusEvent from '../../../src/event/events/FocusEvent.js';
import type Document from '../../../src/nodes/document/Document.js';
import type HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import Window from '../../../src/window/Window.js';
import { beforeEach, describe, it, expect } from 'vitest';
import type EventTarget from '../../../src/event/EventTarget.js';

describe('HTMLElementUtility', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('blur()', () => {
		it('Dispatches "blur" and "focusout" event.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				element.setAttribute('tabindex', '-1');

				let blurEvent: FocusEvent | null = null;
				let blurTarget: EventTarget | null = null;
				let blurCurrentTarget: EventTarget | null = null;
				let focusOutEvent: FocusEvent | null = null;
				let focusOutTarget: EventTarget | null = null;
				let focusOutCurrentTarget: EventTarget | null = null;

				document.body.appendChild(element);

				element.addEventListener('blur', (event) => {
					blurEvent = <FocusEvent>event;
					blurTarget = event.target;
					blurCurrentTarget = event.currentTarget;
				});

				element.addEventListener('focusout', (event) => {
					focusOutEvent = <FocusEvent>event;
					focusOutTarget = event.target;
					focusOutCurrentTarget = event.currentTarget;
				});

				element.focus();
				element.blur();

				expect((<FocusEvent>(<unknown>blurEvent)).type).toBe('blur');
				expect((<FocusEvent>(<unknown>blurEvent)).bubbles).toBe(false);
				expect((<FocusEvent>(<unknown>blurEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>blurEvent)).target).toBe(element);
				expect(blurTarget).toBe(element);
				expect(blurCurrentTarget).toBe(element);

				expect((<FocusEvent>(<unknown>focusOutEvent)).type).toBe('focusout');
				expect((<FocusEvent>(<unknown>focusOutEvent)).bubbles).toBe(true);
				expect((<FocusEvent>(<unknown>focusOutEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>focusOutEvent)).target).toBe(element);
				expect(focusOutTarget).toBe(element);
				expect(focusOutCurrentTarget).toBe(element);

				expect(document.activeElement === document.body).toBe(true);
			}
		});

		it('Does not dispatch "blur" event if not connected to the DOM.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				element.setAttribute('tabindex', '-1');

				let triggeredEvent: FocusEvent | null = null;

				element.addEventListener('blur', (event) => {
					triggeredEvent = <FocusEvent>event;
				});

				element.focus();
				element.blur();

				expect(triggeredEvent).toBe(null);
			}
		});

		it('Does not dispatch "blur" event if it is not in focus.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				element.setAttribute('tabindex', '-1');

				let triggeredEvent: FocusEvent | null = null;

				document.body.appendChild(element);

				element.addEventListener('blur', (event) => {
					triggeredEvent = <FocusEvent>event;
				});

				element.blur();

				expect(triggeredEvent).toBe(null);
			}
		});

		it('Dispatches "blur" and "focusout" event if the element was disabled while in focus.', () => {
			const button = document.createElement('button');
			const events: string[] = [];

			document.body.appendChild(button);

			button.addEventListener('blur', (event) => events.push(event.type));
			button.addEventListener('focusout', (event) => events.push(event.type));

			button.focus();
			button.disabled = true;
			button.blur();

			expect(events).toEqual(['blur', 'focusout']);
			expect(document.activeElement === document.body).toBe(true);
		});
	});

	describe('focus()', () => {
		it('Dispatches "focus" and "focusin" event.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				element.setAttribute('tabindex', '-1');

				let focusEvent: FocusEvent | null = null;
				let focusTarget: EventTarget | null = null;
				let focusCurrentTarget: EventTarget | null = null;
				let focusInEvent: FocusEvent | null = null;
				let focusInTarget: EventTarget | null = null;
				let focusInCurrentTarget: EventTarget | null = null;

				document.body.appendChild(element);

				element.addEventListener('focus', (event) => {
					focusEvent = <FocusEvent>event;
					focusTarget = event.target;
					focusCurrentTarget = event.currentTarget;
				});

				element.addEventListener('focusin', (event) => {
					focusInEvent = <FocusEvent>event;
					focusInTarget = event.target;
					focusInCurrentTarget = event.currentTarget;
				});

				element.focus();

				expect((<FocusEvent>(<unknown>focusEvent)).type).toBe('focus');
				expect((<FocusEvent>(<unknown>focusEvent)).bubbles).toBe(false);
				expect((<FocusEvent>(<unknown>focusEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>focusEvent)).target).toBe(element);
				expect(focusTarget).toBe(element);
				expect(focusCurrentTarget).toBe(element);

				expect((<FocusEvent>(<unknown>focusInEvent)).type).toBe('focusin');
				expect((<FocusEvent>(<unknown>focusInEvent)).bubbles).toBe(true);
				expect((<FocusEvent>(<unknown>focusInEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>focusInEvent)).target).toBe(element);
				expect(focusInTarget).toBe(element);
				expect(focusInCurrentTarget).toBe(element);

				expect(document.activeElement).toBe(element);
			}
		});

		it('Does not dispatch "focus" event if not connected to the DOM.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				element.setAttribute('tabindex', '-1');

				let triggeredEvent: FocusEvent | null = null;

				element.addEventListener('focus', (event) => {
					triggeredEvent = <FocusEvent>event;
				});

				element.focus();

				expect(triggeredEvent).toBe(null);
			}
		});

		it('Does not dispatch "focus" event if it is already focused.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				element.setAttribute('tabindex', '-1');

				let triggeredEvent: FocusEvent | null = null;

				document.body.appendChild(element);

				element.focus();

				element.addEventListener('focus', (event) => {
					triggeredEvent = <FocusEvent>event;
				});

				element.focus();

				expect(triggeredEvent).toBe(null);
			}
		});

		it('Dispatches "blur" event on the previously focused element.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				element.setAttribute('tabindex', '-1');

				const previousElement = <HTMLElement>document.createElement('div');
				previousElement.setAttribute('tabindex', '-1');
				let event: FocusEvent | null = null;
				let target: EventTarget | null = null;
				let currentTarget: EventTarget | null = null;

				document.body.appendChild(element);
				document.body.appendChild(previousElement);

				previousElement.focus();

				previousElement.addEventListener('blur', (e) => {
					event = <FocusEvent>e;
					target = e.target;
					currentTarget = e.currentTarget;
				});

				element.focus();

				expect((<FocusEvent>(<unknown>event)).type).toBe('blur');
				expect((<FocusEvent>(<unknown>event)).bubbles).toBe(false);
				expect((<FocusEvent>(<unknown>event)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>event)).target).toBe(previousElement);
				expect(target).toBe(previousElement);
				expect(currentTarget).toBe(previousElement);
			}
		});

		it('Does not focus an element that is not a focusable area.', () => {
			document.body.innerHTML = `
				<div id="div">Div</div>
				<span id="span">Span</span>
				<div id="invalidTabIndex" tabindex="abc">Div</div>
				<a id="anchor">Anchor</a>
				<map name="map"><area id="area"></map>
				<input id="hiddenInput" type="hidden">
				<button id="disabledButton" disabled>Button</button>
				<input id="disabledInput" disabled>
				<select id="disabledSelect" disabled></select>
				<textarea id="disabledTextArea" disabled></textarea>
				<button id="disabledTabIndexButton" tabindex="0" disabled>Button</button>
				<fieldset disabled>
					<legend>Legend</legend>
					<button id="fieldsetButton">Button</button>
					<legend><button id="secondLegendButton">Button</button></legend>
				</fieldset>
				<fieldset disabled>
					<legend>Legend</legend>
					<fieldset><input id="nestedFieldsetInput"></fieldset>
				</fieldset>
				<details>
					<summary>Summary</summary>
					<summary id="secondSummary">Summary</summary>
				</details>
				<div id="notContentEditable" contenteditable="false">Div</div>
				<svg id="svg">
					<rect id="svgRect"></rect>
					<a id="svgAnchor"><text>Anchor</text></a>
				</svg>
			`;

			for (const id of [
				'div',
				'span',
				'invalidTabIndex',
				'anchor',
				'area',
				'hiddenInput',
				'disabledButton',
				'disabledInput',
				'disabledSelect',
				'disabledTextArea',
				'disabledTabIndexButton',
				'fieldsetButton',
				'secondLegendButton',
				'nestedFieldsetInput',
				'secondSummary',
				'notContentEditable',
				'svg',
				'svgRect',
				'svgAnchor'
			]) {
				const element = <HTMLElement | SVGElement>document.getElementById(id);
				const events: string[] = [];

				element.addEventListener('focus', (event) => events.push(event.type));
				element.addEventListener('focusin', (event) => events.push(event.type));

				element.focus();

				expect({ id, events }).toEqual({ id, events: [] });
				expect(document.activeElement === document.body).toBe(true);
			}
		});

		it('Focuses an element that is a focusable area.', () => {
			document.body.innerHTML = `
				<div id="tabIndex" tabindex="-1">Div</div>
				<span id="positiveTabIndex" tabindex="1">Span</span>
				<a id="anchor" href="#">Anchor</a>
				<img usemap="#map" width="10" height="10" alt="">
				<map name="map"><area id="area" href="#" shape="rect" coords="0,0,5,5"></map>
				<button id="button">Button</button>
				<input id="input">
				<select id="select"></select>
				<textarea id="textArea"></textarea>
				<iframe id="iframe"></iframe>
				<div id="contentEditable" contenteditable>Div</div>
				<div id="contentEditableTrue" contenteditable="true">Div</div>
				<div id="contentEditablePlainTextOnly" contenteditable="plaintext-only">Div</div>
				<details>
					<summary id="summary">Summary</summary>
				</details>
				<fieldset disabled>
					<div>Div</div>
					<legend><button id="legendButton">Button</button></legend>
					<div id="fieldsetTabIndex" tabindex="0">Div</div>
					<a id="fieldsetAnchor" href="#">Anchor</a>
				</fieldset>
				<svg>
					<a id="svgAnchor" href="#"><text>Anchor</text></a>
					<rect id="svgTabIndex" tabindex="0"></rect>
				</svg>
			`;

			for (const id of [
				'tabIndex',
				'positiveTabIndex',
				'anchor',
				'area',
				'button',
				'input',
				'select',
				'textArea',
				'iframe',
				'contentEditable',
				'contentEditableTrue',
				'contentEditablePlainTextOnly',
				'summary',
				'legendButton',
				'fieldsetTabIndex',
				'fieldsetAnchor',
				'svgAnchor',
				'svgTabIndex'
			]) {
				const element = <HTMLElement | SVGElement>document.getElementById(id);
				const events: string[] = [];

				element.addEventListener('focus', (event) => events.push(event.type));
				element.addEventListener('focusin', (event) => events.push(event.type));

				element.focus();

				expect({ id, events }).toEqual({ id, events: ['focus', 'focusin'] });
				expect(document.activeElement === element).toBe(true);
			}
		});

		it('Does not dispatch "focus" event on the body.', () => {
			const input = document.createElement('input');
			const events: string[] = [];

			document.body.appendChild(input);

			document.body.addEventListener('focus', (event) => events.push(event.type));
			document.body.addEventListener('focusin', (event) => events.push(event.type));

			document.body.focus();

			expect(events).toEqual([]);
			expect(document.activeElement === document.body).toBe(true);

			input.focus();
			events.length = 0;

			document.body.focus();

			expect(events).toEqual([]);
			expect(document.activeElement === input).toBe(true);
		});

		it('Dispatches "blur" and "focusout" event on the previously focused element if it was disabled while in focus.', () => {
			const button = document.createElement('button');
			const next = document.createElement('div');
			const events: Array<{ type: string; relatedTarget: EventTarget | null }> = [];

			next.setAttribute('tabindex', '-1');

			document.body.appendChild(button);
			document.body.appendChild(next);

			for (const type of ['blur', 'focusout']) {
				button.addEventListener(type, (event) =>
					events.push({ type, relatedTarget: (<FocusEvent>event).relatedTarget })
				);
			}

			button.focus();
			button.disabled = true;
			next.focus();

			expect(events).toEqual([
				{ type: 'blur', relatedTarget: next },
				{ type: 'focusout', relatedTarget: next }
			]);
			expect(document.activeElement === next).toBe(true);
		});
	});

	describe('Related targets', () => {
		it('Sets relatedTarget.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				element.setAttribute('tabindex', '-1');

				const focusElement = <HTMLElement | SVGElement>element.cloneNode();
				const blurElement = <HTMLElement | SVGElement>element.cloneNode();
				let triggeredBlurEvent: FocusEvent | null = null;
				let triggeredFocusOutEvent: FocusEvent | null = null;
				let triggeredFocusEvent: FocusEvent | null = null;
				let triggeredFocusInEvent: FocusEvent | null = null;

				document.body.appendChild(focusElement);
				document.body.appendChild(blurElement);

				blurElement.addEventListener('blur', (event) => {
					triggeredBlurEvent = <FocusEvent>event;
				});

				blurElement.addEventListener('focusout', (event) => {
					triggeredFocusOutEvent = <FocusEvent>event;
				});

				focusElement.addEventListener('focus', (event) => {
					triggeredFocusEvent = <FocusEvent>event;
				});

				focusElement.addEventListener('focusin', (event) => {
					triggeredFocusInEvent = <FocusEvent>event;
				});

				blurElement.focus();
				focusElement.focus();

				expect((<FocusEvent>(<unknown>triggeredBlurEvent)).type).toBe('blur');
				expect((<FocusEvent>(<unknown>triggeredBlurEvent)).relatedTarget).toBe(focusElement);

				expect((<FocusEvent>(<unknown>triggeredFocusOutEvent)).type).toBe('focusout');
				expect((<FocusEvent>(<unknown>triggeredFocusOutEvent)).relatedTarget).toBe(focusElement);

				expect((<FocusEvent>(<unknown>triggeredFocusEvent)).type).toBe('focus');
				expect((<FocusEvent>(<unknown>triggeredFocusEvent)).relatedTarget).toBe(blurElement);

				expect((<FocusEvent>(<unknown>triggeredFocusInEvent)).type).toBe('focusin');
				expect((<FocusEvent>(<unknown>triggeredFocusInEvent)).relatedTarget).toBe(blurElement);
			}
		});

		it('Sets relatedTarget to null if blur does not have new focus target.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				element.setAttribute('tabindex', '-1');

				const focusElement = <HTMLElement | SVGElement>element.cloneNode();
				const blurElement = <HTMLElement | SVGElement>element.cloneNode();
				let triggeredBlurEvent: FocusEvent | null = null;
				let triggeredFocusOutEvent: FocusEvent | null = null;

				document.body.appendChild(focusElement);
				document.body.appendChild(blurElement);

				focusElement.addEventListener('blur', (event) => {
					triggeredBlurEvent = <FocusEvent>event;
				});

				focusElement.addEventListener('focusout', (event) => {
					triggeredFocusOutEvent = <FocusEvent>event;
				});

				blurElement.focus();
				focusElement.focus();
				focusElement.blur();

				expect((<FocusEvent>(<unknown>triggeredBlurEvent)).type).toBe('blur');
				expect((<FocusEvent>(<unknown>triggeredBlurEvent)).relatedTarget).toBeNull();

				expect((<FocusEvent>(<unknown>triggeredFocusOutEvent)).type).toBe('focusout');
				expect((<FocusEvent>(<unknown>triggeredFocusOutEvent)).relatedTarget).toBeNull();
			}
		});
	});
});
