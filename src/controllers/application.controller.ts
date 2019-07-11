import { Controller, Get, Res, Header } from '@nestjs/common';
import { PrometheusService } from '../logger/prometheus.service';
import { logger } from '../logger/logger.service';
import { join } from 'path';
import { Utils } from '../utils/utils';

@Controller()
export class ApplicationController {
  constructor(private readonly prometheus: PrometheusService) {}

  @Get('/')
  @Header('Content-Type', 'text/html')
  async welcome(@Res() response): Promise<string> {
    return response.send(Utils.renderHbs('homepage'));
  }

  @Get('/metrics')
  getMetrics(): any {
    return this.prometheus.Prometheus.register.metrics();
  }
}
