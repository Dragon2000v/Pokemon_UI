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
    <div className="w-full max-w-4xl">
      <h3 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Боевой журнал
      </h3>
      <div className="relative h-[400px]">
        <div
          ref={logRef}
          className="absolute inset-0 overflow-y-auto space-y-3 bg-surface/30 backdrop-blur-sm rounded-2xl p-6 shadow-2xl scrollbar-none"
        >
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="Waiting"
                className="w-16 h-16 animate-bounce"
              />
              <div className="text-center text-lg text-text/50 italic">
                Битва еще не началась...
              </div>
            </div>
          ) : (
            logs.map((log, index) => {
              const isPlayerAction = log.startsWith("ХОД ИГРОКА");
              const isDamage = log.toLowerCase().includes("наносит");
              const isSurrender = log.toLowerCase().includes("сдался");
              const isEffective = log
                .toLowerCase()
                .includes("супер эффективно");
              const isNotEffective = log
                .toLowerCase()
                .includes("не очень эффективно");

              return (
                <div
                  key={index}
                  className={`
                    text-base py-3 px-4 rounded-xl transition-all duration-300
                    ${index === logs.length - 1 ? "animate-fadeIn" : ""}
                    ${isPlayerAction ? "bg-primary/5 hover:bg-primary/10" : ""}
                    ${
                      !isPlayerAction
                        ? "bg-secondary/5 hover:bg-secondary/10"
                        : ""
                    }
                    ${
                      isSurrender
                        ? "bg-red-500/5 hover:bg-red-500/10 text-red-500"
                        : ""
                    }
                    hover:scale-[1.01] transition-transform cursor-default
                    shadow-lg hover:shadow-xl
                  `}
                >
                  <div className="flex items-center gap-2">
                    {isPlayerAction ? (
                      <span className="text-primary text-sm uppercase font-bold tracking-wider">
                        ХОД ИГРОКА
                      </span>
                    ) : (
                      <span className="text-secondary text-sm uppercase font-bold tracking-wider">
                        ХОД ИИ
                      </span>
                    )}
                  </div>
                  <div className="mt-2 leading-relaxed">
                    {log
                      .split("\n")[1]
                      .split("!")
                      .map((part, i) => {
                        const isEffectiveness = part.includes("эффективно");
                        const isDamageText = part.includes("Наносит");
                        const isCalculation = part.includes("Базовый урон");
                        return (
                          <span
                            key={i}
                            className={`
                            ${
                              isEffectiveness && part.includes("Супер")
                                ? "text-green-500 font-semibold"
                                : ""
                            }
                            ${
                              isEffectiveness && part.includes("Не очень")
                                ? "text-yellow-500 font-semibold"
                                : ""
                            }
                            ${isDamageText ? "font-bold" : ""}
                            ${isCalculation ? "text-sm opacity-75" : ""}
                          `}
                          >
                            {part}
                            {i < log.split("\n")[1].split("!").length - 1
                              ? "!"
                              : ""}
                          </span>
                        );
                      })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
