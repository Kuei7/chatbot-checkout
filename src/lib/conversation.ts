
export type DisplayMessage = {
  id: string;
  sender: 'bot' | 'user';
  type: 'text' | 'image';
  content: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
};

type Button = {
    text: string;
    action: 'next' | 'redirect';
    url?: string;
    progressStep?: string;
};

export type ScriptItem = {
  type: 'bot' | 'userAction';
  delay: number;
  contentType?: 'text' | 'image';
  content?: string;
  buttons?: Button[];
};

export const conversationScript: ScriptItem[] = [
  { type: 'bot', contentType: 'text', content: 'Opa! tudo bem?', delay: 1000 },
  { type: 'bot', contentType: 'text', content: 'Se você esta aq é porque quer aprender a ganhar dinheiro estou certo?', delay: 1500 },
  { type: 'userAction', buttons: [{ text: 'SIM!', action: 'next', progressStep: 'group2' }], delay: 2000 },
  { type: 'bot', contentType: 'text', content: 'Boa!', delay: 1000 },
  { type: 'bot', contentType: 'text', content: 'Esse e o mercado mais fácil de ganhar dinheiro nos últimos tempos.', delay: 2000 },
  { type: 'bot', contentType: 'text', content: 'Olha so as pessoas que lucraram! 👀', delay: 4000 },
  { type: 'bot', contentType: 'image', content: 'https://s3.typebot.io/public/workspaces/cme0in7zf0022jo04wbcry6pa/typebots/vmq15sy6m7awugtgcsxl42dq/blocks/kpl9g7swn8djdqjdkekzyzio?v=1754525037643', delay: 3000 },
  { type: 'bot', contentType: 'image', content: 'https://s3.typebot.io/public/workspaces/cme0in7zf0022jo04wbcry6pa/typebots/vmq15sy6m7awugtgcsxl42dq/blocks/anu0bvj2od8ecns1bg72k70l?v=1754525040395', delay: 3000 },
  { type: 'bot', contentType: 'text', content: 'Eai, Quer aprender a ganhar mais de R$500 por dia apenas utilizando uma IA?', delay: 3000 },
  { type: 'userAction', buttons: [{ text: 'SIM!', action: 'next' }], delay: 1000 },
  { type: 'bot', contentType: 'text', content: 'Boa! olha so o quanto eu já ganhei esse mês:', delay: 1000 },
  { type: 'bot', contentType: 'image', content: 'https://s3.typebot.io/public/workspaces/cme0in7zf0022jo04wbcry6pa/typebots/vmq15sy6m7awugtgcsxl42dq/blocks/gjhqhj4btid6v6yruv93csdx?v=1754525162592', delay: 3000 },
  { type: 'bot', contentType: 'text', content: 'E aí, vamos garantir essa tranquilidade financeira pra passar o fim de ano com a conta cheia?', delay: 1000 },
  { type: 'userAction', buttons: [{ text: 'SIM!', action: 'next' }], delay: 0 },
  { type: 'bot', contentType: 'text', content: 'Sabe o que é foda? O fim de ano sempre batia a tristeza. Eu queria ir pra festa, queria ajudar minha mãe... mas a carteira vazia não deixava.', delay: 3000 },
  { type: 'bot', contentType: 'text', content: 'Só que isso mudou depois que descobri esse método da IA. E, justamente por ter passado por isso, <b>EU NÃO</b> vou cobrar <del>R$ 500</del> pra te mostrar esse segredo igual a muitos outros.', delay: 3000 },
  { type: 'bot', contentType: 'text', content: 'Mas tem um detalhe: vou liberar só 20 acessos! porque preciso dar atenção. Se for pra mudar de vida, tem que ser agora.', delay: 4000 },
  { type: 'userAction', buttons: [{ text: 'Quero aprender com você!', action: 'next', progressStep: 'group6' }], delay: 0 },
  { type: 'bot', contentType: 'text', content: 'Eu so te peço uma coisa, quando lucrar me mande print por favor ok?', delay: 1000 },
  { type: 'userAction', buttons: [{ text: 'Quero o link!', action: 'redirect', url: 'https://go.pepperpay.com.br/0qvu6', progressStep: 'group6_1' }], delay: 1000 },
];
