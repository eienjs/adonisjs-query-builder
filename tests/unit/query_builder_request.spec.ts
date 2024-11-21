import { RequestFactory } from '@adonisjs/core/factories/http';
import { setApp } from '@adonisjs/core/services/app';
import { test } from '@japa/runner';
import QueryBuilderRequest from '../../src/query_builder_request.js';
import { createApp } from '../helpers/start_app.js';

test.group('QueryBuilderRequest', () => {
  test('can filter nested records', async ({ assert }) => {
    const app = await createApp();
    setApp(app);
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

  test('can get empty filters recursively', async ({ assert }) => {
    const app = await createApp();
    setApp(app);
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
});
