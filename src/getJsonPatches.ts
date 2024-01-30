export type JsonPatch = {
    op: 'add' | 'remove' | 'replace' | 'set';
    path: string;
    value?: object | string | number | boolean | null | Array<any>;
};

const isPrimitiveType = (value: any) =>
    typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint' || typeof value === 'boolean';

const isValidType = (value: any) => typeof value !== 'function' && typeof value !== 'symbol' && typeof value !== 'undefined';

const isValidObject = (value: any) => typeof value === 'object' && value !== null && !Array.isArray(value);

const getPath = (parent: string, name: string | number = '') => (parent === '' ? `/${name}` : name === '' ? parent : `${parent}/${name}`);

const _getJsonPatches = (a: Object, b: Object, parentName = ''): JsonPatch[] => {
    const result: JsonPatch[] = [];

    // Case: primitive type comparison
    if (isPrimitiveType(a) && isPrimitiveType(b) && a !== b) {
        result.push({ op: 'set', path: getPath(parentName), value: b });
        return result;
    }

    // Case: array type comparison
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            result.push({ op: 'set', path: getPath(parentName), value: b });
            return result;
        }

        for (let index = 0; index < a.length; index++) {
            const aValue = a[index];
            const bValue = b[index];
            if (!isValidType(aValue) || !isValidType(bValue)) continue;

            result.push(..._getJsonPatches(aValue, bValue, getPath(parentName, index)));
        }
        return result;
    }

    const currentProperties = Object.entries(a);
    const newObjectProperties = Object.entries(b);

    // Case: object type comparison - comparing a and b
    for (const [name, value] of currentProperties) {
        if (!isValidType(value)) continue;

        const propName = getPath(parentName, name);
        if (!newObjectProperties.some(([key]) => key === name)) {
            result.push({ op: 'remove', path: propName });
            continue;
        }

        const newValue = b[name as keyof typeof b];

        if (isValidObject(value) && isValidObject(newValue)) {
            result.push(..._getJsonPatches(value, newValue, propName));
            continue;
        }

        // if both are arrays, then compare the arrays
        if (Array.isArray(a) && Array.isArray(b)) {
            result.push(..._getJsonPatches(value, newValue, propName));
            continue;
        }

        if (value !== newValue) {
            result.push({ op: 'set', path: propName, value: newValue });
            continue;
        }
    }

    // Add patches for props added to new object
    for (const [name, value] of newObjectProperties) {
        if (!isValidType(value)) continue;

        if (!currentProperties.some(([key]) => key === name)) {
            result.push({ op: 'add', path: getPath(parentName, name), value });
            continue;
        }
    }

    return result;
};

/**
 * Get collection of differences between two objects expressed as Json patches.
 *
 * @param {Object} a - First object to compare
 * @param {Object} b - Second object to compare
 * @return {JsonPatch[]}  {Patch[]} collection of differences
 */
function getJsonPatches(a: Object, b: Object): JsonPatch[] {
    return _getJsonPatches(a, b);
}

export default getJsonPatches;
