import { Controller, Post, UploadedFiles, UseInterceptors, Get, Query, Request, Param, Res } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import { Image } from '../model/Image.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

export const storage = {
    storage: diskStorage({
        destination: './uploads/blog-entry-images',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name;//.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })

}

//import { xlsx } from 'node-xlsx';
@Controller('product')
export class ProductController {

    constructor(private productService:ProductService){}
    
    @Post("/stock/upload")
    @UseInterceptors(FilesInterceptor('files'))
    uploadExcel(@UploadedFiles() files) {
        this.productService.truncateTable();
        return this.productService.uploadExcel(files);
    }

    @Get("/stock")
    findByIdAndDescription(@Query('idProduct') idProduct: string = null,@Query('description') description: string = null) {
        return this.productService.findByIdAndDescription(idProduct,description);
    }

    @UseInterceptors(FileInterceptor('file', storage))
    @Post('/image/upload')
    uploadFile(@UploadedFiles() file, @Request() req): Observable<Image> {
        return of(file);
    }

    @Get('/image/:imagename')
    findImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/blog-entry-images/' + imagename)));
    }

}
