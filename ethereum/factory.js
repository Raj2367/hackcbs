import web3 from './web3'
import PatientFactory from './build/PatientFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(PatientFactory.interface),
    '0x35bA2259cFD73ea857Ed88ee37521361EE2b540B'
);

export default instance;