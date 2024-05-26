import { calcularPorcentagemCripto } from "@/functions/calcular-porcentagem-cripto";
import { Coin } from "@/types/cryptobubbles";
import { Card, CardBody, CardFooter, Image, CardHeader, Divider, Skeleton } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface PropsCardCripto {
  key: number,
  carregando: boolean,
  cripto: Coin
}

export default function CardCripto(props: PropsCardCripto) {
  const priceOpenComponent: any = useRef(0);
  const [percental, setPercental] = useState("");
  const [price, setPrice] = useState(null);

  useEffect(() => {
    (async () => {
      if (props?.cripto?.symbols?.binance) {
        const symbol = String(props.cripto.symbols.binance).replace("_", "");
        try {
          const coinInfo = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol.toUpperCase()}&limit=1`)
          const coinInfoJson = (await coinInfo.json())[0];
          priceOpenComponent.current = coinInfoJson?.price;
        } catch (error) {
          toast.error(`Erro obter preço atual da moeda ${symbol.toUpperCase()}`, { theme: "colored" });
          priceOpenComponent.current = 0;
        }

        const wsCoin = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLocaleLowerCase()}@trade`);
        wsCoin.onmessage = (event) => {
          const responseObject = JSON.parse(event.data);
          setPercental(calcularPorcentagemCripto(priceOpenComponent.current, responseObject.p));
          setPrice(responseObject.p);
        }
        wsCoin.onerror = (error) => {
          toast.error(`Erro ao obter preço e percental em tempo real da moeda ${symbol.toUpperCase()}`, { theme: "colored" });
        }
      }
    })()
  }, [props])

  return (
    <Link href={`/coin/${props?.cripto?.symbols?.binance?.toLocaleUpperCase()}`}>
      <Card shadow="sm" isHoverable={true} isDisabled={props?.carregando} style={{ minWidth: "200px" }}>
        <CardHeader className="flex gap-3">
          <Skeleton isLoaded={!props?.carregando} className="rounded-lg">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src={"https://cryptobubbles.net/backend/" + props?.cripto?.image}
              width={40}
            />
          </Skeleton>
          <div className="flex flex-col gap-2">
            <Skeleton isLoaded={!props?.carregando} className="w-5/5 rounded-lg">
              <p className="text-md">{props?.cripto?.name} ({props?.cripto?.symbol?.toLocaleUpperCase()})</p>
            </Skeleton>
            <Skeleton isLoaded={!props?.carregando} className="w-3/5 rounded-lg">
              <p className="text-small text-default-500 text-left">{props?.cripto?.symbols?.binance?.toLocaleUpperCase()} {(props?.carregando) ? "Carregando" : ""}</p>
            </Skeleton>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="overflow-visible p-0">
        </CardBody>
        <CardFooter className="text-small justify-between gap-2">
          <Skeleton isLoaded={!props?.carregando} className="w-4/5 rounded-lg">
            <b>${Number(price || priceOpenComponent?.current || props?.cripto?.price).toFixed(4)}</b>
          </Skeleton>
          <Skeleton isLoaded={!props?.carregando} className="w-2/5 rounded-lg">
            <p dangerouslySetInnerHTML={{ __html: (percental || "0%") }} />
          </Skeleton>
        </CardFooter>
      </Card>
    </Link>
  );
}
