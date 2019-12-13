import { BaseContext, Context } from 'koa';
import * as path from 'path';
import File from '../util/file';
import router from './router';
const dataSrc = path.resolve(__dirname, '../data/data.json');
const fileFn = new File();

router
  .prefix('/api')
  .post('/add', async (ctx: Context) => {
    console.log(ctx.request.body.data);
    const data = JSON.parse(ctx.request.body.data);
    const res = await fileFn.appendFile(dataSrc, data);
    console.log(res);
    ctx.body = {
      code: res ? 200 : 400,
      msg: 'add data'
    };
  })
  .get('/get', async (ctx: BaseContext) => {
    const readData = await fileFn.readFile(dataSrc);
    ctx.body = {
      code: 200,
      msg: 'get data',
      data: readData
    };
  });
