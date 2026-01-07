interface LastResultsProps {
  results: number[];
}

export const LastResults = ({ results }: LastResultsProps) => {
  return (
    <div className="card-elevated p-4">
      <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-3">Last 10 Results</h3>
      <div className="flex flex-wrap gap-2">
        {results.length === 0 ? (
          <p className="text-muted-foreground text-sm">No results yet</p>
        ) : (
          results.map((number, index) => (
            <div
              key={`${number}-${index}`}
              className={`result-chip ${index === 0 ? 'result-chip-recent animate-result-pop' : ''}`}
            >
              {number}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
