import type { AttributeKey } from "../types/character";

export type DwBasicMove = {
  id: string;
  name: string;
  attribute?: AttributeKey;
  trigger: string;
  hit: string;
  partial: string;
  miss: string;
};

export const basicMoves: DwBasicMove[] = [
  {
    id: "atacar-corpo-a-corpo",
    name: "Atacar Corpo a Corpo",
    attribute: "forca",
    trigger:
      "Quando atacar um inimigo em combate corpo a corpo, role +FOR.",
    hit:
      "Com 10+, cause seu dano ao inimigo e evite o ataque dele. Voce pode causar +1d6 de dano se aceitar se expor ao contra-ataque.",
    partial:
      "Com 7-9, cause seu dano, mas o inimigo tambem faz um ataque contra voce.",
    miss:
      "Com 6-, marque XP: voce erra, fica exposto ou entrega uma abertura perigosa para o inimigo.",
  },
  {
    id: "disparar",
    name: "Disparar",
    attribute: "destreza",
    trigger:
      "Quando mirar e atacar um inimigo a distancia, role +DES.",
    hit:
      "Com 10+, voce acerta e causa seu dano.",
    partial:
      "Com 7-9, escolha: gastar municao, causar dano reduzido ou se expor ao perigo para conseguir o disparo.",
    miss:
      "Com 6-, marque XP: o tiro falha, revela sua posicao, gasta recursos ou poe alguem em risco.",
  },
  {
    id: "desafiar-perigo",
    name: "Desafiar Perigo",
    trigger:
      "Quando agir apesar de uma ameaca iminente ou sofrer uma calamidade, diga como lida com isso e role com o atributo apropriado.",
    hit:
      "Com 10+, voce faz o que queria e o perigo nao se concretiza.",
    partial:
      "Com 7-9, voce tropeca, hesita ou vacila: o MJ oferece um resultado pior, barganha dificil ou escolha complicada.",
    miss:
      "Com 6-, marque XP: o perigo se concretiza ou o MJ mostra uma consequencia forte da sua tentativa.",
  },
  {
    id: "defender",
    name: "Defender",
    attribute: "constituicao",
    trigger:
      "Quando defender uma pessoa, item ou local sob ataque, role +CON.",
    hit:
      "Com 10+, ganhe dominio 3 para gastar protegendo, redirecionando ataques, reduzindo dano ou abrindo vantagem.",
    partial:
      "Com 7-9, ganhe dominio 1.",
    miss:
      "Com 6-, marque XP: sua defesa abre uma brecha, o alvo fica vulneravel ou o ataque muda de direcao.",
  },
  {
    id: "discernir-realidades",
    name: "Discernir Realidades",
    attribute: "sabedoria",
    trigger:
      "Quando estudar uma situacao ou pessoa com atencao, role +SAB.",
    hit:
      "Com 10+, faca tres perguntas da lista e receba +1 adiante ao agir nas respostas.",
    partial:
      "Com 7-9, faca uma pergunta.",
    miss:
      "Com 6-, marque XP: o MJ revela algo perigoso, incompleto ou tarde demais para evitar o problema.",
  },
  {
    id: "falar-dificil",
    name: "Falar Dificil",
    attribute: "inteligencia",
    trigger:
      "Quando consultar seu conhecimento acumulado sobre algo, role +INT.",
    hit:
      "Com 10+, o MJ dira algo interessante e util sobre o assunto.",
    partial:
      "Com 7-9, o MJ dira apenas algo interessante; cabe a voce torna-lo util.",
    miss:
      "Com 6-, marque XP: voce lembra algo equivocado, incompleto ou que atrai uma nova complicacao.",
  },
  {
    id: "negociar",
    name: "Negociar",
    attribute: "carisma",
    trigger:
      "Quando tiver vantagem sobre um PNJ e tentar manipula-lo, role +CAR.",
    hit:
      "Com 10+, ele faz o que voce pede se prometer algo primeiro.",
    partial:
      "Com 7-9, ele precisa de uma garantia concreta agora.",
    miss:
      "Com 6-, marque XP: a pessoa exige demais, se ofende, revela sua intencao ou vira a situacao contra voce.",
  },
  {
    id: "ajudar-interferir",
    name: "Ajudar ou Interferir",
    trigger:
      "Quando ajudar ou atrapalhar alguem com quem tem vinculo, role +vinculo.",
    hit:
      "Com 10+, conceda +1 ou -2 na rolagem da pessoa.",
    partial:
      "Com 7-9, o modificador se aplica, mas voce tambem se expoe ao perigo, custo ou retribuicao.",
    miss:
      "Com 6-, marque XP: sua ajuda atrapalha, sua interferencia sai cara ou o vinculo vira pressao na cena.",
  },
];
