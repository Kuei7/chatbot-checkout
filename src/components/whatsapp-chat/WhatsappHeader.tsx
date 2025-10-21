
'use client';

import type { FC } from 'react';
import Image from 'next/image';

interface WhatsappHeaderProps {
  status: string;
}

const WhatsappHeader: FC<WhatsappHeaderProps> = ({ status }) => {
  return (
    <header className="user-bar">
      <div className="back">
        <i className="zmdi zmdi-arrow-left"></i>
      </div>
      <div className="avatar">
        <Image src="https://s3.typebot.io/public/workspaces/cm8gbxl5b000ba3ncy4y16grd/typebots/cmh096k1s0001k404bj3cxex3/blocks/fmyy7qeuts05fb5e4ib5ti92?v=1761032795978" alt="Avatar" width={40} height={40} data-ai-hint="woman portrait"/>
      </div>
      <div className="name-status">
        <div className="name">
          <span>Chapeu Preto</span>
          <svg viewBox="0 0 18 18" height="18" width="18" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enableBackground="new 0 0 18 18">
            <polygon fill="#00DA60" points="9,16 7.1,16.9 5.8,15.2 3.7,15.1 3.4,13 1.5,12 2.2,9.9 1.1,8.2 2.6,6.7 2.4,4.6 4.5,4 5.3,2 7.4,2.4 9,1.1 10.7,2.4 12.7,2 13.6,4 15.6,4.6 15.5,6.7 17,8.2 15.9,9.9 16.5,12 14.7,13 14.3,15.1 12.2,15.2 10.9,16.9 "></polygon>
            <polygon fill="#FFFFFF" points="13.1,7.3 12.2,6.5 8.1,10.6 5.9,8.5 5,9.4 8,12.4 "></polygon>
          </svg>
        </div>
        <span className="status">{status}</span>
      </div>
      <div className="actions">
        <i className="zmdi zmdi-videocam"></i>
        <i className="zmdi zmdi-phone"></i>
        <i className="zmdi zmdi-more-vert"></i>
      </div>
    </header>
  );
};

export default WhatsappHeader;
