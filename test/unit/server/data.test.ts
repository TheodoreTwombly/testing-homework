import { Order, Product, ProductShortInfo } from '../../../src/common/types';
import { ExampleStore } from '../../../src/server/data';

//@ts-ignore
class TestExampleStore extends ExampleStore {
	private override readonly products: Product[] = [
		{
			id: 0,
			name: 'Product 0',
			price: 100,
			description: 'Description of product 0.',
			material: 'wood',
			color: 'white',
		},
		{
			id: 1,
			name: 'Product 1',
			price: 200,
			description: 'Description of product 1.',
			material: 'steel',
			color: 'black',
		},
	];
	private override readonly orders: (Order | { id: number })[] = [];
}

describe('Test example store', () => {
	let store: TestExampleStore;
	beforeEach(() => {
		store = new TestExampleStore();
	});

	it('returns all products short info by getAllProducts', () => {
        //@ts-ignore
		const products = store.getAllProducts();

		expect(products).toEqual([
			{
				id: 0,
				name: 'Product 0',
				price: 100,
			},
			{
				id: 1,
				name: 'Product 1',
				price: 200,
			},
		]);
	});
	it('returns product info by getProductById', () => {
		const product = store.getProductById(0);

		expect(product).toEqual({
			id: 0,
			name: 'Product 0',
			price: 100,
			description: 'Description of product 0.',
			material: 'wood',
			color: 'white',
		});
	});
	it('returns order id by createOrder', () => {
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
		const orderId = store.createOrder(newOrder);
		expect(orderId).toEqual(1);
	});
	it('returns orders by getLatestOrder', () => {
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
		const orderId = store.createOrder(newOrder);

		expect(store.getLatestOrders()).toEqual([
			{
				id: orderId,
				...newOrder,
			},
		]);
	});
});
