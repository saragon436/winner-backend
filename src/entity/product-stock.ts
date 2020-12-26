import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ProductStock extends BaseEntity {
    @PrimaryGeneratedColumn()
    idProduct_stock: string;

    @Column()
    familia: string;

    @Column()
    categoria: string;

    @Column()
    idProduct: String;

    @Column()
    description: string;

    @Column()
    quantity: number;


}
