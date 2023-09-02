import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Credit } from "./credit.entity";

@Entity()
export class Balance extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @ManyToOne(() => Credit, credit => credit.balances)
    credit!: Credit;

    @Column({ type: "int", default: 0 })
    amount: number = 0;
}
