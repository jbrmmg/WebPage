/*
 * Equivalent of RegularDTO
 */

export interface IRegular {
    id: number;
    accountId: string;
    amount: number;
    categoryId: string;
    frequency: string;
    weekendAdj: string;
    start: string;
    lastCreated: string;
    description: string;
}
