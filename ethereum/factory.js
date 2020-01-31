import web3 from './web3'
import PatientFactory from './build/PatientFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(PatientFactory.interface),
    '0xC138CD8ca6e316407A485a7254994027fC1E0097'
    //'0x3C1d72943636c618Bf9A8c4bf1E880c51F5c9554'
    //'0x35bA2259cFD73ea857Ed88ee37521361EE2b540B'
);

export default instance;