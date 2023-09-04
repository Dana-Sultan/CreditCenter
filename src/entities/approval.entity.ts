import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from "typeorm";
import { Credit } from "./credit.entity";

@Entity()
@Unique(["credit", "owner", "spender"])
export class Approval extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Credit, credit => credit.approvals)
    credit!: Credit;

    @Column()
    owner!: number;

    @Column()
    spender!: number;

    @Column({ type: "int", default: 0 })
    amount!: number;
}

