export function calcularPorcentagemCripto(valor1:number, valor2:number):string {
  valor1 =  Number(Number(valor1).toFixed(8));
  valor2 =  Number(Number(valor2).toFixed(8));
  const diferenca = valor2 - valor1;
  const porcentagem = (diferenca / valor1) * 100;

  if(Number(porcentagem.toFixed(2)) > 0){
    return `<span style="color: green;">+${porcentagem.toFixed(2)}%</span>`;
  }else
  if(Number(porcentagem.toFixed(2)) < 0){
    return `<span style="color: red;">${porcentagem.toFixed(2)}%</span>`;
  }else{
    return `<span>${porcentagem.toFixed(2)}%</span>`;
  }
}
