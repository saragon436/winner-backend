import { Injectable, Logger } from '@nestjs/common';
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
                    product_stock.familia = arrayRow[0];
                    product_stock.categoria = arrayRow[1];
                    product_stock.idProduct = arrayRow[2];
                    product_stock.description = arrayRow[3];
                    product_stock.quantity = arrayRow[4];
                    await product_stock.save();
                }
            })
            return new ResponseGeneric(true, this.SUCCESS_NESSAGE, null);
        } catch (error) {
            return new ResponseGeneric(true, this.ERROR_NESSAGE + ' : ' + error, null);
        }
    }

    async findByIdAndDescription(idProduct: string, description: string,codigo :string): Promise<ResponseGeneric> {
        try {
            if(codigo=='2'){
                let query = `CALL SP_GET_STOCK_BY_FILTERS(?,?)`;
                let data = await this.connection.query(query, [idProduct, description]);
                return new ResponseGeneric(true, this.SUCCESS_NESSAGE, data[0]);                
            }else{
                return new ResponseGeneric(true, this.ERROR_NESSAGE + ' : ' + 'no tiene acceso', null);
            }            
        } catch (error) {
            return new ResponseGeneric(true, this.ERROR_NESSAGE + ' : ' + error, null);
        }

    }

    async findAllFamily(): Promise<ResponseGeneric> {
        try {
            let query = `CALL SP_GET_FAMILY_ALL()`;
            let data = await this.connection.query(query, []);
            return new ResponseGeneric(true, this.SUCCESS_NESSAGE, data[0]);
        } catch (error) {
            return new ResponseGeneric(true, this.ERROR_NESSAGE + ' : ' + error, null);
        }

    }

    async findByFamily(family: string,codigo :string): Promise<ResponseGeneric> {
        try {
            if(codigo=='2'){
            let query = `CALL SP_GET_CATEGORY_FAMILY(?)`;
            let data = await this.connection.query(query, [family]);
            return new ResponseGeneric(true, this.SUCCESS_NESSAGE, data[0]);
            }else{
                return new ResponseGeneric(true, this.ERROR_NESSAGE + ' : ' + 'no cuenta con permisos', null);  
            }
        } catch (error) {
            return new ResponseGeneric(true, this.ERROR_NESSAGE + ' : ' + error, null);
        }

    }

    async findByCategory(family:string,category: string,codigo :string): Promise<ResponseGeneric> {
        try {
            if(codigo=="2"){
            let query = `CALL SP_GET_PRODUCTO_CATEGORY(?,?)`;
            let data = await this.connection.query(query, [family,category]);
            return new ResponseGeneric(true, this.SUCCESS_NESSAGE + ' el codigo es' + codigo, data[0]);
            }else{
                return new ResponseGeneric(true, this.ERROR_NESSAGE + ' el codigo es' + codigo + ' : ' + 'no cuenta con permisos', null);
            }
        } catch (error) {
            return new ResponseGeneric(true, this.ERROR_NESSAGE + ' : ' + error, null);
        }

    }
}
