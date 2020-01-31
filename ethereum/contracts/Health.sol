pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;
 
contract PatientFactory 
{
    string[] public deployedIds;
    address[] public deployedPatientsAddress;
 
    function createPatient(string id) public {
            Patient newPatient = new Patient(msg.sender);
 
            deployedPatientsAddress.push(newPatient);
            deployedIds.push(id);
    }
 
    function getDeployedPatientsAddress() public view returns (address[]) {
        return deployedPatientsAddress;
    }
 
    function getDeployedIds() public view returns (string[]) {
        return deployedIds;
    }
}
 
contract Patient {
 
    struct PatientHistory {
        string comment;
        string tme;
        string doctor;
        string hospital;
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
 
    function createPatientHistory(string comment,string tme,string doctor,string hospital) public {
         PatientHistory memory newPatientHistory = PatientHistory({
            comment: comment,
            tme: tme,
            doctor: doctor,
            hospital: hospital
         });       
         history.push(newPatientHistory);
    }
 
    function getPatientHistoryCount() public view returns(uint) {
        return history.length;
    }
 
}