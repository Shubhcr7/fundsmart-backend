pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint goal,uint minimum,string name,string about,string idea,string prod_desc,string proj_type, string fl) public {
        uint gl=goal*1000000000000000000;
        uint mf=minimum*1000000000000000000;
        address newCampaign = new Campaign(gl,mf,name,about,idea,prod_desc,proj_type,fl,msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    uint public goalc;
    mapping(address => bool) public approvers;
    uint public approversCount;
    string public namec;
    string public fl;
    string public aboutc;
    string public ideac;
    string public prod_descc;
    string public proj_typec;
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint goal,uint minimum,string name,string about,string idea,string prod_desc,string proj_type,string flc,address creator) public {
        manager = creator;
        goalc=goal;
        fl=flc;
        minimumContribution = minimum;
        ideac=idea;
        aboutc=about;
        prod_descc=prod_desc;
        proj_typec=proj_type;
        namec=name;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function checkApprover() public view returns(uint){
        if(approvers[msg.sender]){
            return 1;
        }
        else{
            return 0;
        }
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount >= (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
      uint, uint, uint, uint, address
      ) {
        return (
          minimumContribution,
          this.balance,
          requests.length,
          approversCount,
          manager
        );
    }
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}