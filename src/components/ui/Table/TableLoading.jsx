export default function TableLoading({
  rows = 6,
  columns = 6,
}) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, row) => (
        <tr
          key={row}
          className="border-b"
        >
          {Array.from({ length: columns }).map((_, col) => (
            <td
              key={col}
              className="p-4"
            >
              <div className="h-4 animate-pulse rounded bg-slate-200" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}