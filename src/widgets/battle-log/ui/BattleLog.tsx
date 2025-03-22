import { FC, useEffect, useRef } from "react";

interface Props {
  logs: string[];
}

export const BattleLog: FC<Props> = ({ logs }) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-bold mb-2">Боевой журнал</h3>
      <div
        ref={logRef}
        className="h-40 overflow-y-auto space-y-2 bg-surface/50 backdrop-blur-sm rounded-lg p-4"
      >
        {logs.map((log, index) => (
          <div
            key={index}
            className={`
              text-sm py-1 px-2 rounded 
              ${
                index === logs.length - 1
                  ? "bg-primary/20 animate-flash"
                  : "bg-background/50"
              }
            `}
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
