pragma solidity ^0.4.17;
 
contract PatientFactory 
{
    uint256[] public deployedIds;
    address[] public deployedPatientsAddress;
 
    function createPatient(uint256 id) public {
            Patient newPatient = new Patient(msg.sender);
 
            deployedPatientsAddress.push(newPatient);
            deployedIds.push(id);
    }
 
    function getDeployedPatientsAddress() public view returns (address[]) {
        return deployedPatientsAddress;
    }
 
    function getDeployedIds() public view returns (uint256[]) {
        return deployedIds;
    }
}
 
contract Patient {
 
    struct PatientHistory {
        string comment;
        string tme;
    }
 
    address public manager;
    PatientHistory[] public history;
 
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
 
    function Patient(address creator) public {
        manager = creator;
    }
 
    function createPatientHistory(string comment,string tme) public {
         PatientHistory memory newPatientHistory = PatientHistory({
            comment: comment,
            tme: tme
         });       
         history.push(newPatientHistory);
    }
 
    function getPatientHistoryCount() public view returns(uint) {
        return history.length;
    }
 
}