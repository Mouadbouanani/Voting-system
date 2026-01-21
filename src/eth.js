import { ethers } from "ethers";
import votingArtifact from "./abi/Voting.json";

const defaultAddress = "0x0000000000000000000000000000000000000000";
const contractAddress =
  process.env.REACT_APP_VOTING_ADDRESS || defaultAddress;

function getProvider() {
  if (!window.ethereum) {
    throw new Error("Aucun provider Web3 détecté (MetaMask manquant ?)");
  }
  return new ethers.providers.Web3Provider(window.ethereum);
}

async function getSigner() {
  const provider = getProvider();
  const accounts = await provider.send("eth_requestAccounts", []);
  return provider.getSigner(accounts[0]);
}

async function getContract() {
  if (!contractAddress || contractAddress === defaultAddress) {
    throw new Error(
      "Adresse du contrat manquante. Renseignez REACT_APP_VOTING_ADDRESS."
    );
  }
  const provider = getProvider();
  const code = await provider.getCode(contractAddress);
  if (!code || code === "0x") {
    const net = await provider.getNetwork();
    throw new Error(
      `Aucun contrat trouvé à cette adresse sur le réseau courant (chainId=${net.chainId}). ` +
        `Vérifiez MetaMask (Ganache) et l'adresse REACT_APP_VOTING_ADDRESS.`
    );
  }
  const signer = await getSigner();
  return new ethers.Contract(contractAddress, votingArtifact.abi, signer);
}

export async function connectWallet() {
  const signer = await getSigner();
  return signer.getAddress();
}

export async function fetchState() {
  const contract = await getContract();
  const signer = contract.signer;
  const account = await signer.getAddress();
  const admin = await contract.admin();
  const candidatesCount = (await contract.candidatesCount()).toNumber();
  const alreadyVoted = await contract.hasVoted(account);

  const candidates = [];
  for (let i = 1; i <= candidatesCount; i++) {
    const [id, name, voteCount] = await contract.getCandidate(i);
    candidates.push({
      id: id.toNumber(),
      name,
      votes: voteCount.toNumber(),
    });
  }

  return { account, admin, candidates, alreadyVoted };
}

export async function addCandidate(name) {
  const contract = await getContract();
  const tx = await contract.addCandidate(name);
  await tx.wait();
}

export async function vote(candidateId) {
  const contract = await getContract();
  const tx = await contract.vote(candidateId);
  await tx.wait();
}

