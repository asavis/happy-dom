import Window from '../../../src/window/Window.js';
import type Document from '../../../src/nodes/document/Document.js';
import type HTMLLabelElement from '../../../src/nodes/html-label-element/HTMLLabelElement.js';
import type HTMLInputElement from '../../../src/nodes/html-input-element/HTMLInputElement.js';
import type Event from '../../../src/event/Event.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import MouseEvent from '../../../src/event/events/MouseEvent.js';

describe('HTMLLabelElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLLabelElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLLabelElement>document.createElement('label');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLLabelElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLLabelElement]');
		});
	});

	describe('get htmlFor()', () => {
		it('Returns attribute value.', () => {
			expect(element.htmlFor).toBe('');
			element.setAttribute('for', 'value');
			expect(element.htmlFor).toBe('value');
		});
	});

	describe('set htmlFor()', () => {
		it('Sets attribute value.', () => {
			element.htmlFor = 'value';
			expect(element.getAttribute('for')).toBe('value');
		});
	});

	describe('get control()', () => {
		it('Returns element controlling the label when "for" attribute has been defined.', () => {
			const input = document.createElement('input');
			input.id = 'inputId';
			element.htmlFor = 'inputId';
			document.body.appendChild(input);
			document.body.appendChild(element);
			expect(element.control === input).toBe(true);
		});

		it('Returns input appended as a child if "for" attribute is not defined.', () => {
			const input = document.createElement('input');
			element.appendChild(input);
			expect(element.control === input).toBe(true);
		});

		it('Returns a descendent input if "for" attribute is not defined.', () => {
			const input = document.createElement('input');
			const span = document.createElement('span');
			span.appendChild(input);
			element.appendChild(span);
			expect(element.control === input).toBe(true);
		});

		it('Does not return hidden inputs.', () => {
			const input = document.createElement('input');
			input.setAttribute('type', 'hidden');
			element.appendChild(input);
			expect(element.control).toBe(null);
		});
	});

	describe('get form()', () => {
		it('Returns null if no parent form element exists.', () => {
			expect(element.form).toBe(null);
		});

		it('Returns parent form element.', () => {
			const form = document.createElement('form');
			const div = document.createElement('div');
			const input = document.createElement('input');
			element.appendChild(input);
			div.appendChild(element);
			form.appendChild(div);
			expect(element.form).toBe(form);
		});

		it('Returns associated control form element.', () => {
			const form = document.createElement('form');
			const input = document.createElement('input');
			form.id = 'form';
			document.body.appendChild(form);
			input.id = 'input';
			input.setAttribute('form', 'form');
			element.htmlFor = 'input';
			document.body.appendChild(element);
			document.body.appendChild(input);
			expect(element.form).toBe(form);
		});
	});

	describe('dispatchEvent()', () => {
		it('Dispatches a click event on the control element if it exists.', () => {
			const input = <HTMLInputElement>document.createElement('input');
			const span = document.createElement('span');

			input.type = 'checkbox';

			span.appendChild(input);
			element.appendChild(span);

			let labelClickCount = 0;
			let inputClickCount = 0;

			element.addEventListener('click', () => labelClickCount++);
			input.addEventListener('click', () => inputClickCount++);

			expect(input.checked).toBe(false);

			element.click();

			expect(input.checked).toBe(true);
			expect(labelClickCount).toBe(2);
			expect(inputClickCount).toBe(1);
		});

		it('Supports MouseEvent.', () => {
			const input = <HTMLInputElement>document.createElement('input');
			const span = document.createElement('span');

			input.type = 'checkbox';

			span.appendChild(input);
			element.appendChild(span);

			let labelClickCount = 0;
			let inputClickCount = 0;

			element.addEventListener('click', () => labelClickCount++);
			input.addEventListener('click', () => inputClickCount++);

			expect(input.checked).toBe(false);

			element.dispatchEvent(new MouseEvent('click'));

			expect(input.checked).toBe(true);
			expect(labelClickCount).toBe(2);
			expect(inputClickCount).toBe(1);
		});

		it("Doesn't trigger when preventDefault() has been called.", () => {
			const input = <HTMLInputElement>document.createElement('input');
			const span = document.createElement('span');

			input.type = 'checkbox';

			span.appendChild(input);
			element.appendChild(span);

			let inputClickCount = 0;

			element.addEventListener('click', (event) => {
				event.preventDefault();
			});
			input.addEventListener('click', () => inputClickCount++);

			expect(input.checked).toBe(false);

			element.click();

			expect(input.checked).toBe(false);
			expect(inputClickCount).toBe(0);
		});

		it('It triggers "change" event on the control element when clicking on a span inside the label.', () => {
			const div = document.createElement('div');
			div.innerHTML = `
                <label>
                  <input type="checkbox">
                  <span>Description</span>
                </label>
            `;
			let isChangeFired = false;

			document.body.appendChild(div);

			div.querySelector('input')?.addEventListener('change', () => (isChangeFired = true));

			div.querySelector('span')?.click();

			expect(isChangeFired).toBe(true);
		});

		it('Doesn\'t trigger "change" event a second time when clicking on control element inside of a label.', () => {
			const div = document.createElement('div');
			div.innerHTML = `
                <label>
                  <input type="checkbox">
                  <span>Description</span>
                </label>
            `;
			let changeFiredCount = 0;

			document.body.appendChild(div);

			div.querySelector('input')?.addEventListener('change', () => changeFiredCount++);

			div.querySelector('input')?.click();

			expect(changeFiredCount).toBe(1);
			expect(div.querySelector('input')?.checked).toBe(true);
		});

		it("Doesn't dispatch a second click event on the control element when clicking on it inside of a label.", () => {
			document.body.innerHTML = `
                <label id="label"><span><input id="input" type="checkbox"></span> Choice</label>
            `;
			const label = <HTMLLabelElement>document.getElementById('label');
			const input = <HTMLInputElement>document.getElementById('input');
			let labelClickCount = 0;
			let inputClickCount = 0;

			label.addEventListener('click', () => labelClickCount++);
			input.addEventListener('click', () => inputClickCount++);

			input.click();

			expect(input.checked).toBe(true);
			expect(labelClickCount).toBe(1);
			expect(inputClickCount).toBe(1);
		});

		it('Dispatches a click event on the control element when clicking on text inside of the label.', () => {
			document.body.innerHTML = `
                <label id="label"><input id="input" type="checkbox"> Choice <span id="span">Description</span></label>
            `;
			const label = <HTMLLabelElement>document.getElementById('label');
			const input = <HTMLInputElement>document.getElementById('input');
			let inputClickCount = 0;

			input.addEventListener('click', () => inputClickCount++);

			label.click();

			expect(input.checked).toBe(true);
			expect(inputClickCount).toBe(1);

			document.getElementById('span')?.click();

			expect(input.checked).toBe(false);
			expect(inputClickCount).toBe(2);

			label.childNodes[1].dispatchEvent(
				new MouseEvent('click', { bubbles: true, cancelable: true })
			);

			expect(input.checked).toBe(true);
			expect(inputClickCount).toBe(3);
		});

		it("Doesn't dispatch a click event on the control element when clicking on interactive content inside of the label.", () => {
			document.body.innerHTML = `
                <label>
                    <input id="input" type="checkbox"> Choice
                    <button id="button" type="button"><span id="buttonSpan">?</span></button>
                    <a id="link" href="https://localhost/help">Help</a>
                    <input id="text" type="text">
                    <select id="select"><option>Option</option></select>
                    <textarea id="textarea"></textarea>
                </label>
            `;
			const input = <HTMLInputElement>document.getElementById('input');
			const open = vi.spyOn(window, 'open').mockImplementation(() => null);
			let inputClickCount = 0;

			input.addEventListener('click', () => inputClickCount++);

			for (const id of ['button', 'buttonSpan', 'link', 'text', 'select', 'textarea']) {
				document.getElementById(id)?.click();
			}

			expect(open).toHaveBeenCalledTimes(1);
			expect(input.checked).toBe(false);
			expect(inputClickCount).toBe(0);
		});

		it("Doesn't dispatch a click event on the control element when a listener on an ancestor of the label calls preventDefault().", () => {
			document.body.innerHTML = `
                <div id="root"><label id="label"><input id="input" type="checkbox"> <span id="span">Choice</span></label></div>
            `;
			const root = document.getElementById('root')!;
			const label = <HTMLLabelElement>document.getElementById('label');
			const input = <HTMLInputElement>document.getElementById('input');
			let inputClickCount = 0;

			input.addEventListener('click', () => inputClickCount++);
			root.addEventListener('click', (event) => {
				if (event.target !== input) {
					event.preventDefault();
				}
			});

			label.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
			document.getElementById('span')?.click();

			expect(input.checked).toBe(false);
			expect(inputClickCount).toBe(0);
		});

		it("Doesn't dispatch a click event on the control element when preventDefault() has been called before the event is dispatched.", () => {
			document.body.innerHTML = `
                <label id="label"><input id="input" type="checkbox"> Choice</label>
            `;
			const label = <HTMLLabelElement>document.getElementById('label');
			const input = <HTMLInputElement>document.getElementById('input');
			const event = new MouseEvent('click', { bubbles: true, cancelable: true });
			let inputClickCount = 0;

			input.addEventListener('click', () => inputClickCount++);

			// Testing libraries (e.g. @testing-library/user-event) cancel the event and replace "defaultPrevented" before dispatching it, to run their own activation behavior.
			event.preventDefault();
			Object.defineProperty(event, 'defaultPrevented', { get: () => false });

			label.dispatchEvent(event);

			expect(input.checked).toBe(false);
			expect(inputClickCount).toBe(0);
		});

		it('Dispatches a click event on the control element once, after the click event has been dispatched to the ancestors of the label.', () => {
			document.body.innerHTML = `
                <div id="root"><label id="label"><input id="input" type="checkbox"> <span id="span">Choice</span></label></div>
            `;
			const root = document.getElementById('root')!;
			const label = <HTMLLabelElement>document.getElementById('label');
			const input = <HTMLInputElement>document.getElementById('input');
			const log: string[] = [];
			const listener = (event: Event): void => {
				log.push(
					`${(<HTMLElement>event.currentTarget).id || 'document'}: ${(<HTMLElement>event.target).id}`
				);
			};

			for (const target of [document, root, label, input]) {
				target.addEventListener('click', listener);
			}

			document.getElementById('span')?.click();

			expect(input.checked).toBe(true);
			expect(log).toEqual([
				'label: span',
				'root: span',
				'document: span',
				'input: input',
				'label: input',
				'root: input',
				'document: input'
			]);
		});

		it('Dispatches a click event on the control element when propagation is stopped before the click event reaches the label.', () => {
			document.body.innerHTML = `
                <label id="label"><input id="input" type="checkbox"> <span id="span">Choice</span></label>
            `;
			const input = <HTMLInputElement>document.getElementById('input');
			let inputClickCount = 0;

			input.addEventListener('click', () => inputClickCount++);
			document
				.getElementById('span')
				?.addEventListener('click', (event) => event.stopPropagation());

			document.getElementById('span')?.click();

			expect(input.checked).toBe(true);
			expect(inputClickCount).toBe(1);
		});

		describe('get labels()', () => {
			it('Does not duplicate entries on repeated reads.', () => {
				const input = document.createElement('input');
				input.id = 'test-input';
				document.body.appendChild(input);

				const label = document.createElement('label');
				label.htmlFor = 'test-input';
				document.body.appendChild(label);

				expect(input.labels.length).toBe(1);
				expect(input.labels.length).toBe(1);
				expect(input.labels.length).toBe(1);
			});

			it('Returns the enclosing label element.', () => {
				const label = document.createElement('label');
				const input = document.createElement('input');
				label.appendChild(input);
				document.body.appendChild(label);

				expect(input.labels.length).toBe(1);
				expect(input.labels[0] === label).toBe(true);
			});
		});
	});
});
