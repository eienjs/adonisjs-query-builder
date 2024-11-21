import { URL } from 'node:url';
import { IgnitorFactory } from '@adonisjs/core/factories';
import { type ApplicationService } from '@adonisjs/core/types';

const BASE_URL = new URL('tmp/', import.meta.url);

export const createApp = async (): Promise<ApplicationService> => {
  const ignitor = new IgnitorFactory().withCoreConfig().create(BASE_URL);
  const app = ignitor.createApp('web');
  await app.init();
  await app.boot();

  return app;
};
