import './App.css';
import { useState, useEffect } from 'react';
import Axios from "axios";
import Checkbox from './components/Checkbox';


function App() {




  const [passwordGen, setPasswordGen] = useState({
    length: 5,
    uppercase: false,
    lowercase: false,
    numbers: false,
    symbols: false,
  });
  const [handelText, setHandelText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChangeUppercase = () => {
    setPasswordGen({
      ...passwordGen,
      uppercase: !passwordGen.uppercase,
    });
  };

  const handleChangeLowercase = () => {
    setPasswordGen({
      ...passwordGen,
      lowercase: !passwordGen.lowercase,
    });
  };

  const handleChangeNumbers = () => {
    setPasswordGen({
      ...passwordGen,
      numbers: !passwordGen.numbers,
    });
  };

  const handleChangeSymbols = () => {
    setPasswordGen({
      ...passwordGen,
      symbols: !passwordGen.symbols,
    });
  };

  const setPasswordLength = (val) => {
    setPasswordGen({
      ...passwordGen,
      length: val,
    });
  };

  function generatePassword() {
    const numbersArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const symbolsArray = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

    const characterCodes = Array.from(Array(26)).map((_e, i) => i + 97);
    const lowerCaseLetters = characterCodes.map((code) =>
      String.fromCharCode(code)
    );
    const upperCaseLetters = lowerCaseLetters.map((letter) =>
      letter.toUpperCase()
    );

    const { length, uppercase, lowercase, numbers, symbols } = passwordGen;

    const generateTheWord = (
      length,
      uppercase,
      lowercase,
      numbers,
      symbols
    ) => {
      const availableCharacters = [
        ...(lowercase ? lowerCaseLetters : []),
        ...(uppercase ? upperCaseLetters : []),
        ...(numbers ? numbersArray : []),
        ...(symbols ? symbolsArray : []),
      ];
      const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
      const characters = shuffleArray(availableCharacters).slice(0, length);
      setHandelText(characters.join(''));
      return characters;
    };

    generateTheWord(length, uppercase, lowercase, numbers, symbols);
  }




  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [passwordList, setPasswordList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/showpasswords").then((response) => {
      setPasswordList(response.data);
    });
  }, []);

  const addpassword = () => {
    Axios.post('http://localhost:3001/addpassword', {
      password: password,
      title: title,
    });
  };
  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3001/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => {
          return val.id === encryption.id
            ? {
              id: val.id,
              password: val.password,
              title: response.data,
              iv: val.iv,
            }
            : val;
        })
      );
    });
  };








  return (


    <div className="App">

      <div className="wrapper">
        <div className="container wrapper-box">
          <h2><center>Password Manager with Password Generator</center></h2>
          <div className="password-box">
            <input
              type="text"
              value={handelText}
              placeholder=""
              autoComplete="off"
              onChange={(e) => setHandelText(e.target.value)}
            />
            <button
              className="copy-button"
              onClick={() => {
                if (handelText.length > 0) {
                  navigator.clipboard.writeText(handelText);
                  setCopied(true);
                  setInterval(() => {
                    setCopied(false);
                  }, 2000);
                }
              }}
            >
              {copied ? 'Copied!' : 'Copy text'}
            </button>
          </div>
          <br />
          <div className="word-crieteria__box">
            <div>
              <label>Password length</label>
            </div>
            <div>
              <input
                type="number"
                min="4"
                max="20"
                value={passwordGen.length}
                onChange={(e) => setPasswordLength(e.target.value)}
              />
            </div>
          </div>
          <div className="word-crieteria__box">
            <div>
              <label>Include uppercase letters</label>
            </div>
            <div>
              <Checkbox
                value={passwordGen.uppercase}
                onChange={handleChangeUppercase}
              />
            </div>
          </div>
          <div className="word-crieteria__box">
            <div>
              <label>Include lowercase letters</label>
            </div>
            <div>
              <Checkbox
                value={passwordGen.lowercase}
                onChange={handleChangeLowercase}
              />
            </div>
          </div>
          <div className="word-crieteria__box">
            <div>
              <label>Include numbers</label>
            </div>
            <div>
              <Checkbox
                value={passwordGen.numbers}
                onChange={handleChangeNumbers}
              />
            </div>
          </div>
          <div className="word-crieteria__box">
            <div>
              <label>Include symbols</label>
            </div>
            <div>
              <Checkbox
                value={passwordGen.symbols}
                onChange={handleChangeSymbols}
              />
            </div>
          </div>
          <div>
            <button className="generate-button" onClick={generatePassword}>
              Generate password
            </button>
          </div>
        </div>
      </div>










      <div className="AddingPassword">
        <input
          type="text"
          placeholder="Ex. password123"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Ex. Facebook"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <button onClick={addpassword}><b> Add Password</b></button>
      </div>
      <div className="Passwords">
        {passwordList.map((val, key) => {
          return (
            <div
              className="password"
              onClick={() => {
                decryptPassword({
                  password: val.password,
                  iv: val.iv,
                  id: val.id,
                });
              }}
              key={key}
            >
              <h3>{val.title}</h3>
            </div>
          );

        })}
      </div>




      <br></br>
      <hr></hr>




    </div>

  );
}

export default App;
