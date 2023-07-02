import {
	CartApi,
	ExampleApi,
	LOCAL_STORAGE_CART_KEY,
} from '../../../src/client/api';
import axios from 'axios';
import { Order } from '../../../src/common/types';

describe('CartApi', () => {
	let api: CartApi;
	beforeEach(() => {
		api = new CartApi();
	});
	it('getState returns value from localState', () => {
		let keyInStorage: string = '';
		let cartState = {
			0: {
				name: 'Product 0',
				count: 1,
				price: 100,
			},
			1: {
				name: 'Product 1',
				count: 2,
				price: 200,
			},
		};
		global.Storage.prototype.getItem = jest.fn().mockImplementation((key) => {
			keyInStorage = key;
			return JSON.stringify(cartState);
		});
		const state = api.getState();
		expect(keyInStorage).toEqual(LOCAL_STORAGE_CART_KEY);
		expect(state).toEqual(cartState);
	});
	it('getState returns empty object if localState empty', () => {
		global.Storage.prototype.getItem = jest.fn().mockImplementation((key) => {
			return null;
		});
		const state = api.getState();
		expect(state).toEqual({});
	});
	it('getState returns empty object if localStatereturn error', () => {
		global.Storage.prototype.getItem = jest.fn().mockImplementation((key) => {
			throw new Error('error');
		});
		const state = api.getState();
		expect(state).toEqual({});
	});
	it('setState with rigth key and value', () => {
		let keyInStorage: string = '';
		let cartState = {
			0: {
				name: 'Product 0',
				count: 1,
				price: 100,
			},
			1: {
				name: 'Product 1',
				count: 2,
				price: 200,
			},
		};
		let settedCart: string = '';
		global.Storage.prototype.setItem = jest
			.fn()
			.mockImplementation((key, cart) => {
				keyInStorage = key;
				settedCart = cart;
			});

		api.setState(cartState);
		expect(keyInStorage).toEqual(LOCAL_STORAGE_CART_KEY);
		expect(settedCart).toEqual(JSON.stringify(cartState));
	});
});

jest.mock('axios');
describe('Example', () => {
	let api: ExampleApi;
	const basename = 'basename';

	beforeEach(() => {
		api = new ExampleApi(basename);
	});

	it('getProducts sends request to server', async () => {
		await api.getProducts();

		expect(axios.get).toHaveBeenCalledWith(`${basename}/api/products`);
	});

	it('getProductById sends request to server', async () => {
		const id = 12;
		await api.getProductById(id);

		expect(axios.get).toHaveBeenCalledWith(`${basename}/api/products/${id}`);
	});

	it('checkout sends request to server', async () => {
		const newOrder: Order = {
			form: {
				name: 'Ivan Ivanov',
				phone: '79789999999',
				address: 'Russia, Moscow',
			},
			cart: {
				0: {
					name: 'Product 0',
					count: 1,
					price: 100,
				},
				1: {
					name: 'Product 1',
					count: 2,
					price: 200,
				},
			},
		};
		await api.checkout(newOrder.form, newOrder.cart);

		expect(axios.post).toHaveBeenCalledWith(
			`${basename}/api/checkout`,
			newOrder
		);
	});
});
