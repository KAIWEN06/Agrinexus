import { forwardRef } from "react";
import { cn } from "../../../utils/cn";

/* ==========================
   Root
========================== */

const Table = forwardRef(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto rounded-xl border border-[var(--border)]">
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm",
          className
        )}
        {...props}
      />
    </div>
  )
);

Table.displayName = "Table";

/* ==========================
   Header
========================== */

const TableHeader = forwardRef(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        "bg-[var(--muted)]",
        className
      )}
      {...props}
    />
  )
);

TableHeader.displayName = "TableHeader";

/* ==========================
   Body
========================== */

const TableBody = forwardRef(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(
        "divide-y divide-[var(--border)]",
        className
      )}
      {...props}
    />
  )
);

TableBody.displayName = "TableBody";

/* ==========================
   Footer
========================== */

const TableFooter = forwardRef(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        "bg-[var(--muted)] font-medium",
        className
      )}
      {...props}
    />
  )
);

TableFooter.displayName = "TableFooter";

/* ==========================
   Row
========================== */

const TableRow = forwardRef(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "transition-colors hover:bg-[var(--muted)]",
        className
      )}
      {...props}
    />
  )
);

TableRow.displayName = "TableRow";

/* ==========================
   Head Cell
========================== */

const TableHead = forwardRef(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left font-semibold text-[var(--foreground)]",
        className
      )}
      {...props}
    />
  )
);

TableHead.displayName = "TableHead";

/* ==========================
   Cell
========================== */

const TableCell = forwardRef(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle",
        className
      )}
      {...props}
    />
  )
);

TableCell.displayName = "TableCell";

/* ==========================
   Caption
========================== */

const TableCaption = forwardRef(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn(
        "mt-4 text-sm text-[var(--text-secondary)]",
        className
      )}
      {...props}
    />
  )
);

TableCaption.displayName = "TableCaption";

/* ==========================
   Compound Export
========================== */

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Footer = TableFooter;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Caption = TableCaption;

export default Table;