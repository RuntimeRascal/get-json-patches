import getJsonPatches, { JsonPatch } from './getJsonPatches';

const benchmark = (toMeasure: Function, label = '') => {
    if (!label) label = toMeasure.name ?? 'anonymous';
    const start_status = performance.now();
    const result = toMeasure();
    const final_status = performance.now();
    const final = final_status - start_status;
    console.debug(`%c '${label}' -> Time taken: ${final} ms`, 'background:red;color:white');
    return result;
};

describe('getJsonPatches tests', () => {
    test('should return empty array when objects are equal', () => {
        const a = { name: 'John', age: 30 };
        const b = { name: 'John', age: 30 };

        const actual = getJsonPatches(a, b);

        expect(actual).toStrictEqual([]);
    });

    test('should return "replace" when "b" updates string property', () => {
        const a = { name: 'John', age: 30 };
        const b = { name: 'Smith', age: 30 };
        const expected: JsonPatch[] = [{ op: 'set', path: '/name', value: 'Smith' }];

        const actual = getJsonPatches(a, b);

        expect(actual).toHaveLength(1);
        expect(actual).toStrictEqual(expected);
    });

    test('should return 1 "add" patch when "b" adds a property', () => {
        const a = { name: 'John', age: 30 };
        const b = { name: 'John', age: 30, newProp: 'new' };
        const expected: JsonPatch[] = [{ op: 'add', path: '/newProp', value: b.newProp }];

        const actual = getJsonPatches(a, b);

        expect(actual).toHaveLength(1);
        expect(actual).toStrictEqual(expected);
    });

    test('should return 1 "replace" patch when "b" updates number property', () => {
        const a = { name: 'John', age: 30 };
        const b = { name: 'John', age: 32 };
        const expected: JsonPatch[] = [{ op: 'set', path: '/age', value: 32 }];

        const actual = getJsonPatches(a, b);

        expect(actual).toHaveLength(1);
        expect(actual).toStrictEqual(expected);
    });

    test('should return 1 "remove" patch when "b" removes a property', () => {
        const a = { name: 'John', age: 30 };
        const b = { name: 'John' };
        const expected: JsonPatch[] = [{ op: 'remove', path: '/age' }];

        const actual = getJsonPatches(a, b);

        expect(actual).toHaveLength(1);
        expect(actual).toStrictEqual(expected);
    });

    test('should ignore functions and symbols', () => {
        const a = { func: () => { }, sym: Symbol('test') };
        const b = {};

        const actual = getJsonPatches(a, b);

        expect(actual).toStrictEqual([]);
    });

    test('should return 1 "replace" patch with key of object key', () => {
        const a = { name: 'John', age: 30, obj: { name: 'Sam', age: 20 } };
        const b = { name: 'John', age: 30, obj: { name: 'Sammy', age: 20 } };
        const expected: JsonPatch[] = [{ op: 'set', path: '/obj/name', value: 'Sammy' }];

        //const actual = benchmark(() => objectDifferences(current, newObj));
        const actual = benchmark(getJsonPatches.bind(null, a, b), getJsonPatches.name);

        expect(actual).toHaveLength(1);
        expect(actual).toStrictEqual(expected);
    });

    describe('array comparisons', () => {
        // TODO: should we compare when arrays have different lengths?
        // Should produce "set" patch with "-" to insert items at end of array
        test('should return "b" array at / when a and b are arrays and lengths are different', () => {
            const a = [1, 2, 3, 4, 5];
            const b = [1, 2, 3, 4, 5, 6];
            const expected: JsonPatch[] = [{ op: 'set', path: '/', value: b }];

            //const actual = benchmark(() => objectDifferences(current, newObj));
            const actual = benchmark(getJsonPatches.bind(null, a, b), getJsonPatches.name);

            expect(actual).toStrictEqual(expected);
        });

        test('should return indexed replace when a and b are arrays, same lengths and have a different item', () => {
            const a = [1, 2, 3, 4, 5];
            const b = [1, 2, 3, 4, 6];
            const expected: JsonPatch[] = [{ op: 'set', path: '/4', value: b[4] }];

            //const actual = benchmark(() => objectDifferences(current, newObj));
            const actual = benchmark(getJsonPatches.bind(null, a, b), getJsonPatches.name);

            expect(actual).toHaveLength(1);
            expect(actual).toStrictEqual(expected);
        });

        test('should compare array with object', () => {
            const a = [{ a: 5, b: 6 }];
            const b = [{ a: 5, b: 7 }];
            const expected: JsonPatch[] = [{ op: 'set', path: '/0/b', value: b[0].b }];

            const actual = benchmark(getJsonPatches.bind(null, a, b), getJsonPatches.name);

            expect(actual).toHaveLength(1);
            expect(actual).toStrictEqual(expected);
        });
    });

    describe('primitive comparisons', () => {
        test('should compare strings same', () => {
            const a = 'hello';
            const b = 'hello';

            const actual = benchmark(getJsonPatches.bind(null, a, b), getJsonPatches.name);

            expect(actual).toStrictEqual([]);
        });

        test('should compare strings different', () => {
            const a = 'hello';
            const b = 'world';
            const expected: JsonPatch[] = [{ op: 'set', path: '/', value: b }];

            const actual = benchmark(getJsonPatches.bind(null, a, b), getJsonPatches.name);

            expect(actual).toStrictEqual(expected);
        });

        test('should compare boolean same', () => {
            const a = true;
            const b = true;

            const actual = benchmark(getJsonPatches.bind(null, a, b), getJsonPatches.name);

            expect(actual).toStrictEqual([]);
        });

        test('should compare boolean different', () => {
            const a = true;
            const b = false;
            const expected: JsonPatch[] = [{ op: 'set', path: '/', value: b }];

            const actual = benchmark(getJsonPatches.bind(null, a, b), getJsonPatches.name);

            expect(actual).toStrictEqual(expected);
        });

        test('should compare number same', () => {
            const a = 123456;
            const b = 123456;

            const actual = benchmark(getJsonPatches.bind(null, a, b), getJsonPatches.name);

            expect(actual).toStrictEqual([]);
        });

        test('should compare number different', () => {
            const a = 123456;
            const b = 1234567;
            const expected: JsonPatch[] = [{ op: 'set', path: '/', value: b }];

            const actual = benchmark(getJsonPatches.bind(null, a, b), getJsonPatches.name);

            expect(actual).toStrictEqual(expected);
        });
    });

    //TODO: should we support undefined and null?
    // Does cosmos support patching with a undefined or null value?
    // Does RFC spec support patching with a undefined or null value?
    describe('undefined and null comparisons', () => {
        test('should ignore undefined values', () => {
            const a = { undefined: undefined };
            const b = {};

            const actual = getJsonPatches(a, b);

            expect(actual).toStrictEqual([]);
        });

        test.skip('should replace undefined values', () => {
            //TODO: this should work
            const a = { undefined: undefined };
            const b = { undefined: 'valid now' };
            const expected: JsonPatch[] = [{ op: 'set', path: b.undefined }];

            const actual = getJsonPatches(a, b);

            expect(actual).toStrictEqual(expected);
        });
    });
});
