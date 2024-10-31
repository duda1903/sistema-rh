import React from 'react';
import './styles/style.css';
import logo from './assets/logoV02.png'; // Importando a imagem

const WelcomeScreen = () => {
  return (
    <div id='cont1' className="container-fluid welcome-screen">
      <div className="row">
        <div className="col-md-6 left-section">
          <div id='textV01'>
            <h1>BEM-VINDO!</h1>
            <p>Se você está procurando uma oportunidade de emprego, está no lugar certo</p>
          </div>
          </div>
          <div id='logoV02'>
            <img src={logo} alt='Logo' /> {/* Usando a variável importada */}
          </div>
        
      </div>

      <div id='cont2' className="container-fluid welcome-screen">
        <div className="col-md-6 right-section">
          <h3>Selecione abaixo sua equipe</h3>
          <button className="btn btn-light">Líder de equipe</button>
          <button className="btn btn-light">Gestor do RH</button>
          <button className="btn btn-light">Funcionário</button>
          <div className="mt-3">
            <p>Ainda não faz parte da empresa?</p>
            <button className="btn btn-success">CANDIDATAR-ME</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;