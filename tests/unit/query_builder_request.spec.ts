import { RequestFactory } from '@adonisjs/core/factories/http';
import app, { setApp } from '@adonisjs/core/services/app';
import { test } from '@japa/runner';
import collect from 'collect.js';
import QueryBuilderRequest from '../../src/query_builder_request.js';
import { createApp } from '../helpers/start_app.js';

test.group('QueryBuilderRequest', (group) => {
  group.each.setup(async () => {
    const myApp = await createApp();
    setApp(myApp);
  });

  test('can filter nested records', ({ assert }) => {
    const request = new RequestFactory().create();
    const expected = {
      info: {
        foo: {
          bar: 1,
        },
      },
    };
    request.updateQs({ filter: expected });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    assert.deepEqual(queryRequest.filters().all(), expected);
  });

  test('can get empty filters recursively', ({ assert }) => {
    const request = new RequestFactory().create();
    request.updateQs({
      filter: {
        info: {
          foo: {
            bar: null,
          },
        },
      },
    });
    const expected = {
      info: {
        foo: {
          bar: '',
        },
      },
    };
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    assert.deepEqual(queryRequest.filters().all(), expected);
  });

  test('will map true and false as booleans recursively', ({ assert }) => {
    const request = new RequestFactory().create();
    request.updateQs({
      filter: {
        info: {
          foo: {
            bar: 'true',
            baz: 'false',
            bazs: '0',
          },
        },
      },
    });
    const expected = {
      info: {
        foo: {
          bar: true,
          baz: false,
          bazs: '0',
        },
      },
    };
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    assert.deepEqual(queryRequest.filters().all(), expected);
  });

  test('can get the sort query param from the request', ({ assert }) => {
    const request = new RequestFactory().create();
    request.updateQs({
      sort: 'foobar',
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    assert.deepEqual(queryRequest.sorts().all(), ['foobar']);
  });

  test('can get the sort query param from the request body', ({ assert }) => {
    const request = new RequestFactory().create();
    request.updateBody({
      sort: 'foobar',
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    assert.deepEqual(queryRequest.sorts().all(), ['foobar']);
  });

  test('can get different sort query parameter name', ({ assert }) => {
    app.config.set('querybuilder.parameters.sort', 'sorts');
    const request = new RequestFactory().create();
    request.updateBody({
      sorts: 'foobar',
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    assert.deepEqual(queryRequest.sorts().all(), ['foobar']);
  });

  test('will return an empty collection when no sort query param is specified', ({ assert }) => {
    const request = new RequestFactory().create();
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    assert.isTrue(queryRequest.sorts().isEmpty());
  });

  test('can get multiple sort parameters from the request', ({ assert }) => {
    const request = new RequestFactory().create();
    request.updateQs({
      sort: 'foo,bar',
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    const expected = collect(['foo', 'bar']);

    assert.deepEqual(queryRequest.sorts(), expected);
  });

  test('can get the filter query params from the request', ({ assert }) => {
    const request = new RequestFactory().create();
    request.updateQs({
      filter: {
        foo: 'bar',
        baz: 'qux',
      },
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    const expected = collect({
      foo: 'bar',
      baz: 'qux',
    });

    assert.deepEqual(queryRequest.filters(), expected);
  });

  test('can get the filter query params from the request body', ({ assert }) => {
    const request = new RequestFactory().create();
    request.updateBody({
      filter: {
        foo: 'bar',
        baz: 'qux',
      },
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    const expected = collect({
      foo: 'bar',
      baz: 'qux',
    });

    assert.deepEqual(queryRequest.filters(), expected);
  });

  test('can use different filter query parameter name', ({ assert }) => {
    app.config.set('querybuilder.parameters.filter', 'filters');
    const request = new RequestFactory().create();
    request.updateQs({
      filters: {
        foo: 'bar',
        baz: 'qux',
      },
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    const expected = collect({
      foo: 'bar',
      baz: 'qux',
    });

    assert.deepEqual(queryRequest.filters(), expected);
  });

  test('can get empty filters', ({ assert }) => {
    const request = new RequestFactory().create();
    request.updateQs({
      filter: {
        foo: 'bar',
        baz: null,
      },
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    const expected = collect({
      foo: 'bar',
      baz: '',
    });

    assert.deepEqual(queryRequest.filters(), expected);
  });

  test('will return an empty collection when no filter query params are specified', ({ assert }) => {
    const request = new RequestFactory().create();
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    assert.isTrue(queryRequest.filters().isEmpty());
  });

  test('will map comma separated values as arrays when given in a filter query string', ({ assert }) => {
    const request = new RequestFactory().create();
    request.updateQs({
      filter: {
        foo: 'bar',
        baz: 'qux,lex',
      },
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    const expected = collect({
      foo: 'bar',
      baz: ['qux', 'lex'],
    });

    assert.deepEqual(queryRequest.filters(), expected);
  });

  test('will map array in filter recursively when given in a filter query string', ({ assert }) => {
    const request = new RequestFactory().create();
    request.updateQs({
      filter: {
        foo: 'bar,baz',
        bar: {
          foobar: 'baz,bar',
        },
      },
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    const expected = collect({
      foo: ['bar', 'baz'],
      bar: {
        foobar: ['baz', 'bar'],
      },
    });

    assert.deepEqual(queryRequest.filters(), expected);
  });

  test('can get the include query params from the request', ({ assert }) => {
    const request = new RequestFactory().create();
    request.updateQs({
      include: 'foo,bar',
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    const expected = collect(['foo', 'bar']);

    assert.deepEqual(queryRequest.includes(), expected);
  });

  test('can get the include from the request body', ({ assert }) => {
    const request = new RequestFactory().create();
    request.updateBody({
      include: 'foo,bar',
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    const expected = collect(['foo', 'bar']);

    assert.deepEqual(queryRequest.includes(), expected);
  });

  test('can get different include query parameter name', ({ assert }) => {
    app.config.set('querybuilder.parameters.include', 'includes');
    const request = new RequestFactory().create();
    request.updateBody({
      includes: 'foo,bar',
    });
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    const expected = collect(['foo', 'bar']);

    assert.deepEqual(queryRequest.includes(), expected);
  });

  test('will return an empty collection when no include whery params are specified', ({ assert }) => {
    const request = new RequestFactory().create();
    const queryRequest = QueryBuilderRequest.fromRequest(request);

    assert.isTrue(queryRequest.includes().isEmpty());
  });
});
