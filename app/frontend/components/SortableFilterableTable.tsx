import { useMemo, useState } from 'react';

type Row = Record<string, string | number>;

type Props = {
  rows: Row[];
  columns: string[];
};

export const SortableFilterableTable = ({ rows, columns }: Props) => {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState(columns[0]);

  const filteredRows = useMemo(() => {
    return rows
      .filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => `${a[sortBy]}`.localeCompare(`${b[sortBy]}`));
  }, [rows, query, sortBy]);

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
          {filteredRows.map((row, index) => (
            <tr key={index}>
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
