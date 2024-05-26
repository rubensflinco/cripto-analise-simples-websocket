import { Card, CardBody, CardFooter, Image, button as buttonStyles, CardHeader, Divider } from "@nextui-org/react";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { Coin, Cryptobubbles } from "@/types/cryptobubbles";
import CardCripto from "@/components/card-cripto";
import { toast } from "react-toastify";

export default function PageCoins() {
  const [carregando, setCarregando] = useState(true);
  const [criptosTodas, setCriptosTodas]: any = useState([]);
  const [criptosLimit, setCriptosLimit]: any = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);

  useEffect(() => {
    (async () => {
      try {
        const criptomoedas = await fetch(`https://cors.anywhere.rubensflinco.com.br/https://cryptobubbles.net/backend/data/bubbles1000.usd.json`);
        let criptomoedasJson: Cryptobubbles = await criptomoedas.json();
        criptomoedasJson = criptomoedasJson.filter((cripto: any) => (cripto.symbols.binance));
        setCriptosTodas(criptomoedasJson);
        setCriptosLimit(criptomoedasJson.slice(0, (criptosLimit.length + 24)));
        setCarregando(false);
      } catch (error) {
        toast.error(`Erro ao obter lista de criptomoedas, tente novamente mais tarde`, { theme: "colored" });
      }
    })()
  }, [])

  function onClickVerMais() {
    setCriptosLimit(criptosTodas.slice(0, (criptosLimit.length + 24)));
  }

  return (
    <DefaultLayout>

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <h1 className={title({ size: "sm", color: "blue" })}>Criptomoedas</h1>
        </div>
      </section>


      <section className="flex  flex-col items-center gap-8 py-8 md:py-10">
        <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {criptosLimit.map((cripto: Coin, index: number) => (
            <CardCripto key={index} carregando={carregando} cripto={cripto} />
          ))}
        </div>

        <button
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          onClick={onClickVerMais}
        >
          Exibir +10
        </button>

      </section>
    </DefaultLayout>
  );
}
