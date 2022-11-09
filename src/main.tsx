import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import { completeDetect } from '@cfxjs/use-wallet-react/conflux';
import Router from './router';
import isMobile from '@utils/isMobie';
import { initializeRecoil } from '@utils/recoilUtils';
import { ModalPopup, DrawerPopup } from '@components/showPopup';
import 'uno.css';
import 'reseter.css/css/reseter.css';
import 'custom-react-scrollbar/dist/style.css';
import './index.css';

if (isMobile()) {
  document.styleSheets[0].insertRule('.scrollbar__thumbPlaceholder--vertical { display:none; }', 0);
}
completeDetect().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <RecoilRoot initializeState={initializeRecoil}>
      <RecoilNexus />
      <ModalPopup.Provider />
      <DrawerPopup.Provider />
      <Router />
    </RecoilRoot>
  );
});
