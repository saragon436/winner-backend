import { Injectable } from '@nestjs/common';
import * as xlsx from 'node-xlsx';
import { ProductStock } from 'src/entity/product-stock';
import { EntityManager } from 'typeorm';
import { ResponseGeneric } from 'src/model/response-generic';
@Injectable()
export class ProductService {


    readonly SUCCESS_NESSAGE: string = 'SUCCESS';
    readonly ERROR_NESSAGE: string = 'ERROR';

    constructor(private connection: EntityManager) { }

    async truncateTable(): Promise<ResponseGeneric> {
        try {
            await this.connection.query("TRUNCATE TABLE product_stock");
            return new ResponseGeneric(true, this.SUCCESS_NESSAGE, null);
        } catch (error) {
            return new ResponseGeneric(true, this.ERROR_NESSAGE + " : " + error, null);
        }
    }


    async uploadExcel(files: any): Promise<ResponseGeneric> {
        try {
            const workSheetsFromFile = xlsx.parse(files[0].buffer);

            workSheetsFromFile[0].data.forEach(async (row, index) => {
                let arrayRow = Array.from(row);
                if (index > 0 && arrayRow[0] != null) {
                    const product_stock = new ProductStock();
                    product_stock.idProduct = arrayRow[0];
                    product_stock.description = arrayRow[1];
                    product_stock.quantity = arrayRow[2];
                    await product_stock.save();
                }
            })
            return new ResponseGeneric(true, this.SUCCESS_NESSAGE, null);
        } catch (error) {
            return new ResponseGeneric(true, this.ERROR_NESSAGE + ' : ' + error, null);
        }
    }

    async findByIdAndDescription(idProduct: string, description: string): Promise<ResponseGeneric> {
        try {
            let query = `CALL SP_GET_STOCK_BY_FILTERS(?,?)`;
            let data = await this.connection.query(query, [idProduct, description]);
            return new ResponseGeneric(true, this.SUCCESS_NESSAGE, data[0]);
        } catch (error) {
            return new ResponseGeneric(true, this.ERROR_NESSAGE + ' : ' + error, null);
        }

    }
}
