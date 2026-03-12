export interface UpdateTableSchemaDTO {
    id: number | null;
    nome: string;
    minimoPosti: number;
    massimoPosti: number;
    attivo: boolean;
    x: number;
    y: number;
    isNew?: boolean;
}
