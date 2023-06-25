import { addAngle, subtractAngle } from '../utils';

describe('Testing util functions', () => {
	describe('addAngle testing', () => {
		test('testing when passed values as String!', () => {
			const value = addAngle('45', '45');

			expect(value).toBe(0);
		});

		test('testing when passed as number!', () => {
			const value = addAngle(45, 45);

			expect(value).toBe(90);
		});

		test('testing when passed as negative number!', () => {
			const value = addAngle(45, -90);

			expect(value).toBe(315);
		});

		test('result angle should be more than 360', () => {
			const value = addAngle(350, 20);

			expect(value).toBe(10);
		});
	});

	describe('subtractAngle testing', () => {
		test('testing when passed values as String!', () => {
			const value = subtractAngle('45', '45');

			expect(value).toBe(0);
		});

		test('testing when passed as number!', () => {
			const value = subtractAngle(45, 45);

			expect(value).toBe(0);
		});

		test('testing when passed as negative number!', () => {
			const value = subtractAngle(45, -90);

			expect(value).toBe(135);
		});

		test('subtracted angle is less than 0', () => {
			const value = subtractAngle(45, 90);

			expect(value).toBe(315);
		});

		test('subtracted ange is mre than 360', () => {
			const value = subtractAngle(20, -370);

			expect(value).toBe(30);
		});
	});
});
