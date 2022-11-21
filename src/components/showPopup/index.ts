export * from './Drawer';
export * from './Modal';
import isMobile from '@utils/isMobie';
import { hideAllDawer } from './Drawer';
import { hideAllModal } from './Modal';

export const hideAll = () => {
  if (isMobile()) {
    hideAllDawer();
  } else {
    hideAllModal();
  }
};
