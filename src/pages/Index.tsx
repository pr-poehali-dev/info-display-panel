import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Route {
  id: number;
  number: string;
  type: "bus" | "tram" | "trolley";
  direction: string;
  minutes: number;
  status: "arriving" | "ontime" | "delayed" | "here";
  delayMin?: number;
  lowFloor: boolean;
  cardPay: boolean;
}

const INITIAL_ROUTES: Route[] = [
  { id: 1, number: "15", type: "bus", direction: "Автовокзал", minutes: 2, status: "arriving", lowFloor: true, cardPay: true },
  { id: 2, number: "22", type: "tram", direction: "Парк культуры", minutes: 5, status: "ontime", lowFloor: false, cardPay: true },
  { id: 3, number: "37", type: "bus", direction: "Больница №2", minutes: 8, status: "delayed", delayMin: 3, lowFloor: true, cardPay: false },
  { id: 4, number: "5Т", type: "trolley", direction: "Рынок Центральный", minutes: 11, status: "ontime", lowFloor: false, cardPay: true },
  { id: 5, number: "102", type: "bus", direction: "Аэропорт", minutes: 17, status: "ontime", lowFloor: true, cardPay: true },
];

const TYPE_LABEL: Record<string, string> = {
  bus: "Авт",
  tram: "Трм",
  trolley: "Трл",
};

const TYPE_COLOR: Record<string, string> = {
  bus: "#4fc3f7",
  tram: "#ce93d8",
  trolley: "#80cbc4",
};

function StatusBadge({ route }: { route: Route }) {
  if (route.status === "here") {
    return (
      <span style={{ color: "var(--accent-green)", fontFamily: "'Oswald', sans-serif" }}
        className="text-base font-semibold tracking-wider">
        НА ОСТАНОВКЕ
      </span>
    );
  }
  if (route.status === "delayed") {
    return (
      <span style={{ color: "var(--accent-orange)" }}
        className="text-xs font-medium">
        Задержка {route.delayMin} мин
      </span>
    );
  }
  if (route.status === "arriving") {
    return (
      <span style={{ color: "var(--accent-yellow)", fontFamily: "'IBM Plex Sans', sans-serif" }}
        className="text-xs font-medium animate-pulse-glow">
        Через 2 остановки
      </span>
    );
  }
  return (
    <span style={{ color: "var(--accent-green)" }}
      className="text-xs font-medium">
      По расписанию
    </span>
  );
}

function MiniBusMap() {
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden"
      style={{ background: "linear-gradient(145deg, #0d2444 0%, #0a1e3a 100%)", border: "1px solid var(--board-border)" }}>
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#3a6ea8" strokeWidth="3" />
        <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#2a4e78" strokeWidth="1.5" />
        <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#2a4e78" strokeWidth="1.5" />
        <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#2a4e78" strokeWidth="1.5" />
        <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#3a6ea8" strokeWidth="3" />
        <line x1="65%" y1="0" x2="65%" y2="100%" stroke="#2a4e78" strokeWidth="1.5" />
        <line x1="15%" y1="0" x2="15%" y2="100%" stroke="#2a4e78" strokeWidth="1.5" />
        <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#2a4e78" strokeWidth="1.5" />
      </svg>

      <div className="absolute opacity-20"
        style={{ top: "22%", left: "32%", width: "31%", height: "11%", background: "#1e3d6e", borderRadius: 3 }} />
      <div className="absolute opacity-20"
        style={{ top: "22%", left: "66%", width: "12%", height: "11%", background: "#1e3d6e", borderRadius: 3 }} />
      <div className="absolute opacity-20"
        style={{ top: "67%", left: "32%", width: "31%", height: "11%", background: "#1e3d6e", borderRadius: 3 }} />
      <div className="absolute opacity-20"
        style={{ top: "37%", left: "16%", width: "12%", height: "26%", background: "#1e3d6e", borderRadius: 3 }} />

      <div className="absolute flex flex-col items-center"
        style={{ top: "30%", left: "25%", transform: "translate(-50%, -50%)" }}>
        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
          style={{ background: "var(--accent-yellow)", borderColor: "#fff", boxShadow: "0 0 12px var(--accent-yellow)" }} />
        <div className="w-0.5 h-4" style={{ background: "var(--accent-yellow)" }} />
      </div>

      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,56 Q109,56 109,32 T200,32" stroke="#4fc3f7" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M109,0 L109,56 L200,56" stroke="#ce93d8" strokeWidth="2" fill="none" opacity="0.6" />
      </svg>

      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-xs font-medium px-2 py-0.5 rounded"
          style={{ background: "rgba(255,208,0,0.15)", color: "var(--accent-yellow)", fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: "0.05em" }}>
          ВЫ ЗДЕСЬ
        </span>
      </div>

      <div className="absolute top-2 right-2">
        <span className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          р-н Центральный
        </span>
      </div>
    </div>
  );
}

export default function Index() {
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tick > 0 && tick % 15 === 0) {
      setRoutes(prev =>
        prev.map(r => ({
          ...r,
          minutes: Math.max(0, r.minutes - 1),
          status: r.minutes <= 1 ? "here" : r.minutes <= 3 ? "arriving" : r.status,
        }))
      );
    }
  }, [tick]);

  const timeStr = currentTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  const secStr = currentTime.getSeconds().toString().padStart(2, "0");
  const dateStr = currentTime.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(160deg, #060e1e 0%, #0a1628 60%, #0d1f3c 100%)" }}>

      <div className="relative w-full max-w-md scan-overlay rounded-2xl overflow-hidden"
        style={{
          background: "var(--board-bg)",
          border: "1px solid var(--board-border)",
          boxShadow: "0 0 60px rgba(10,30,80,0.8), 0 0 120px rgba(0,20,60,0.5), inset 0 0 60px rgba(0,10,30,0.3)",
        }}>

        {/* Верхняя полоска */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, var(--accent-yellow) 0%, #ffaa00 50%, var(--accent-green) 100%)" }} />

        {/* ШАПКА */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--board-border)" }}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent-yellow)" }}>
              <Icon name="Bus" size={20} style={{ color: "var(--board-bg)" }} />
            </div>
            <div>
              <div className="text-xs font-medium leading-none" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                ГОРПАССТРАНС
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)", opacity: 0.6 }}>г. Новоград</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Icon name="Wifi" size={14} style={{ color: "var(--accent-green)" }} />
              <span className="text-xs" style={{ color: "var(--accent-green)", fontFamily: "'IBM Plex Sans', sans-serif" }}>Free Wi-Fi</span>
            </div>
            <div className="w-9 h-9 rounded-md flex items-center justify-center"
              style={{ background: "var(--board-surface-2)", border: "1px solid var(--board-border)" }}>
              <Icon name="QrCode" size={20} style={{ color: "var(--text-primary)" }} />
            </div>
          </div>
        </div>

        {/* НАЗВАНИЕ ОСТАНОВКИ */}
        <div className="px-5 py-4">
          <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
            Остановка
          </div>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", color: "var(--text-primary)", fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.1, letterSpacing: "0.02em" }}>
            ул. Центральная
          </h1>
          <div style={{ fontFamily: "'Oswald', sans-serif", color: "var(--accent-yellow)", fontSize: "1.05rem", fontWeight: 500, letterSpacing: "0.04em" }}>
            д. 15 · Площадь Победы
          </div>
        </div>

        {/* ЧАСЫ */}
        <div className="px-5 pb-3 flex items-end justify-between">
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "0.05em" }}
              className="flex items-end gap-1">
              <span style={{ fontSize: "2.8rem" }}>{timeStr}</span>
              <span className="dot-blink mb-1" style={{ color: "var(--accent-yellow)", fontSize: "1.8rem" }}>:</span>
              <span style={{ fontSize: "1.8rem", color: "var(--text-secondary)" }}>{secStr}</span>
            </div>
            <div className="text-xs mt-1 capitalize" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
              {dateStr}
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "var(--board-surface-2)", border: "1px solid var(--board-border)" }}>
            <Icon name="Cloud" size={22} style={{ color: "#90caf9" }} />
            <div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>
                +18°
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Облачно</div>
            </div>
          </div>
        </div>

        <div className="mx-5 h-px" style={{ background: "var(--board-border)" }} />

        {/* ТАБЛИЦА МАРШРУТОВ */}
        <div className="px-5 pt-3 pb-2">
          <div className="grid mb-2" style={{ gridTemplateColumns: "56px 1fr 72px" }}>
            <div className="text-xs tracking-widest" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>№</div>
            <div className="text-xs tracking-widest" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>НАПРАВЛЕНИЕ</div>
            <div className="text-xs tracking-widest text-right" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>МИН</div>
          </div>

          <div className="flex flex-col gap-1.5">
            {routes.map((route, i) => {
              const isNearest = i === 0;
              return (
                <div
                  key={route.id}
                  className="grid rounded-xl px-3 py-2.5"
                  style={{
                    gridTemplateColumns: "56px 1fr 72px",
                    background: isNearest ? "rgba(255, 208, 0, 0.08)" : "var(--board-surface)",
                    border: `1px solid ${isNearest ? "rgba(255,208,0,0.3)" : "var(--board-border)"}`,
                    borderLeft: `3px solid ${isNearest ? "var(--accent-yellow)" : "transparent"}`,
                    animation: isNearest
                      ? `slide-up 0.4s ease-out ${0.25 + i * 0.07}s forwards, row-highlight 1.4s ease-in-out ${0.25 + i * 0.07}s infinite`
                      : `slide-up 0.4s ease-out ${0.25 + i * 0.07}s forwards`,
                    opacity: 0,
                  }}>

                  <div className="flex flex-col justify-center">
                    <div style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: isNearest ? "var(--accent-yellow)" : "var(--text-primary)",
                      lineHeight: 1,
                    }}>
                      {route.number}
                    </div>
                    <div className="text-xs" style={{ color: TYPE_COLOR[route.type], fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      {TYPE_LABEL[route.type]}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-0.5 pr-2">
                    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "0.9rem", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.2 }}>
                      {route.direction}
                    </div>
                    <StatusBadge route={route} />
                  </div>

                  <div className="flex flex-col items-end justify-center">
                    {route.status !== "here" ? (
                      <>
                        <div style={{
                          fontFamily: "'Oswald', sans-serif",
                          fontSize: "2rem",
                          fontWeight: 700,
                          lineHeight: 1,
                          color: isNearest ? "var(--accent-yellow)" : route.status === "delayed" ? "var(--accent-orange)" : "var(--text-primary)",
                          animation: isNearest ? "pulse-glow 1.4s ease-in-out infinite" : "none",
                        }}>
                          {route.minutes}
                        </div>
                        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>мин</div>
                      </>
                    ) : (
                      <Icon name="MapPin" size={24} style={{ color: "var(--accent-green)" }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ИКОНКИ УСЛУГ */}
        <div className="px-5 pt-2 pb-3">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "var(--board-surface)", border: "1px solid var(--board-border)" }}>
              <Icon name="Accessibility" size={18} style={{ color: "var(--accent-green)" }} />
              <div>
                <div className="text-xs font-medium" style={{ color: "var(--text-primary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>МГН</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.65rem" }}>Низкий пол</div>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "var(--board-surface)", border: "1px solid var(--board-border)" }}>
              <Icon name="CreditCard" size={18} style={{ color: "#90caf9" }} />
              <div>
                <div className="text-xs font-medium" style={{ color: "var(--text-primary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>Оплата</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.65rem" }}>Карта / Приложение</div>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "var(--board-surface)", border: "1px solid var(--board-border)" }}>
              <Icon name="Umbrella" size={18} style={{ color: "#90caf9" }} />
              <div>
                <div className="text-xs font-medium" style={{ color: "var(--text-primary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>Зонты</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.65rem" }}>В салоне</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-5 h-px" style={{ background: "var(--board-border)" }} />

        {/* КАРТА */}
        <div className="px-5 pt-3 pb-3">
          <div className="text-xs tracking-widest mb-2 uppercase" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
            Расположение на карте
          </div>
          <div style={{ height: "130px" }}>
            <MiniBusMap />
          </div>
        </div>

        {/* НИЖНЯЯ ПАНЕЛЬ */}
        <div className="mx-5 mb-4 rounded-xl px-4 py-3"
          style={{ background: "var(--board-surface)", border: "1px solid var(--board-border)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full dot-blink" style={{ background: "var(--accent-green)" }} />
                <span className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>Работает 24/7</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="Camera" size={12} style={{ color: "var(--text-secondary)" }} />
                <span className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>Видеонаблюдение</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="Lightbulb" size={12} style={{ color: "var(--accent-yellow)", opacity: 0.8 }} />
              <span className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>Освещение</span>
            </div>
          </div>
          <div className="mt-2 pt-2 flex items-center justify-between" style={{ borderTop: "1px solid var(--board-border)" }}>
            <div className="flex items-center gap-1.5">
              <Icon name="Phone" size={12} style={{ color: "var(--text-secondary)" }} />
              <span className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>8-800-555-35-35</span>
            </div>
            <span className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
              transport.novograd.ru
            </span>
          </div>
        </div>

        {/* Нижняя полоска */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, var(--accent-green) 0%, #00bcd4 50%, var(--accent-yellow) 100%)" }} />
      </div>
    </div>
  );
}
