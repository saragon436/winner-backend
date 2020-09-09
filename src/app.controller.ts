//declare var node-xlsx;
import { Controller, Get, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }



  
}
