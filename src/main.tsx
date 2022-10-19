import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import Router from './router';
import isMobile from '@utils/isMobie';
import { ModalPopup } from '@components/showPopup/Modal';
import 'uno.css';
import 'reseter.css/css/reseter.css';
import 'custom-react-scrollbar/dist/style.css';
import './index.css';


if (isMobile()) {
  document.styleSheets[0].insertRule('.scrollbar__thumbPlaceholder--vertical { display:none; }', 0);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <RecoilRoot>
      <RecoilNexus />
      <ModalPopup.Provider />
      <Router />
    </RecoilRoot>
);
