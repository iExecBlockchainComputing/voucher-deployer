
// appended for deployment on local fork
config.networks!['bellecour-fork'] = {
    hardfork: 'berlin',
    gasPrice: 0,
    blockGasLimit: 6_700_000,
    url: process.env.RPC_URL,
};