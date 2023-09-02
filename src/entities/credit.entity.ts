import { Entity, BaseEntity, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Balance } from "./balance.entity";

@Entity()
export class Credit extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    symbol!: string;

    @Column()
    owner!: string;

    @OneToMany(() => Balance, balance => balance.credit)
    balances!: Balance[];
}