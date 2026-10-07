import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * TableContainer (Wrapper div with rounded borders, subtle shadow, and horizontal scrolling)
 */
export interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

const TableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(
  ({ className, bordered = true, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="table-container"
      className={cn(
        'relative w-full overflow-hidden rounded-xl bg-surface-card shadow-xs',
        bordered && 'border border-border-subtle',
        className
      )}
      {...props}
    >
      <div className="w-full overflow-x-auto scrollbar-thin">{children}</div>
    </div>
  )
);
TableContainer.displayName = 'TableContainer';

/**
 * Table Root Component
 */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  dense?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, dense = false, ...props }, ref) => (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        ref={ref}
        data-slot="table"
        data-dense={dense ? '' : undefined}
        className={cn(
          'w-full caption-bottom text-left text-sm text-on-surface border-collapse',
          dense ? '[&_td]:py-2 [&_th]:py-2' : '',
          className
        )}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

/**
 * Table Header (<thead>)
 */
export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    data-slot="table-header"
    className={cn(
      'bg-surface-bg border-b border-border-subtle text-[11px] font-bold uppercase tracking-wider text-text-muted select-none [&_tr]:border-b',
      className
    )}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

/**
 * Table Body (<tbody>)
 */
export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    data-slot="table-body"
    className={cn(
      'divide-y divide-border-subtle/70 bg-surface-card [&_tr:last-child]:border-0',
      className
    )}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

/**
 * Table Footer (<tfoot>)
 */
export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    data-slot="table-footer"
    className={cn(
      'border-t border-border-subtle bg-surface-bg/80 font-medium text-on-surface [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

/**
 * Table Row (<tr>)
 */
export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
  selected?: boolean;
  striped?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, hoverable = true, selected = false, striped = false, ...props }, ref) => (
    <tr
      ref={ref}
      data-slot="table-row"
      data-state={selected ? 'selected' : undefined}
      className={cn(
        'border-b border-border-subtle transition-colors duration-150',
        hoverable && 'hover:bg-slate-50/80',
        striped && 'even:bg-slate-50/40',
        selected && 'bg-primary/5 hover:bg-primary/10',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

/**
 * Table Header Cell (<th>)
 */
export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  alignContent?: 'left' | 'center' | 'right';
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, alignContent = 'left', ...props }, ref) => {
    const alignClass = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[alignContent];

    return (
      <th
        ref={ref}
        data-slot="table-head"
        className={cn(
          'h-10 px-4 py-3.5 align-middle text-[11px] font-bold uppercase tracking-wider text-text-muted whitespace-nowrap [&:has([role=checkbox])]:pr-0',
          alignClass,
          className
        )}
        {...props}
      />
    );
  }
);
TableHead.displayName = 'TableHead';

/**
 * Table Data Cell (<td>)
 */
export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  alignContent?: 'left' | 'center' | 'right';
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, alignContent = 'left', ...props }, ref) => {
    const alignClass = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[alignContent];

    return (
      <td
        ref={ref}
        data-slot="table-cell"
        className={cn(
          'px-4 py-3.5 align-middle text-sm text-on-surface whitespace-nowrap [&:has([role=checkbox])]:pr-0',
          alignClass,
          className
        )}
        {...props}
      />
    );
  }
);
TableCell.displayName = 'TableCell';

/**
 * Table Caption (<caption>)
 */
export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    data-slot="table-caption"
    className={cn('mt-4 text-xs text-text-muted', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

/**
 * Table Empty State Component (<tr><td colspan="...">{content}</td></tr>)
 */
export interface TableEmptyProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  colSpan: number;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const TableEmpty: React.FC<TableEmptyProps> = ({
  colSpan,
  icon,
  title = 'Tidak ada data ditemukan',
  description = 'Belum ada rekaman data yang tersedia pada tabel ini.',
  action,
  className,
  ...props
}) => {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cn('px-4 py-12 text-center align-middle', className)}
        {...props}
      >
        <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
          {icon && (
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-text-muted mb-1">
              {icon}
            </div>
          )}
          <h4 className="text-sm font-semibold text-on-surface">{title}</h4>
          {description && (
            <p className="text-xs text-text-muted leading-relaxed">{description}</p>
          )}
          {action && <div className="mt-3">{action}</div>}
        </div>
      </td>
    </tr>
  );
};

/**
 * Table Loading Skeleton Rows Component
 */
export interface TableLoadingProps {
  colSpan: number;
  rows?: number;
}

export const TableLoading: React.FC<TableLoadingProps> = ({
  colSpan,
  rows = 4,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="animate-pulse">
          {Array.from({ length: colSpan }).map((_, cIdx) => (
            <td key={cIdx} className="px-4 py-4">
              <div
                className={cn(
                  'h-4 bg-slate-200/80 rounded-md',
                  cIdx === 0
                    ? 'w-3/4'
                    : cIdx === colSpan - 1
                    ? 'w-1/2 ml-auto'
                    : 'w-full'
                )}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

export default Table;
