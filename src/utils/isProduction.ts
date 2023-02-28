const isProduction = import.meta.env.MODE === 'web2-prod' || import.meta.env.MODE === 'web3-prod';
export const NetId = isProduction ? 1029 : 1;
export default isProduction;