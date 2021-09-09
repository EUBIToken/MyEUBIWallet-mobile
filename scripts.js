var all = document.getElementsByTagName("*");
const web3 = new Web3("https://node1.mintme.com:443");
const loadedTokenContracts = [];
var loadedAccount = null;
const BigInt = web3.utils.BN;
const rawUnitsToken = new BigInt("1000000000000");
const MintMEReceiverPaidGasFees = new web3.eth.Contract(JSON.parse('[{"inputs": [{"internalType": "uint256","name": "random","type": "uint256"},{"internalType": "address","name": "token","type": "address"},{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "value","type": "uint256"},{"internalType": "uint256","name": "expiry","type": "uint256"},{"internalType": "uint8","name": "v","type": "uint8"},{"internalType": "bytes32","name": "r","type": "bytes32"},{"internalType": "bytes32","name": "s","type": "bytes32"}],"name": "sendPreauthorizedTransaction","outputs": [],"stateMutability": "nonpayable","type": "function"}]'), "0x1d81563e53a18136957ea28f441e06ac7b66de1b");
var walletAddressRAW = "0x0000000000000000000000000000000000000000";
var contractAddress = "0x8AFA1b7a8534D519CB04F4075D3189DF8a6738C1";
var privateKeyRAW = "";
var networkId = 24734;
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}
document.addEventListener('DOMContentLoaded', async function() {
	M.AutoInit();
	for (var i=0, max=all.length; i < max; i++) {
		var currentElement = all[i];
		var id = currentElement.id;
		if(id != ""){
			eval(id + " = currentElement;");
			if(id.endsWith("Modal")){
				currentElement = M.Modal.getInstance(currentElement);
				eval(id + "Instance = currentElement;");
			}
		}
	}
	all = undefined;
});
var allSavedWallets = [];
const escapeHtml = function(text) {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
};
var selectedTargetWallet = -1;
const ilierateAllWallets = async function(){
	listofwallets.innerHTML = "<h2>Which wallet do you want to load?</h2>";
	var length2 = allSavedWallets.length;
	for (var i = 0; i < length2; i++) {
		var walletwallet = allSavedWallets[i];
		if(walletwallet != "deleted wallet"){
			var stri = i.toString();
			listofwallets.insertAdjacentHTML("beforeEnd", "<p><label><h2 id=\"WalletPicker" + stri + "\" onclick=\"rescanWalletPickers(" + stri + ");\">" + escapeHtml(walletwallet.name) + "</h2></label></p>");
		}
	}
};
const rescanWalletPickers = async function(x){
	var length2 = allSavedWallets.length;
	selectedTargetWallet = -1;
	for (var i = 0; i < length2; i++) {
		var temptemp = document.getElementById("WalletPicker" + i.toString());
		if(temptemp != null){
			if(i == x){
				temptemp.style.backgroundColor = "blue";
				temptemp.style.color = "white";
				selectedTargetWallet = x;
			} else{
				temptemp.style.backgroundColor = "transparent";
				temptemp.style.color = "black";
			}
		}
	}
};
{
	var walletStorage = localStorage.getItem('savedeubiwallets');
	if(walletStorage != null){
		allSavedWallets = JSON.parse(walletStorage);
	}
	walletStorage = localStorage.getItem('savedeubiwallet');
	if(walletStorage != null){
		walletStorage = "{\"name\": \"Auto-migrated quick wallet access\"," + walletStorage.substring(1);
		allSavedWallets[allSavedWallets.length] = JSON.parse(walletStorage);
	}
	ilierateAllWallets();
}
const flushWalletStorage = async function(){
	localStorage.setItem("savedeubiwallets", JSON.stringify(allSavedWallets));
	localStorage.removeItem('savedeubiwallet');
	ilierateAllWallets();
};
const loadTokenContractIMPL = function(address){
	return new web3.eth.Contract(JSON.parse('[{"constant": false,"inputs": [{"name": "spender","type": "address"},{"name": "value","type": "uint256"}],"name": "approve","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "from","type": "address"},{"name": "to","type": "address"},{"name": "value","type": "uint256"}],"name": "transferFrom","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "owner","type": "address"}],"name": "stakingBalance","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "withdrawDividend","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "who","type": "address"}],"name": "balanceOf","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "owner","type": "address"}],"name": "dividendOf","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "to","type": "address"},{"name": "value","type": "uint256"}],"name": "transfer","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "amount","type": "uint256"}],"name": "withdrawStakedToken","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "owner","type": "address"},{"name": "spender","type": "address"}],"name": "allowance","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"}]'), address);
};
const createWallet = async function(){
	loadedAccount = web3.eth.accounts.create();
	walletMessage.innerHTML = "Your wallet was successfully created, thank you for using MyEUBIWallet!";
	MultipurpuseModalInstance.open();
	walletAddressRAW = loadedAccount.address;
	privateKeyRAW = loadedAccount.privateKey;
	beforeWalletLoad.style.display = "none";
	afterWalletLoad.style.display = "block";
	reloadWallet();
};
const loadTokenContract = function(address){
	loadingTokenContract = loadedTokenContracts[address];
	if(loadingTokenContract == undefined){
		loadingTokenContract = loadTokenContractIMPL(address);
		loadedTokenContracts[address] = loadingTokenContract;
	}
	return loadingTokenContract;
}
const refreshTokenBalance = async function(tokenAddress, tokenBalanceElement, walletAddress, tokenName, decimals){
	loadTokenContract(tokenAddress).methods.balanceOf(walletAddress).call().then(function(value){
		var vl = value.length;
		if(vl > decimals){
			vl -= decimals;
			value = value.substring(0, vl) + "." + value.substring(vl).padEnd(decimals, "0");
		} else{
			value = "0." + value.padStart(decimals, "0");
		}
		tokenBalanceElement.innerHTML = value + " " + tokenName;
	}, function(error){
		tokenBalanceElement.innerHTML = "ERROR: Can't load " + tokenName + " balance";
	});
};
const reloadWallet = async function(){
	eubiBalance.innerHTML='Identifying blockchain...';
	nativeBalance.innerHTML='';
	networkId = await web3.eth.getChainId();
	switch(networkId){
		case 24734:
			SendNativeMessage2.innerHTML = "Are you sure you want to send MintME?";
			SendEubiMessage2.innerHTML = "Are you sure you want to send EUBI?";
			eubiBalance.innerHTML='Loading EUBI balance...';
			nativeBalance.innerHTML='Loading MintME balance...';
			contractAddress = "0x8AFA1b7a8534D519CB04F4075D3189DF8a6738C1";
			refreshTokenBalance("0x8AFA1b7a8534D519CB04F4075D3189DF8a6738C1", eubiBalance, walletAddressRAW, "EUBI", 12);
			web3.eth.getBalance(walletAddressRAW).then(function(value){
				var vl = value.length;
				if(vl > 18){
					vl -= 18;
					value = value.substring(0, vl) + "." + value.substring(vl).padEnd(18, "0");
				} else{
					value = "0." + value.padStart(18, "0");
				}
				nativeBalance.innerHTML = value + " MintME";
			}, function(error){
				nativeBalance.innerHTML = "ERROR: Can't load MintME balance!";
			});
			break;
		case 56:
			SendNativeMessage2.innerHTML = "Are you sure you want to send BNB?";
			SendEubiMessage2.innerHTML = "Are you sure you want to send bEUBI?";
			eubiBalance.innerHTML='Loading bEUBI balance...';
			nativeBalance.innerHTML='Loading BNB balance...';
			contractAddress = "0x27fAAa5bD713DCd4258D5C49258FBef45314ae5D";
			refreshTokenBalance("0x27fAAa5bD713DCd4258D5C49258FBef45314ae5D", eubiBalance, walletAddressRAW, "bEUBI", 18);
			web3.eth.getBalance(walletAddressRAW).then(function(value){
				var vl = value.length;
				if(vl > 18){
					vl -= 18;
					value = value.substring(0, vl) + "." + value.substring(vl).padEnd(18, "0");
				} else{
					value = "0." + value.padStart(18, "0");
				}
				nativeBalance.innerHTML = value + " BNB";
			}, function(error){
				nativeBalance.innerHTML = "ERROR: Can't load BNB balance!";
			});
			break;
		case 3:
			SendNativeMessage2.innerHTML = "Are you sure you want to send Ethereum?";
			SendEubiMessage2.innerHTML = "Are you sure you want to send EUBI?";
			eubiBalance.innerHTML='Loading EUBIng balance...';
			pendingDividends.innerHTML = "Loading pending dividends...";
			nativeBalance.innerHTML='Loading Ethereum balance...';
			contractAddress = "0x8e4d858128c9ba2d3a7636892268fab031eddaf8";
			refreshTokenBalance("0x8e4d858128c9ba2d3a7636892268fab031eddaf8", eubiBalance, walletAddressRAW, "EUBI", 12);
			web3.eth.getBalance(walletAddressRAW).then(function(value){
				var vl = value.length;
				if(vl > 18){
					vl -= 18;
					value = value.substring(0, vl) + "." + value.substring(vl).padEnd(18, "0");
				} else{
					value = "0." + value.padStart(18, "0");
				}
				nativeBalance.innerHTML = value + " ETH";
			}, function(error){
				nativeBalance.innerHTML = "ERROR: Can't load Ethereum balance!";
			});
			loadTokenContract("0x8e4d858128c9ba2d3a7636892268fab031eddaf8").methods.dividendOf(walletAddressRAW).call().then(function(value){
				var vl = value.length;
				if(vl > 18){
					vl -= 18;
					value = value.substring(0, vl) + "." + value.substring(vl).padEnd(18, "0");
				} else{
					value = "0." + value.padStart(18, "0");
				}
				pendingDividends.innerHTML = "Pending: " + value + " ETH";
			}, function(error){
				pendingDividends.innerHTML = "ERROR: Can't load pending dividends";
			});
			loadTokenContract("0x8e4d858128c9ba2d3a7636892268fab031eddaf8").methods.stakingBalance(walletAddressRAW).call().then(function(value){
				var vl = value.length;
				if(vl > 12){
					vl -= 12;
					value = value.substring(0, vl) + "." + value.substring(vl).padEnd(12, "0");
				} else{
					value = "0." + value.padStart(12, "0");
				}
				stakedTokensText.innerHTML = "Staked: " + value + " EUBI";
			}, function(error){
				stakedTokensText.innerHTML = "ERROR: Can't load staking balance";
			});
			break;
		default:
			eubiBalance.innerHTML = "EUBI is not deployed on this blockchain!";
			nativeBalance.innerHTML='Loading unknown balance...';
			web3.eth.getBalance(walletAddressRAW).then(function(value){
				var vl = value.length;
				if(vl > 18){
					vl -= 18;
					value = value.substring(0, vl) + "." + value.substring(vl).padEnd(18, "0");
				} else{
					value = "0." + value.padStart(18, "0");
				}
				nativeBalance.innerHTML = value + " unknown";
			}, function(error){
				nativeBalance.innerHTML = "ERROR: Can't load unknown balance!";
			});
			break;
	}
};
const loadWallet = async function(){
	navigator.clipboard.readText().then(function(value){
		privateKeyRAW = value;
		try{
			loadedAccount = web3.eth.accounts.privateKeyToAccount(privateKeyRAW);
		} catch(err){
			loadedAccount = null;
		}
		if(loadedAccount == null){
			walletMessage.innerHTML = "Can't load wallet, please copy your private key first!";
			MultipurpuseModalInstance.open();
		} else{
			walletMessage.innerHTML = "Your wallet was successfully loaded, thank you for using MyEUBIWallet!";
			MultipurpuseModalInstance.open();
			walletAddressRAW = loadedAccount.address;
			beforeWalletLoad.style.display = "none";
			afterWalletLoad.style.display = "block";
			reloadWallet();
		}
	}, function(error){
		walletMessage.innerHTML = "Can't load wallet, please copy your private key first!";
		MultipurpuseModalInstance.open();
	});
	
};
const loadWallet2 = async function(){
	if(selectedTargetWallet < 0){
		walletMessage.innerHTML = "Please select which wallet to load!";
		MultipurpuseModalInstance.open();
	} else{
		try{
			loadedAccount = web3.eth.accounts.decrypt(JSON.stringify(allSavedWallets[selectedTargetWallet]), pass3.value);
			privateKeyRAW = loadedAccount.privateKey;
		} catch(err){
			loadedAccount = null;
		}
		if(loadedAccount == null){
			walletMessage.innerHTML = "Can't load wallet!";
			MultipurpuseModalInstance.open();
		} else{
			walletAddressRAW = loadedAccount.address;
			beforeWalletLoad.style.display = "none";
			afterWalletLoad.style.display = "block";
			walletMessage.innerHTML = "Your wallet was successfully loaded, thank you for using MyEUBIWallet!";
			MultipurpuseModalInstance.open();
			reloadWallet();
		}
	}
};
const deleteWallet = async function(){
	allSavedWallets[selectedTargetWallet] = "deleted wallet";
	flushWalletStorage();
};
const renameWallet = async function(){
	allSavedWallets[selectedTargetWallet].name = storedWalletName2.value;
	flushWalletStorage();
};
const convDecimalToRaw = function(value, decimals){
	value = value.split(".");
	if(value.length == 1){
		value[1] = '0';
	}
	return new BigInt(value[0]).mul(new BigInt("1".padEnd(decimals + 1, "0"))).add(new BigInt(value[1].padEnd(decimals, "0"))).toString();
};
const NativeSend = async function(){
	//write transaction
	sendNativeButton.disabled = true;
	var transaction = {};
	transaction.to = sendtoNative.value;
	transaction.value = convDecimalToRaw(NativeAmount.value, 18);
	var networkId2 = networkId;
	var realNativeSend = function(value){
		transaction.gas = value;
		//sign and send transaction
		loadedAccount.signTransaction(transaction).then(function(value){
			web3.eth.sendSignedTransaction(value.rawTransaction).then(function(value){
				if(value === null){
					walletMessage.innerHTML = "Transaction sent successfully!";
				} else{
					switch(networkId2){
						case 24734:
							walletMessage.innerHTML = "Transaction sent successfully! <a href=\"https://www.mintme.com/explorer/tx/" + value.transactionHash + "\">view on blockchain explorer</a>";
							break;
						case 56:
							walletMessage.innerHTML = "Transaction sent successfully! <a href=\"https://www.bscscan.com/tx/" + value.transactionHash + "\">view on blockchain explorer</a>";
							break;
						case 3:
							walletMessage.innerHTML = "Transaction sent successfully! <a href=\"https://ropsten.etherscan.io/tx/" + value.transactionHash + "\">view on blockchain explorer</a>";
							break;
					}
				}
				sendNativeButton.disabled = false;
				MultipurpuseModalInstance.open();
				reloadWallet();
			}, function(error){
				sendNativeButton.disabled = false;
				walletMessage.innerHTML = "Can't send transaction!";
				MultipurpuseModalInstance.open();
				reloadWallet();
			});
		}, function(error){
			sendNativeButton.disabled = false;
			walletMessage.innerHTML = "Can't sign transaction!";
			MultipurpuseModalInstance.open();
		});
	};
	web3.eth.estimateGas(transaction).then(function(value){
		realNativeSend(value);
	}, function(error){
		realNativeSend("21000");
	});
};
const sendeubitx = async function(meth){
	sendEubiButton.disabled = true;
	approveEubiButton.disabled = true;
	//write transaction
	var transaction = {};
	var decimals = 12;
	var contractAddress2 = "0x8AFA1b7a8534D519CB04F4075D3189DF8a6738C1";
	var networkId2 = networkId;
	switch(networkId2){
		case 24734:
			break;
		case 56:
			decimals = 18;
			contractAddress2 = "0x27fAAa5bD713DCd4258D5C49258FBef45314ae5D";
			break;
		case 3:
			contractAddress2 = "0x8e4d858128c9ba2d3a7636892268fab031eddaf8";
			break;
		default:
			walletMessage.innerHTML = "EUBI is not deployed on this blockchain!";
			MultipurpuseModalInstance.open();
			sendEubiButton.disabled = false;
			approveEubiButton.disabled = false;
			return;
	}
	transaction.data = loadedTokenContracts[contractAddress2].methods["transfer"](sendto.value, convDecimalToRaw(eubiamount.value, decimals)).encodeABI();
	transaction.to = contractAddress2;
	var AfterGasEstimate = function(value){
		transaction.gas = value;
		//sign and send transaction
		loadedAccount.signTransaction(transaction).then(function(value){
			web3.eth.sendSignedTransaction(value.rawTransaction).then(function(value){
				if(value === null){
					walletMessage.innerHTML = "Transaction sent successfully!";
					sendEubiButton.disabled = false;
					approveEubiButton.disabled = false;
				} else{
					switch(networkId2){
						case 24734:
							walletMessage.innerHTML = "Transaction sent successfully! <a href=\"https://www.mintme.com/explorer/tx/" + value.transactionHash + "\">view on blockchain explorer</a>";
							break;
						case 56:
							walletMessage.innerHTML = "Transaction sent successfully! <a href=\"https://www.bscscan.com/tx/" + value.transactionHash + "\">view on blockchain explorer</a>";
							break;
						case 3:
							walletMessage.innerHTML = "Transaction sent successfully! <a href=\"https://ropsten.etherscan.io/tx/" + value.transactionHash + "\">view on blockchain explorer</a>";
							break;
					}
				}
				sendEubiButton.disabled = false;
				approveEubiButton.disabled = false;
				MultipurpuseModalInstance.open();
				reloadWallet();
			}, function(error){
				walletMessage.innerHTML = "Can't send transaction!";
				MultipurpuseModalInstance.open();
				sendEubiButton.disabled = false;
				approveEubiButton.disabled = false;
				reloadWallet();
			});
		}, function(error){
			walletMessage.innerHTML = "Can't sign transaction!";
			MultipurpuseModalInstance.open();
			sendEubiButton.disabled = false;
			approveEubiButton.disabled = false;
		});
	};
	
	web3.eth.estimateGas(transaction).then(AfterGasEstimate, function(error){
		AfterGasEstimate("100000");
	});
};
const ManageDividends = async function(action){
	withdrawDividendButton.disabled = true;
	unstakeEubiButton.disabled = true;
	//write transaction
	var transaction = {};
	if(action == "withdraw"){
		transaction.data = loadedTokenContracts["0x8e4d858128c9ba2d3a7636892268fab031eddaf8"].methods.withdrawDividend().encodeABI();
	} else{
		transaction.data = loadedTokenContracts["0x8e4d858128c9ba2d3a7636892268fab031eddaf8"].methods.withdrawStakedToken(convDecimalToRaw(unstakeAmount.value, 12)).encodeABI();
	}
	transaction.gas = "200000"
	transaction.to = "0x8e4d858128c9ba2d3a7636892268fab031eddaf8";
	//sign and send transaction
	loadedAccount.signTransaction(transaction).then(function(value){
		web3.eth.sendSignedTransaction(value.rawTransaction).then(function(value){
			if(value === null){
				walletMessage.innerHTML = "Transaction sent successfully!";
				MultipurpuseModalInstance.open();
				withdrawDividendButton.disabled = false;
				unstakeEubiButton.disabled = false;
			} else{
				walletMessage.innerHTML = "Transaction sent successfully! <a href=\"https://ropsten.etherscan.io/tx/" + value.transactionHash + "\">view on blockchain explorer</a>";
				MultipurpuseModalInstance.open();
				withdrawDividendButton.disabled = false;
				unstakeEubiButton.disabled = false;
			}
			reloadWallet();
		}, function(error){
			walletMessage.innerHTML = "Can't send transaction!";
			MultipurpuseModalInstance.open();
			withdrawDividendButton.disabled = false;
			unstakeEubiButton.disabled = false;
			reloadWallet();
		});
	}, function(error){
		walletMessage.innerHTML = "Can't sign transaction!";
		MultipurpuseModalInstance.open();
		withdrawDividendButton.disabled = false;
		unstakeEubiButton.disabled = false;
	});
};
const encryptAndStore = async function(){
	var password2 = pass1.value;
	if(pass2.value == password2){
		var encrypted = web3.eth.accounts.encrypt(privateKeyRAW, password2);
		encrypted.name = escapeHtml(storedWalletName.value);
		allSavedWallets[allSavedWallets.length] = encrypted;
		flushWalletStorage();
		walletMessage.innerHTML = "Wallet encrypted and stored!";
	} else{
		walletMessage.innerHTML = "The two passwords doesn't match!";
	}
	MultipurpuseModalInstance.open();
};
const selectBlockchain = async function(blockchain){
	switch(blockchain){
		case "MintME1":
			customNode.style.display = "none";
			customNode3.style.display = "none";
			web3.setProvider("https://node1.mintme.com:443");
			reloadWallet();
			break;
		case "MintME2":
			customNode.style.display = "none";
			customNode3.style.display = "none";
			web3.setProvider("https://node2.mintme.com:443");
			reloadWallet();
			break;
		case "BinanceSmartChain":
			customNode.style.display = "none";
			customNode3.style.display = "none";
			web3.setProvider("https://bsc-dataseed.binance.org/");
			reloadWallet();
			break;
		case "ropsten":
			customNode.style.display = "none";
			customNode3.style.display = "none";
			web3.setProvider("https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
			reloadWallet();
			break;
		case "CustomNode":
			customNode.style.display = "block";
			customNode3.style.display = "block";
			break;
		case "browser":
			customNode.style.display = "none";
			customNode3.style.display = "none";
			web3.setProvider(Web3.givenProvider);
			reloadWallet();
			break;
		default:
			web3.setProvider(customNode2.value);
			reloadWallet();
			break;
	}
};
const logout = async function(){
	selectedTargetWallet = -1;
	loadedAccount = null;
	privateKeyRAW = "";
	walletAddressRAW = "0x0000000000000000000000000000000000000000";
	pass3.value = "";
	walletMessage.innerHTML = "Wallet unloaded!";
	afterWalletLoad.style.display = "none";
	beforeWalletLoad.style.display = "block";
};
const checkAllowance = async function(){
	if(useApprovalCheckbox.checked){
		switch(networkId){
			case 24734:
				loadTokenContract("0x8AFA1b7a8534D519CB04F4075D3189DF8a6738C1").methods.allowance(approvalOwner.value, walletAddressRAW).call().then(function(value){
					var vl = value.length;
					var decimals = 12;
					if(vl > decimals){
						vl -= decimals;
						value = value.substring(0, vl) + "." + value.substring(vl).padEnd(decimals, "0");
					} else{
						value = "0." + value.padStart(decimals, "0");
					}
					walletMessage.innerHTML = "Your remaining allowance: " + value + " EUBI";
					MultipurpuseModalInstance.open();
				}, function(error){
					walletMessage.innerHTML = "ERROR: Can't query allowance";
					MultipurpuseModalInstance.open();
				});
				break;
			case 56:
				loadTokenContract("0x27fAAa5bD713DCd4258D5C49258FBef45314ae5D").methods.allowance(approvalOwner.value, walletAddressRAW).call().then(function(value){
					var vl = value.length;
					var decimals = 18;
					if(vl > decimals){
						vl -= decimals;
						value = value.substring(0, vl) + "." + value.substring(vl).padEnd(decimals, "0");
					} else{
						value = "0." + value.padStart(decimals, "0");
					}
					walletMessage.innerHTML = "Your remaining allowance: " + value + " bEUBI";
					MultipurpuseModalInstance.open();
				}, function(error){
					walletMessage.innerHTML = "ERROR: Can't query allowance";
					MultipurpuseModalInstance.open();
				});
				break;
			case 3:
				loadTokenContract("0x8e4d858128c9ba2d3a7636892268fab031eddaf8").methods.allowance(approvalOwner.value, walletAddressRAW).call().then(function(value){
					var vl = value.length;
					var decimals = 12;
					if(vl > decimals){
						vl -= decimals;
						value = value.substring(0, vl) + "." + value.substring(vl).padEnd(decimals, "0");
					} else{
						value = "0." + value.padStart(decimals, "0");
					}
					walletMessage.innerHTML = "Your remaining allowance: " + value + " bEUBI";
					MultipurpuseModalInstance.open();
				}, function(error){
					walletMessage.innerHTML = "ERROR: Can't query allowance";
					MultipurpuseModalInstance.open();
				});
				break;
			default:
				walletMessage.innerHTML = "EUBI is not deployed on this blockchain!";
				MultipurpuseModalInstance.open();
				break;
		}
	} else{
		switch(networkId){
			case 24734:
				loadTokenContract(contractAddress).methods.allowance(walletAddressRAW, sendto.value).call().then(function(value){
					var vl = value.length;
					var decimals = 12;
					if(vl > decimals){
						vl -= decimals;
						value = value.substring(0, vl) + "." + value.substring(vl).padEnd(decimals, "0");
					} else{
						value = "0." + value.padStart(decimals, "0");
					}
					walletMessage.innerHTML = "Remaining allowance: " + value + " EUBI";
					MultipurpuseModalInstance.open();
				}, function(error){
					walletMessage.innerHTML = "ERROR: Can't query allowance";
					MultipurpuseModalInstance.open();
				});
				break;
			case 56:
				loadTokenContract(contractAddress).methods.allowance(walletAddressRAW, sendto.value).call().then(function(value){
					var vl = value.length;
					var decimals = 18;
					if(vl > decimals){
						vl -= decimals;
						value = value.substring(0, vl) + "." + value.substring(vl).padEnd(decimals, "0");
					} else{
						value = "0." + value.padStart(decimals, "0");
					}
					walletMessage.innerHTML = "Remaining allowance: " + value + " bEUBI";
					MultipurpuseModalInstance.open();
				}, function(error){
					walletMessage.innerHTML = "ERROR: Can't query allowance";
					MultipurpuseModalInstance.open();
				});
				break;
			case 3:
				loadTokenContract("0x8e4d858128c9ba2d3a7636892268fab031eddaf8").methods.allowance(walletAddressRAW, sendto.value).call().then(function(value){
					var vl = value.length;
					var decimals = 12;
					if(vl > decimals){
						vl -= decimals;
						value = value.substring(0, vl) + "." + value.substring(vl).padEnd(decimals, "0");
					} else{
						value = "0." + value.padStart(decimals, "0");
					}
					walletMessage.innerHTML = "Your remaining allowance: " + value + " bEUBI";
					MultipurpuseModalInstance.open();
				}, function(error){
					walletMessage.innerHTML = "ERROR: Can't query allowance";
					MultipurpuseModalInstance.open();
				});
				break;
			default:
				walletMessage.innerHTML = "EUBI is not deployed on this blockchain!";
				MultipurpuseModalInstance.open();
				break;
		}
	}
};
const createRPGF = function(){
	var random = web3.utils.randomHex(16);
	var to = RPGFReceiver.value;
	var value = convDecimalToRaw(RPGFAmount.value, 12);
	var temp = loadedAccount.sign(web3.eth.abi.encodeParameters(["uint256", "address", "address", "address", "address", "uint256", "uint256"], [random, "0x8AFA1b7a8534D519CB04F4075D3189DF8a6738C1", walletAddressRAW, to, to, value, "115792089237316195423570985008687907853269984665640564039457584007913129639935"]));
	navigator.clipboard.writeText(MintMEReceiverPaidGasFees.methods.sendPreauthorizedTransaction(random, "0x8AFA1b7a8534D519CB04F4075D3189DF8a6738C1", walletAddressRAW, to, value, "115792089237316195423570985008687907853269984665640564039457584007913129639935", temp.v, temp.r, temp.s).encodeABI());
	walletMessage.innerHTML = "Preauthorized transaction copied to clipboard!";
	MultipurpuseModalInstance.open();
};
const redeemRPGF = async function(){
	RPGFRedeemButton.disabled = true;
	//write transaction
	var transaction = {};
	transaction.gas = "150000";
	transaction.to = "0x1d81563e53a18136957ea28f441e06ac7b66de1b";
	transaction.privateKey = privateKeyRAW;
	transaction.data = RPGFTX.value;
	//sign and send transaction
	web3.eth.accounts.signTransaction(transaction, privateKeyRAW).then(function(value){
		web3.eth.sendSignedTransaction(value.rawTransaction).then(function(value){
			if(value === null){
				walletMessage.innerHTML = "Transaction sent successfully!";
				MultipurpuseModalInstance.open();
				RPGFRedeemButton.disabled = false;
			} else{
				walletMessage.innerHTML = "Transaction sent successfully! <a href=\"https://ropsten.etherscan.io/tx/" + value.transactionHash + "\">view on blockchain explorer</a>";
				MultipurpuseModalInstance.open();
				RPGFRedeemButton.disabled = false;
			}
			reloadWallet();
		}, function(error){
			walletMessage.innerHTML = "Can't send transaction!";
			MultipurpuseModalInstance.open();
			RPGFRedeemButton.disabled = false;
			reloadWallet();
		});
	}, function(error){
		walletMessage.innerHTML = "Can't sign transaction!";
		MultipurpuseModalInstance.open();
		RPGFRedeemButton.disabled = false;
	});
};