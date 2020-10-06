# deep-non-null

A type guard to ensure all properties in an object are not null or undefined.

Useful for unmarshalling data from the outside world (such as handling the
response object from a GraphQL query)

## Usage

```js
import isDeepNonNull from 'deep-non-null';

isDeepNonNull({
    foo: {
        bar: 'baz',
    },
});
//=> true

isDeepNonNull({
    foo: {
        bar: null,
    },
});
//=> false
```

**Real world example**

```jsx
import isDeepNonNull from 'deep-non-null';

function MyComponent() {
    const { data, error, loading } = useQuery(GET_MY_DATA);

    if (loading) return 'Loading...';
    if (error) throw error;
    if (!isDeepNonNull) throw new Error('Response contained null attributes');

    // Everything in `data` is guaranteed to be not null - which typescript should know about
    return <div>{data.foo.bar}</div>;
}
```

_(Our 'real world' example doesn't print the attribute that was null to avoid logging [PII](https://en.wikipedia.org/wiki/Personal_data). In non production settings, you could use `options.throwError` to get a nice error message containing this.)_

## Install

```
$ yarn add deep-non-null
```

## API

### `isDeepNonNull`

Type: `Function`<br />
Signature: `(obj: Object, options?: Object) => boolean`

**Options**

-   `options.throwError`: Throw an error instead of returning a boolean if null or undefined is found in the object

### `isDeepNonNullWithAllowedPaths`

Type: `Function`<br />
Signature: `(obj: Object, options?: Object) => boolean`

**Options**

-   `options.throwError`: Throw an error instead of returning a boolean if null or undefined is found in the object
-   `options.allowedNull`: A list of [JSONPaths](https://github.com/dchester/jsonpath) to exclude from the null checking

## Contact

-   [@mark_larah - https://twitter.com/mark_larah](https://twitter.com/mark_larah)
