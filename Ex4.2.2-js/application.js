const abi = [
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "cred",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "hashs",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "string",
				"name": "url",
				"type": "string"
			}
		],
		"name": "produireHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "dev",
				"type": "bytes32"
			}
		],
		"name": "remettre",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "destinataire",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "valeur",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

async function createMetaMaskDapp() {
  try {
    // Demande à MetaMask l'autorisation de se connecter
    const addresses = await ethereum.enable();
    const address = addresses[0];
    // Connection au noeud fourni par l'objet web3
    const provider = new ethers.providers.Web3Provider(ethereum);
    dapp = { address, provider };
    console.log(dapp);
    document.getElementsByClassName("needMetaMask")[0].className = "needMetaMask";
  } catch (err) {
    // Gestion des erreurs
    console.error(err);
  }
}

async function instantiateCredibilite() {
  if (typeof dapp === "undefined") { await createMetaMaskDapp(); }
  let contractAddress = document.getElementById("contractAddress").value;
  if (contractAddress.substr(0, 2) == "0x") { contractAddress = contractAddress.substr(2) }
  let re = /[0-9A-Fa-f]{40}/g;
  if (!re.test(contractAddress)) { console.error("Format de l'adresse du contrat invalide: " + contractAddress); return; }

  contratCredibilite = new ethers.Contract("0x" + contractAddress, abi, dapp.provider.getSigner());
  let maCredibilite = await contratCredibilite.cred(dapp.address);
  document.getElementById("devoirURL").parentElement.className = "";
}

async function remettreDevoir() {
  let url = document.getElementById("devoirURL").value;
  let urlHash = await contratCredibilite.produireHash(url);
  console.log("Condensat de l'url du devoir: " + urlHash);

  //dapp.provider
  let rank = await contratCredibilite.remettre(urlHash);
  console.log("Le devoir #" + rank + "a été remis")
}
