
const payMethod = import.meta.env.MODE.startsWith('web2') ? 'web2' : 'web3';

export default payMethod;
