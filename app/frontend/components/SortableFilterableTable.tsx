import { useMemo, useState } from 'react';

type Row = { id?: string | number } & Record<string, string | number | undefined>;

type Props = {
  rows: Row[];
  columns: string[];
};

export const SortableFilterableTable = ({ rows, columns }: Props) => {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState(columns[0]);

  const filteredRows = useMemo(() => {
    return rows
      .map((row, sourceIndex) => ({ row, sourceIndex }))
      .filter(({ row }) =>
        columns.some((column) => `${row[column] ?? ''}`.toLowerCase().includes(query.toLowerCase()))
      )
      .sort(({ row: a }, { row: b }) => {
        const left = a[sortBy];
        const right = b[sortBy];
        if (typeof left === 'number' && typeof right === 'number') return left - right;
        return `${left ?? ''}`.localeCompare(`${right ?? ''}`);
      });
  }, [rows, columns, query, sortBy]);

  return (
    <section>
      <input placeholder="Filter table" value={query} onChange={(e) => setQuery(e.target.value)} />
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>
                <button onClick={() => setSortBy(column)}>{column}</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map(({ row, sourceIndex }) => (
            <tr key={row.id ?? `row-${sourceIndex}`}>
              {columns.map((column) => (
                <td key={column}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
