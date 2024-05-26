import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Skeleton, Spinner } from "@nextui-org/react";
import { calcularPorcentagemCripto } from "@/functions/calcular-porcentagem-cripto";
import { toast } from "react-toastify";

export default function PageCoin() {
  const { theme } = useTheme();
  const params = useParams<{ symbol: string }>()
  const priceOpenComponent: any = useRef(0);
  const chartContainerRef: any = useRef(null);
  const [chart, setChart]: any = useState(null);
  const [coin, setCoin]: any = useState({});
  const [price, setPrice]: any = useState("");
  const [percental, setPercental]: any = useState("");
  const [carregando, setCarregando] = useState(true);
  const chartOptions = {
    width: 1500,
    height: 350,
    autoSize: true,
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    }
  }

  function timeToTz(originalTime: any, timeZone: any) {
    const d = new Date(new Date(originalTime).toLocaleString('en-US', { timeZone }));
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) / 1000;
  }

  useEffect(() => {
    if (chart !== null) {
      if (theme === "light") {
        chart.applyOptions({
          ...chartOptions,
          layout: {
            textColor: 'black',
            background: { type: 'solid', color: 'white' }
          }
        })
      }

      if (theme === "dark") {
        chart.applyOptions({
          ...chartOptions,
          layout: {
            textColor: 'white',
            background: { type: 'solid', color: 'black' }
          }
        })
      }
    }
  }, [theme, chart]);

  useEffect(() => {
    (async () => {
      const symbol = String(params?.symbol).replace("_", "");
      let candlestickSeries: any = null;
      if (symbol !== "undefined") {
        try {
          const coinInfo = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol.toUpperCase()}&limit=1`)
          const coinInfoJson = (await coinInfo.json())[0];
          priceOpenComponent.current = coinInfoJson?.price;
          setCoin(coinInfoJson);
        } catch (error) {
          priceOpenComponent.current = 0;
          toast.error(`Erro ao obter preço atual e percental da criptomoeda`, { theme: "colored" });
        }



        try {
          const historyStart = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1m&limit=50`)
          const historyStartJson: Array<object> = await historyStart.json();
          const cdata: any = historyStartJson.map((d: any) => {
            return {
              time: timeToTz(d[0], 'America/Sao_Paulo'),
              open: parseFloat(d[1]),
              high: parseFloat(d[2]),
              low: parseFloat(d[3]),
              close: parseFloat(d[4]),
            };
          });

          const chart = createChart(chartContainerRef.current, chartOptions);
          setChart(chart);
          candlestickSeries = chart.addCandlestickSeries({ title: params?.symbol?.toLocaleUpperCase(), upColor: '#26a69a', downColor: '#ef5350', borderVisible: true, wickUpColor: '#26a69a', wickDownColor: '#ef5350' });
          candlestickSeries.setData(cdata);
          chart.timeScale().fitContent();
          setCarregando(false);
        } catch (error) {
          toast.error(`Erro ao obter historico e instanciar grafico da criptomoeda`, { theme: "colored" });
        }




        const wsChart = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLocaleLowerCase()}@kline_1m`);
        wsChart.onmessage = (event) => {
          const responseObject = JSON.parse(event.data);
          const { t, o, h, l, c } = responseObject.k;
          const kData: any = {
            time: timeToTz(t, 'America/Sao_Paulo'),
            open: parseFloat(o),
            high: parseFloat(h),
            low: parseFloat(l),
            close: parseFloat(c),
          };
          candlestickSeries.update(kData);
        }
        wsChart.onerror = (error) => {
          toast.error(`Erro ao obter grafico em tempo real da moeda ${symbol.toUpperCase()}`, { theme: "colored" });
        }




        const wsCoin = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLocaleLowerCase()}@trade`);
        wsCoin.onmessage = (event) => {
          const responseObject = JSON.parse(event.data);
          coin.price = responseObject.p;
          coin.percental = calcularPorcentagemCripto(priceOpenComponent.current, responseObject.p);
          setPrice(coin.price);
          setPercental(coin.percental);
          setCoin(coin);
        }
        wsCoin.onerror = (error) => {
          toast.error(`Erro ao obter preço e percental em tempo real da moeda ${symbol.toUpperCase()}`, { theme: "colored" });
        }
      }
    })()
  }, [params])

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-4 py-8 md:py-10">
        <div className="flex gap-2">
          <Skeleton isLoaded={!carregando} className="w-1/5 rounded-lg">
            <h1 className={title({ size: "sm", color: "blue" })}>{params?.symbol} {(carregando) && `...`}</h1>
          </Skeleton>

          <div className="flex flex-col text-small gap-1" style={{ width: "100%" }}>
            <Skeleton isLoaded={!carregando} className="w-2/5 rounded-lg">
              <b>${price || coin?.price}</b>
            </Skeleton>
            <Skeleton isLoaded={!carregando} className="w-1/5 rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: (percental || "0%") }} />
            </Skeleton>
          </div>
        </div>

        {
          (carregando === true) && (
            <Spinner label="Carregando..." color="default" size="lg" />
          )
        }
        <div ref={chartContainerRef} />
      </section>
    </DefaultLayout>
  );
}
