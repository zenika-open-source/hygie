import { Controller, Get, Res } from '@nestjs/common';
import { PrometheusService } from '../logger/prometheus.service';

@Controller()
export class ApplicationController {
  constructor(private readonly prometheus: PrometheusService) {}

  @Get('/')
  welcome(@Res() response): string {
    return response.render('homepage.hbs');
  }

  @Get('/metrics')
  getMetrics(): any {
    return this.prometheus.Prometheus.register.metrics();
  }
}
