const isProduction = import.meta.env.MODE === 'web2-prod' || import.meta.env.MODE === 'web3-prod';

export default isProduction;