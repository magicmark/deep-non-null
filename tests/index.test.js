//import test from 'ava';
const test = require('ava');
const { default: isDeepNonNull, isDeepNonNullWithAllowedPaths } = require('../src');

test('isDeepNonNull', (t) => {
    t.is(
        isDeepNonNull({
            storeName: 'My Cool Bookshop',
            books: [
                { title: 'Fantastic Mr. Fox', price: 4 },
                { title: 'Becoming Michelle Obama', price: 4 },
                { title: 'The Great Gatsby', price: 5 },
            ],
        }),
        true,
    );

    t.is(
        isDeepNonNull({
            storeName: null,
            books: [
                { title: 'Fantastic Mr. Fox', price: 4 },
                { title: 'Becoming Michelle Obama', price: 4 },
                { title: 'The Great Gatsby', price: 5 },
            ],
        }),
        false,
    );

    t.is(
        isDeepNonNull({
            storeName: 'My Cool Bookshop',
            books: [
                { title: 'Fantastic Mr. Fox', price: 4 },
                { title: 'Becoming Michelle Obama', price: null },
                { title: 'The Great Gatsby', price: 5 },
            ],
        }),
        false,
    );
});

test('isDeepNonNullWithAllowedPaths', (t) => {
    t.is(
        isDeepNonNullWithAllowedPaths({
            storeName: 'My Cool Bookshop',
            books: [
                { title: 'Fantastic Mr. Fox', price: 4 },
                { title: 'Becoming Michelle Obama', price: 4 },
                { title: 'The Great Gatsby', price: 5 },
            ],
        }),
        true,
    );

    t.is(
        isDeepNonNullWithAllowedPaths({
            storeName: null,
            books: [
                { title: 'Fantastic Mr. Fox', price: 4 },
                { title: 'Becoming Michelle Obama', price: 4 },
                { title: 'The Great Gatsby', price: 5 },
            ],
        }),
        false,
    );

    t.is(
        isDeepNonNullWithAllowedPaths({
            storeName: 'My Cool Bookshop',
            books: [
                { title: 'Fantastic Mr. Fox', price: 4 },
                { title: 'Becoming Michelle Obama', price: null },
                { title: 'The Great Gatsby', price: 5 },
            ],
        }),
        false,
    );
});

test('isDeepNonNullWithAllowedPaths with allowedNull set', (t) => {
    t.is(
        isDeepNonNullWithAllowedPaths(
            {
                storeName: 'My Cool Bookshop',
                books: [
                    { title: 'Fantastic Mr. Fox', price: 4 },
                    { title: 'Becoming Michelle Obama', price: 4 },
                    { title: 'The Great Gatsby', price: 5 },
                ],
            },
            { allowedNull: [] },
        ),
        true,
    );

    t.is(
        isDeepNonNullWithAllowedPaths(
            {
                storeName: null,
                books: [
                    { title: 'Fantastic Mr. Fox', price: 4 },
                    { title: 'Becoming Michelle Obama', price: 4 },
                    { title: 'The Great Gatsby', price: 5 },
                ],
            },
            { allowedNull: '$.storeName' },
        ),
        true,
    );

    t.is(
        isDeepNonNullWithAllowedPaths(
            {
                storeName: 'My Cool Bookshop',
                books: [
                    { title: 'Fantastic Mr. Fox', price: 4 },
                    { title: 'Becoming Michelle Obama', price: null },
                    { title: 'The Great Gatsby', price: 5 },
                ],
            },
            { allowedNull: '$.books..price' },
        ),
        true,
    );
});
