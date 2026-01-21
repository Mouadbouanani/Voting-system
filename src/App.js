<<<<<<< HEAD
import { useEffect, useState } from "react";
import "./App.css";
import {
  connectWallet,
  fetchState,
  addCandidate as addCandidateTx,
  vote as voteTx,
} from "./eth";

function App() {
  const [account, setAccount] = useState("");
  const [admin, setAdmin] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newCandidate, setNewCandidate] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        await handleConnect();
      } catch (err) {
        setError(err.message);
      }
    };
    init();
  }, []);

  const handleConnect = async () => {
    setError("");
    setLoading(true);
    try {
      const addr = await connectWallet();
      setAccount(addr);
      await refreshState();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshState = async () => {
    try {
      const state = await fetchState();
      setAdmin(state.admin);
      setCandidates(state.candidates);
      setHasVoted(state.alreadyVoted);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidate.trim()) return;
    setLoading(true);
    setError("");
    try {
      await addCandidateTx(newCandidate.trim());
      setNewCandidate("");
      await refreshState();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id) => {
    setLoading(true);
    setError("");
    try {
      await voteTx(id);
      await refreshState();
      setHasVoted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = account && admin && account.toLowerCase() === admin.toLowerCase();

  return (
    <div className="App">
      <header>
        <h1>Voting dApp</h1>
        <p className="muted">
          Connectez votre wallet et votez pour un candidat.
        </p>
      </header>

      {!account && (
        <button className="primary" onClick={handleConnect}>
          Se connecter au wallet
        </button>
      )}

      {account && (
        <div className="panel">
          <div className="row">
            <span>Compte : {account}</span>
            <span>Admin : {admin || "—"}</span>
          </div>
          <div className="row">
            <span>
              Statut : {hasVoted ? "Déjà voté" : "Peut voter"}
            </span>
          </div>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      {loading && <div className="muted">Chargement...</div>}

      {isAdmin && (
        <form className="panel" onSubmit={handleAddCandidate}>
          <h3>Ajouter un candidat</h3>
          <div className="row">
            <input
              value={newCandidate}
              onChange={(e) => setNewCandidate(e.target.value)}
              placeholder="Nom du candidat"
            />
            <button className="primary" type="submit">
              Ajouter
            </button>
          </div>
        </form>
      )}

      <section className="panel">
        <h3>Candidats</h3>
        {candidates.length === 0 && (
          <div className="muted">Aucun candidat pour le moment.</div>
        )}
        {candidates.map((c) => (
          <div key={c.id} className="candidate">
            <div>
              <strong>{c.name}</strong>
              <div className="muted">Votes : {c.votes}</div>
            </div>
            <button
              disabled={hasVoted || loading}
              onClick={() => handleVote(c.id)}
            >
              Voter
            </button>
          </div>
        ))}
      </section>
=======
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
>>>>>>> f6f3b71e9df6c3f3bdea69464a9eb2076d772ce0
    </div>
  );
}

export default App;
