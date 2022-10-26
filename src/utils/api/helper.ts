/**
 * Serialize the parameters of the contract into the parameters of the API
 * @param commitmentHash the hash of commitment
 * @param params the params that post to contract
 * @returns
 */
export const generateCommitmentParams = (commitmentHash: string, params: Array<any>) => {
  return {
    commit_hash: commitmentHash,
    name: params[0],
    owner: params[1],
    duration: params[2],
    secret: params[3],
    resolver: params[4],
    data: params[5],
    reverse_record: params[6],
    fuses: params[7],
    wrapper_expiry: params[8],
  };
};

export const generateMakeOrderParams = (description: string,tradeProvider?: string, tradeType?: number, timeExpire?: number) => {
  return {
    trade_provider: tradeProvider || 'wechat',
    trade_type: tradeType || 1,
    description: description,
    time_expire: Math.floor((Date.now()+60 * 60 * 24*1000)/1000),//will be deleted at next version
    amount: 1,//will be deleted at next version
  };
};
