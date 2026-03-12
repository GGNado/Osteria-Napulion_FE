import { Component, signal, computed, input, inject, ElementRef, viewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Table, TableStatus } from '../../../../core/models/table.model';
import { TableService } from '../../../../core/services/table.service';
import { UpdateTableSchemaDTO } from '../../../../core/dto/update-table-schema.dto';

@Component({
    selector: 'app-floor-plan',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './floor-plan.html',
    styleUrl: './floor-plan.css',
})
export class FloorPlanComponent implements OnInit {
    private readonly tableService = inject(TableService);

    /** Se true abilita drag-and-drop, crea/elimina tavoli, salva */
    readonly editable = input(false);

    readonly selectedTable = signal<Table | null>(null);
    readonly hasUnsavedChanges = signal(false);
    readonly isSaving = signal(false);
    readonly isLoading = signal(false);

    private nextId = 100; // per nuovi tavoli creati lato client

    readonly tables = signal<Table[]>([]);

    ngOnInit(): void {
        this.loadTablesFromApi();
    }

    private loadTablesFromApi(): void {
        this.isLoading.set(true);
        console.log("Entro")
        this.tableService.getAllTables().subscribe({
            next: (res) => {
                const tableArray = res.body?.TavoloFindAllDTO;
                if (tableArray && Array.isArray(tableArray)) {
                    const mapped: Table[] = tableArray.map((t: any) => this.mapBackendTable(t));
                    if (mapped.length > 0) {
                        this.tables.set(mapped);
                        this.nextId = Math.max(...mapped.map(t => t.id)) + 1;
                    }
                }
                this.isLoading.set(false);
            },
            error: () => {
                console.warn('⚠️ Impossibile caricare i tavoli dal backend');
                this.isLoading.set(false);
            },
        });
    }

    /** Mappa un tavolo dal backend al formato interno Table */
    private mapBackendTable(t: any): Table {
        const isSmall = (t.massimoPosti ?? 4) <= 4;
        return {
            id: t.id,
            nome: t.nome ?? `Tavolo ${t.id}`,
            attivo: t.attivo ?? true,
            minimoPosti: t.minimoPosti ?? 2,
            massimoPosti: t.massimoPosti ?? 4,
            x: t.x ?? 400,
            y: t.y ?? 300,
            /*shape: isSmall ? 'rect' : 'rect',
            ...(isSmall
                ? { radius: 35 }
                : { width: t.massimoPosti >= 8 ? 120 : 100, height: t.massimoPosti >= 8 ? 70 : 60 }),*/
            shape:  'rect',
            width: 100,
            height: 60,
            status: TableStatus.LIBERO,
        };
    }

    readonly statusColors: Record<TableStatus, string> = {
        [TableStatus.LIBERO]: '#22c55e',
        [TableStatus.PRENOTATO]: '#f59e0b',
        [TableStatus.OCCUPATO]: '#ef4444',
    };

    readonly statusLabels: Record<TableStatus, string> = {
        [TableStatus.LIBERO]: 'Libero',
        [TableStatus.PRENOTATO]: 'Prenotato',
        [TableStatus.OCCUPATO]: 'Occupato',
    };

    readonly legendItems = [
        { status: TableStatus.LIBERO, label: 'Libero', color: '#22c55e' },
        { status: TableStatus.PRENOTATO, label: 'Prenotato', color: '#f59e0b' },
        { status: TableStatus.OCCUPATO, label: 'Occupato', color: '#ef4444' },
    ];

    readonly editLegendItems = [
        { label: 'Attivo', color: '#E8792B' },
        { label: 'Disattivato', color: '#c9c5bd' },
    ];

    // ─── Drag state ───
    private dragging = false;
    private dragTable: Table | null = null;
    private dragOffsetX = 0;
    private dragOffsetY = 0;
    isDragging = signal(false);

    readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('floorSvg');

    // ─── Table selection ───

    selectTable(table: Table): void {
        if (!this.editable()) {
            // read-only: toggle info panel
            if (this.selectedTable()?.id === table.id) {
                this.selectedTable.set(null);
            } else {
                this.selectedTable.set(table);
            }
        } else {
            this.selectedTable.set(table);
        }
    }

    closePanel(): void {
        this.selectedTable.set(null);
    }

    // ─── Drag-and-drop ───

    onTableMouseDown(event: MouseEvent, table: Table): void {
        if (!this.editable()) return;
        event.preventDefault();
        event.stopPropagation();

        this.dragging = true;
        this.dragTable = table;
        this.isDragging.set(true);

        const pt = this.getSvgPoint(event);
        if (table.shape === 'circle') {
            this.dragOffsetX = pt.x - table.x;
            this.dragOffsetY = pt.y - table.y;
        } else {
            this.dragOffsetX = pt.x - table.x;
            this.dragOffsetY = pt.y - table.y;
        }

        this.selectedTable.set(table);
    }

    onSvgMouseMove(event: MouseEvent): void {
        if (!this.dragging || !this.dragTable) return;
        event.preventDefault();

        const pt = this.getSvgPoint(event);
        const newX = pt.x - this.dragOffsetX;
        const newY = pt.y - this.dragOffsetY;

        this.tables.update(tables =>
            tables.map(t =>
                t.id === this.dragTable!.id
                    ? { ...t, x: Math.round(newX), y: Math.round(newY) }
                    : t,
            ),
        );

        // update selectedTable reference
        const updated = this.tables().find(t => t.id === this.dragTable!.id);
        if (updated) {
            this.selectedTable.set(updated);
            this.dragTable = updated;
        }

        this.hasUnsavedChanges.set(true);
    }

    onSvgMouseUp(): void {
        this.dragging = false;
        this.dragTable = null;
        this.isDragging.set(false);
    }

    onSvgMouseLeave(): void {
        if (this.dragging) {
            this.onSvgMouseUp();
        }
    }

    private getSvgPoint(event: MouseEvent): { x: number; y: number } {
        const svgEl = this.svgRef()?.nativeElement;
        if (!svgEl) return { x: 0, y: 0 };

        const ctm = svgEl.getScreenCTM();
        if (!ctm) return { x: 0, y: 0 };

        return {
            x: (event.clientX - ctm.e) / ctm.a,
            y: (event.clientY - ctm.f) / ctm.d,
        };
    }

    // ─── CRUD operations ───

    addTable(): void {
        const newTable: Table = {
            id: this.nextId++,
            nome: `Tavolo ${this.tables().length + 1}`,
            attivo: true,
            minimoPosti: 2,
            massimoPosti: 4,
            x: 400,
            y: 300,
            width: 100,
            height: 60,
            shape: 'rect',
            status: TableStatus.LIBERO,
            isNew: true,
        };

        this.tables.update(tables => [...tables, newTable]);
        this.selectedTable.set(newTable);
        this.hasUnsavedChanges.set(true);
    }

    deleteSelectedTable(): void {
        const sel = this.selectedTable();
        if (!sel) return;
        this.tables.update(tables => tables.filter(t => t.id !== sel.id));
        this.selectedTable.set(null);
        this.hasUnsavedChanges.set(true);
    }

    updateSelectedField(field: keyof Table, value: any): void {
        const sel = this.selectedTable();
        if (!sel) return;

        // aggiorna dimensioni di default quando si cambia forma
        let extra: Partial<Table> = {};
        if (field === 'shape') {
            if (value === 'circle') {
                extra = { radius: 35, width: undefined, height: undefined };
            } else {
                extra = { width: 100, height: 60, radius: undefined };
            }
        }

        this.tables.update(tables =>
            tables.map(t =>
                t.id === sel.id ? { ...t, [field]: value, ...extra } : t,
            ),
        );

        const updated = this.tables().find(t => t.id === sel.id);
        if (updated) this.selectedTable.set(updated);
        this.hasUnsavedChanges.set(true);
    }

    saveLayout(): void {
        this.isSaving.set(true);

        const dto: UpdateTableSchemaDTO[] = this.tables().map(t => ({
            id: t.isNew ? null : t.id,
            nome: t.nome,
            minimoPosti: t.minimoPosti,
            massimoPosti: t.massimoPosti,
            attivo: t.attivo,
            x: t.x,
            y: t.y,
            isNew: t.isNew || false,
        }));

        this.tableService.updateSchema(dto).subscribe({
            next: () => {
                this.hasUnsavedChanges.set(false);
                this.isSaving.set(false);
                // Ricarica per sincronizzare ID generati dal backend
                this.loadTablesFromApi();
            },
            error: (err) => {
                console.error('❌ Errore nel salvataggio:', err);
                this.isSaving.set(false);
            },
        });
    }

    // ─── Helpers ───

    getTableFill(table: Table): string {
        if (this.editable()) {
            // In edit mode: active = brand color, inactive = grey
            return table.attivo ? '#E8792B' : '#c9c5bd';
        }
        return this.statusColors[table.status];
    }

    getTableCenterX(table: Table): number {
        if (table.shape === 'circle') return table.x;
        return table.x + (table.width ?? 100) / 2;
    }

    getTableCenterY(table: Table): number {
        if (table.shape === 'circle') return table.y;
        return table.y + (table.height ?? 60) / 2;
    }
}
