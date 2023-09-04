import { Entity, BaseEntity, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Balance } from "./balance.entity";
import { Approval } from "./approval.entity";

@Entity()
export class Credit extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    symbol!: string;

    @Column()
    owner!: number;

    @OneToMany(() => Balance, balance => balance.credit)
    balances!: Balance[];

    @OneToMany(() => Approval, approval => approval.credit)
    approvals!: Approval[];
}