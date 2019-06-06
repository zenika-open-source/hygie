import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApplicationController {
  @Get('/')
  welcome(): string {
    return (
      '<p><b>Git Webhooks</b> is running!</p>' +
      '<p>Have a look at our <a href="https://dx-developerexperience.github.io/git-webhooks/">documentation</a> for more informations.</p>'
    );
  }
}
