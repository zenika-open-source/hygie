import { Controller, Get, Header } from '@nestjs/common';
import { getAllRules } from '../generator/getAllRules';
import { getAllRunnables } from '../generator/getAllRunnables';
import { getAllOptions } from '../generator/getAllOptions';
import { getYAMLSchema } from '../generator/getYAMLSchema';
@Controller('doc')
export class DocumentationController {
  @Get('/schema')
  getYAMLSchema(): object {
    return getYAMLSchema();
  }

  @Get('/rules')
  @Header('Access-Control-Allow-Origin', '*')
  getAllRules(): object {
    return getAllRules();
  }

  @Get('/runnables')
  @Header('Access-Control-Allow-Origin', '*')
  getAllRunnables(): object {
    return getAllRunnables();
  }

  @Get('/options')
  @Header('Access-Control-Allow-Origin', '*')
  getAllOptions(): object {
    return getAllOptions();
  }
}
