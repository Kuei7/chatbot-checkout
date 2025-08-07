
export type DisplayMessage = {
  id: string;
  sender: 'bot' | 'user';
  type: 'text' | 'image';
  content: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
};

export type ScriptItem = {
  type: 'bot' | 'userAction';
  delay: number;
  contentType?: 'text' | 'image';
  content?: string;
  buttons?: {
    text: string;
    action: 'next' | 'redirect';
    url?: string;
  }[];
};

export const conversationScript: ScriptItem[] = [
  { type: 'bot', contentType: 'text', content: 'Opa! tudo bem?', delay: 1000 },
  { type: 'bot', contentType: 'text', content: 'Se você esta aq é porque quer aprender a ganhar dinheiro estou certo?', delay: 1500 },
  { type: 'userAction', buttons: [{ text: 'SIM!', action: 'next' }], delay: 2000 },
  { type: 'bot', contentType: 'text', content: 'Boa!', delay: 1000 },
  { type: 'bot', contentType: 'text', content: 'Esse e o mercado mais fácil de ganhar dinheiro nos últimos tempos.', delay: 2000 },
  { type: 'bot', contentType: 'text', content: 'Olha so as pessoas que lucraram! 👀', delay: 4000 },
  { type: 'bot', contentType: 'image', content: 'https://s3.typebot.io/public/workspaces/cme0in7zf0022jo04wbcry6pa/typebots/vmq15sy6m7awugtgcsxl42dq/blocks/kpl9g7swn8djdqjdkekzyzio?v=1754525037643', delay: 3000 },
  { type: 'bot', contentType: 'image', content: 'https://s3.typebot.io/public/workspaces/cme0in7zf0022jo04wbcry6pa/typebots/vmq15sy6m7awugtgcsxl42dq/blocks/anu0bvj2od8ecns1bg72k70l?v=1754525040395', delay: 3000 },
  { type: 'bot', contentType: 'text', content: 'Eai, Quer aprender a como avaliar livros utilizando IA e as pessoas te pagarem por isso?', delay: 3000 },
  { type: 'userAction', buttons: [{ text: 'SIM!', action: 'next' }], delay: 1000 },
  { type: 'bot', contentType: 'text', content: 'Boa! olha so o quanto eu já ganhei esse mês:', delay: 1000 },
  { type: 'bot', contentType: 'image', content: 'https://s3.typebot.io/public/workspaces/cme0in7zf0022jo04wbcry6pa/typebots/vmq15sy6m7awugtgcsxl42dq/blocks/gjhqhj4btid6v6yruv93csdx?v=1754525162592', delay: 3000 },
  { type: 'bot', contentType: 'text', content: 'Quer aprender a usar a IA para avaliar livros e ganhar dinheiro com isso?', delay: 1000 },
  { type: 'userAction', buttons: [{ text: 'SIM!', action: 'next' }], delay: 0 },
  { type: 'bot', contentType: 'text', content: 'A maioria das pessoas cobram 500 Reais ou mais para ensinar isso, e eu acho isso muito errado, por isso quero te ajudar!', delay: 3000 },
  { type: 'bot', contentType: 'text', content: 'Mas vou liberar apenas 20 vagas, espero que você seja uma das pessoas que vai lucrar mais de 10 mil por mês.', delay: 3000 },
  { type: 'bot', contentType: 'text', content: 'Eu so te peço uma coisa! quando lucrar me mande um print mostrando os seus ganhos ok?', delay: 4000 },
  { type: 'userAction', buttons: [{ text: 'OK!', action: 'next' }], delay: 0 },
  { type: 'bot', contentType: 'text', content: 'Vou te passar o Link, espero que te ajude daqui para frente este conhecimento!', delay: 1000 },
  { type: 'userAction', buttons: [{ text: 'Quero o link!', action: 'redirect', url: 'https://go.pepperpay.com.br/0qvu6' }], delay: 1000 },
];
