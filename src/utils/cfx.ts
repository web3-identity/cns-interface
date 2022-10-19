import { Conflux } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { default as Web3Domain } from '@web3identity/web3ns/dist/Web3';

export const publicResolverAddress = 'cfxtest:acecxexm0pg268m44jncw5bmagwwmun53jj9msmadj';
export const cfxClient = new Conflux({
  // url: "https://test.confluxrpc.com",
  networkId: 1,
});

export const web3domain = new Web3Domain({
  client: cfxClient,
  registryAddress: 'cfxtest:achg113s8916v2u756tvf6hdvmbsb73b16ykt1pvwm',
  reverseRegistrarAddress: 'cfxtest:ach1p03gkptxz07p4ecn66gjpd0xrnkkbj1n6p96d5',
  baseRegistrarAddress: 'cfxtest:acc1ttg7287cybsdy6bn0002nzepypn29yavjbj36g',
  web3ControllerAddress: 'cfxtest:acbrnwph2609zbf21np0501d87xb9dnvuakpv911xk',
  nameWrapperAddress: 'cfxtest:acdc4xzy0pg1dzrbajgmv8nw3cjyj6ezn2dzncc4w5',
  publicResolverAddress: publicResolverAddress,
});
