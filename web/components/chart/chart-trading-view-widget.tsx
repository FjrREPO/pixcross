import React, { useEffect, useRef, memo } from "react";

function ChartTradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "autosize": true,
          "symbol": "COINBASE:ETHUSD",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "3",
          "locale": "en",
          "hide_top_toolbar": true,
          "allow_symbol_change": false,
          "hide_volume": true,
          "support_host": "https://www.tradingview.com"
        }`;
    if (container.current) {
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={container}
      className="tradingview-widget-container"
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      />
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow noreferrer"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(ChartTradingViewWidget);
