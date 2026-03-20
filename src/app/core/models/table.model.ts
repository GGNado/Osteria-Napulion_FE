export enum TableStatus {
    LIBERO = 'Libero',
    IN_ATTESA = 'In Attesa',
    OCCUPATO = 'Occupato',
}

export interface Table {
    id: number;
    nome: string;
    attivo: boolean;
    minimoPosti: number;
    massimoPosti: number;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    shape: 'rect' | 'circle';
    status: TableStatus;
    isNew?: boolean;
}
