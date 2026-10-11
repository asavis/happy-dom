import HTMLTableSectionElement from '../../../src/nodes/html-table-section-element/HTMLTableSectionElement.js';
import HTMLCollection from '../../../src/nodes/element/HTMLCollection.js';
import type HTMLTableElement from '../../../src/nodes/html-table-element/HTMLTableElement.js';
import Window from '../../../src/window/Window.js';
import type Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLTableSectionElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTableSectionElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('thead');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTableSectionElement', () => {
			expect(element instanceof HTMLTableSectionElement).toBe(true);
		});
	});

	describe('get rows()', () => {
		it('Returns an HTMLCollection of the <tr> children.', () => {
			expect(element.rows).toBeInstanceOf(HTMLCollection);
			expect(element.rows.length).toBe(0);
			element.innerHTML = '<tr><td>1</td></tr><tr><td>2</td></tr>';
			expect(element.rows.length).toBe(2);
			expect(element.rows[0]).toBe(element.children[0]);
			expect(element.rows[1]).toBe(element.children[1]);
		});

		it('Returns the same live collection that reflects changes to the children.', () => {
			const rows = element.rows;
			expect(element.rows).toBe(rows);

			const row = element.insertRow();
			expect(rows.length).toBe(1);
			expect(rows[0]).toBe(row);

			row.remove();
			expect(rows.length).toBe(0);
		});

		it('Only includes <tr> elements that are children of the section.', () => {
			element.innerHTML =
				'<tr><td><table><tbody><tr><td>nested</td></tr></tbody></table></td></tr><tr><td>2</td></tr>';
			expect(element.rows.length).toBe(2);
			expect(element.rows[0]).toBe(element.children[0]);
			expect(element.rows[1]).toBe(element.children[1]);
		});

		it('Is supported by <thead>, <tbody> and <tfoot> elements.', () => {
			const table = <HTMLTableElement>document.createElement('table');
			table.innerHTML =
				'<thead><tr><th>a</th></tr></thead><tbody><tr><td>1</td></tr><tr><td>2</td></tr></tbody><tfoot><tr><td>3</td></tr><tr><td>4</td></tr><tr><td>5</td></tr></tfoot>';
			expect(table.tHead!.rows.length).toBe(1);
			expect(table.tBodies[0].rows.length).toBe(2);
			expect(table.tFoot!.rows.length).toBe(3);
			expect(table.tBodies[0].rows[1].textContent).toBe('2');
		});
	});

	describe('insertRow()', () => {
		it('Inserts a new row at the end', () => {
			const row = element.insertRow();
			expect(element.children[0]).toBe(row);
			expect(element.innerHTML).toBe('<tr></tr>');
			const row2 = element.insertRow();
			expect(element.children[1]).toBe(row2);
			expect(element.innerHTML).toBe('<tr></tr><tr></tr>');
		});

		it('Inserts a new row at the given index', () => {
			element.innerHTML = '<tr><td>test</td></tr><tr><td>test</td></tr>';
			const row = element.insertRow(1);
			expect(element.children[1]).toBe(row);
			expect(element.innerHTML).toBe('<tr><td>test</td></tr><tr></tr><tr><td>test</td></tr>');
		});

		it('Inserts a new row at the end if the index is -1', () => {
			element.innerHTML = '<tr><td>test</td></tr><tr><td>test</td></tr>';
			const row = element.insertRow(-1);
			expect(element.children[2]).toBe(row);
			expect(element.innerHTML).toBe('<tr><td>test</td></tr><tr><td>test</td></tr><tr></tr>');
		});

		it('Inserts a new row at the end if the index is not a number', () => {
			element.innerHTML = '<tr><td>test</td></tr><tr><td>test</td></tr>';
			const row = element.insertRow(<number>(<unknown>'test'));
			expect(element.children[2]).toBe(row);
			expect(element.innerHTML).toBe('<tr><td>test</td></tr><tr><td>test</td></tr><tr></tr>');
		});

		it('Inserts a new row at the end if the index is equal to the length of rows', () => {
			element.innerHTML = '<tr><td>test</td></tr><tr><td>test</td></tr>';
			const row = element.insertRow(2);
			expect(element.children[2]).toBe(row);
			expect(element.innerHTML).toBe('<tr><td>test</td></tr><tr><td>test</td></tr><tr></tr>');
		});

		it('Throws an error if the index is less than -1', () => {
			expect(() => {
				element.insertRow(-2);
			}).toThrow(
				"Failed to execute 'insertRow' on 'HTMLTableSectionElement': The index provided (-2) is less than -1."
			);
		});

		it('Throws an error if the index is greater than the number of rows', () => {
			element.innerHTML = '<tr><td>test</td></tr><tr><td>test</td></tr>';
			expect(() => {
				element.insertRow(3);
			}).toThrow(
				"Failed to execute 'insertRow' on 'HTMLTableSectionElement': The index provided (3) is greater than the number of rows (2)."
			);
		});
	});

	describe('deleteRow()', () => {
		it('Removes the row at the given index', () => {
			element.innerHTML = '<tr><td>Row 1</td></tr><tr><td>Row 2</td></tr><tr><td>Row 3</td></tr>';
			element.deleteRow(1);
			expect(element.children.length).toBe(2);
			expect(element.innerHTML).toBe('<tr><td>Row 1</td></tr><tr><td>Row 3</td></tr>');
		});

		it('Removes the last row if the index is -1', () => {
			element.innerHTML = '<tr><td>Row 1</td></tr><tr><td>Row 2</td></tr><tr><td>Row 3</td></tr>';
			element.deleteRow(-1);
			expect(element.children.length).toBe(2);
			expect(element.innerHTML).toBe('<tr><td>Row 1</td></tr><tr><td>Row 2</td></tr>');
		});

		it('Removes the last row if the index is not a number', () => {
			element.innerHTML = '<tr><td>Row 1</td></tr><tr><td>Row 2</td></tr><tr><td>Row 3</td></tr>';
			element.deleteRow(<number>(<unknown>'test'));
			expect(element.children.length).toBe(2);
			expect(element.innerHTML).toBe('<tr><td>Row 1</td></tr><tr><td>Row 2</td></tr>');
		});

		it('Throws an error if there are no arguments', () => {
			expect(() => {
				// @ts-expect-error -- We are intentionally calling this in an unsupported way (no arguments) for this test
				element.deleteRow();
			}).toThrow(
				"Failed to execute 'deleteRow' on 'HTMLTableSectionElement': 1 argument required, but only 0 present."
			);
		});

		it('Throws an error if the index is less than -1', () => {
			expect(() => {
				element.deleteRow(-2);
			}).toThrow(
				"Failed to execute 'deleteRow' on 'HTMLTableSectionElement': The index provided (-2) is less than -1."
			);
		});

		it('Throws an error if the index is greater than the number of rows', () => {
			element.innerHTML = '<tr><td>test</td></tr><tr><td>test</td></tr>';
			expect(() => {
				element.deleteRow(2);
			}).toThrow(
				"Failed to execute 'deleteRow' on 'HTMLTableSectionElement': The index provided (2) is greater than the number of rows in the table (2)."
			);
		});
	});
});
