import { button as buttonStyles } from "@nextui-org/react";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Coin, Cryptobubbles } from "@/types/cryptobubbles";
import CardCripto from "@/components/card-cripto";
import { toast } from "react-toastify";

export default function PageIndex() {
  const [carregando, setCarregando] = useState(true);
  const [criptosFav, setCriptosFav]: any = useState([{}, {}, {}, {}]);

  useEffect(() => {
    (async () => {
      try {
        const criptomoedasFavoritas = ["BTC", "ETH", "SOL", "DOGE"]
        const criptomoedas = await fetch(`https://cors.anywhere.rubensflinco.com.br/https://cryptobubbles.net/backend/data/bubbles1000.usd.json`);
        const criptomoedasJson: Cryptobubbles = await criptomoedas.json();
        const criptosFavoritas: Cryptobubbles = criptomoedasJson.filter((cripto: any) => criptomoedasFavoritas.includes(cripto.symbol));
        setCriptosFav(criptosFavoritas);
        setCarregando(false);
      } catch (error) {
        toast.error(`Erro ao obter lista de criptomoedas, tente novamente mais tarde`, { theme: "colored" });
      }
    })()
  }, [])

  return (
    <DefaultLayout>

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <h1 className={title()}>Uma forma </h1>
          <h1 className={title({ color: "violet" })}>Simples </h1>
          <h1 className={title()}>e </h1>
          <h1 className={title({ color: "violet" })}>Bela </h1>
          <h1 className={title()}>de acompanhar suas </h1>
          <h1 className={title({color: "blue"})}>Criptomoedas </h1>
        </div>
      </section>


      <section className="flex  flex-col items-center gap-8 py-8 md:py-10">
        <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {criptosFav.map((cripto: Coin, index: number) => (
            <CardCripto key={index} carregando={carregando} cripto={cripto} />
          ))}
        </div>

        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/coins"
        >
          Ver todas moedas {`>>`}
        </Link>

      </section>
    </DefaultLayout>
  );
}
