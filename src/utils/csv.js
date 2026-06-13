// CSV serialization kept separate from the download side effect so the
// formatting logic stays pure and unit-testable.

export const toCsv = (data) => {
  const headers = Object.keys(data[0]);
  return [
    headers.join(','),
    ...data.map(r => headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
};

export const downloadCsv = (data, name) => {
  const blob = new Blob([toCsv(data)], { type:'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `${name}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
