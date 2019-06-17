import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApplicationController {
  @Get('/')
  welcome(): string {
    return (
      '<p><b>Hygie</b> is running!</p>' +
      '<p>Have a look at our <a href="https://dx-developerexperience.github.io/hygie/">documentation</a> for more informations.</p>'
    );
  }
}
