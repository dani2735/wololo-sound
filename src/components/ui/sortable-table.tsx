import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table, TableHeader, TableRow, TableHead, TableBody } from './table';
import { GripVertical } from 'lucide-react';

interface SortableTableColumn {
  id: string;
  label: React.ReactNode;
  width?: string;
  sortable?: boolean;
  onSort?: () => void;
}

interface SortableTableProps {
  columns: SortableTableColumn[];
  children: React.ReactNode;
  onColumnReorder?: (newOrder: string[]) => void;
  className?: string;
}

function SortableTableHead({ column, isDragging }: { column: SortableTableColumn; isDragging: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={`relative group ${column.width || ''}`}
      {...attributes}
    >
      <div className="flex items-center gap-2">
        <div
          {...listeners}
          className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        {column.sortable && column.onSort ? (
          <button
            onClick={column.onSort}
            className="flex-1 text-left hover:text-foreground transition-colors"
          >
            {column.label}
          </button>
        ) : (
          <div className="flex-1">
            {column.label}
          </div>
        )}
      </div>
    </TableHead>
  );
}

export function SortableTable({ columns, children, onColumnReorder, className }: SortableTableProps) {
  const [columnOrder, setColumnOrder] = useState(columns.map(col => col.id));
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedColumn(null);

    if (active.id !== over?.id) {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over?.id as string);
      const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
      
      setColumnOrder(newOrder);
      onColumnReorder?.(newOrder);
    }
  };

  const handleDragStart = (event: any) => {
    setDraggedColumn(event.active.id);
  };

  const orderedColumns = columnOrder.map(id => columns.find(col => col.id === id)).filter(Boolean) as SortableTableColumn[];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className={`overflow-x-auto ${className || ''}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                {orderedColumns.map((column) => (
                  <SortableTableHead 
                    key={column.id} 
                    column={column} 
                    isDragging={draggedColumn === column.id}
                  />
                ))}
              </SortableContext>
            </TableRow>
          </TableHeader>
          <TableBody>
            {children}
          </TableBody>
        </Table>
      </div>
    </DndContext>
  );
}